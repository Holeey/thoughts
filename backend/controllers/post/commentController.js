const { commentModel, replyModel } = require("../../model/commentModel.js");
const postModel = require("../../model/postModel.js");
const mongoose = require("mongoose");

const populateReplies = async (reply) => {
    //create a new instance of the object to convert it to a mongoose document
    if (!reply || reply.replies) {
      return 
    }
    reply = await replyModel.findOne({ _id: reply._id }).populate("user");
  console.log('reply:', reply)
    // If there are nested replies, recursively populate them
    if (reply.replies && reply.replies.length > 0) {
      // Add null check for reply.replies
      reply.replies = await Promise.all(
        reply.replies.map(async (nestedReply) => {
          return await populateReplies(nestedReply);
        })
      );
    }
  
  return reply;
};
const populateComments = async (comment) => {
  const populatedReplies = [];

  // Check if comment has replies before iterating
  if (comment.replies && comment.replies.length > 0) {
      for (const reply of comment.replies) {
          const populatedReply = await populateReplies(reply);
          populatedReplies.push(populatedReply);
      }
  }
  return { ...comment.toObject(), replies: populatedReplies };
};

exports.getComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find({ post: req.params.id })
      .populate("user");
    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
        return await populateComments(comment);
      })
    );

    if (populatedComments.length === 0) {
      return res.status(401).json("No replies found for the specified post");
    }
    return res.status(201).json(populatedComments);
  } catch (error) {
    console.error("getComment:", error);
    return res.status(500).json("Internal error:", error);
  }
};
exports.postComment = async (req, res) => {
  try {
    const { reply } = req.body;

    const post = await postModel.findById({ _id: req.params.postId });

    if (!post) {
      return res.status(404).json("No post found!");
    }

    if (!reply) {
      return res.status(404).json("comment your thoughts!");
    }

    if (!req.user) {
      return res.status(404).json("You are not logged in");
    }

    const comment = await commentModel.create({
      user: req.user,
      post: post._id,
      comment: reply,
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("postComment:", error);
    return res.status(500).json("Internal error");
  }
};
exports.replyComment = async (req, res) => {
  try {
    const { reply } = req.body;

    const comment = await commentModel.findById({ _id: req.params.commentId });
    const postId = comment.post;

    if (!postId) {
      return res.status(404).json("No post found!");
    }

    if (!comment) {
      return res.status(404).json("No comment found!");
    }

    if (!reply) {
      return res.status(404).json("comment your thoughts!");
    }

    if (!req.user) {
      return res.status(404).json("You are not logged in");
    }
    const newReply = await replyModel.create({
      user: req.user._id,
      reply: reply,
    });

    const updatedComment = await commentModel.findByIdAndUpdate(
      { _id: req.params.commentId },
      { $push: { replies: { _id: newReply._id } } }
    );

    await newReply.save();

    res.status(201).json(updatedComment);
  } catch (error) {
    console.error("postCommentReply:", error);
    return res.status(500).json("Internal error");
  }
};
exports.replyReplies = async (req, res) => {
  try {
    const { newReply } = req.body;

    const replyId = await replyModel.findById({ _id: req.params.replyId });

    if (!replyId) {
      return res.status(404).json("No comment found!");
    }

    if (!newReply) {
      return res.status(404).json("comment your thoughts!");
    }

    if (!req.user) {
      return res.status(404).json("You are not logged in");
    }
    const reply = await replyModel.create({
      user: req.user._id,
      reply: newReply,
    });

    const updatedReply = await replyModel.findByIdAndUpdate(
      { _id: req.params.replyId },
      { $push: { replies: { _id: reply._id } } }
    );

    res.status(201).json(updatedReply);
  } catch (error) {
    console.error("postReplyReplies:", error);
    return res.status(500).json("Internal error");
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!req.user) {
      return res.status(400).json("Unauthorized user!");
    }
    if (!reply) {
      return res.status(400).json("Comment your thoughts!");
    }

    const comment = await commentModel.findById({ _id: req.params.id });

    if (req.user._id.toString() !== comment.user.toString()) {
      return res.status(400).json("Unauthorized user!");
    }

    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.id,
      { comment: reply },
      { new: true }
    );

    if (updatedComment) {
      return res.status(201).json(updatedComment);
    }
  } catch (error) {
    return res.status.json("Internal error");
  }
};

// Delete route handler

 const recursivelyDeleteReply = async (replyId) => {
    const reply = await replyModel.findById({_id: replyId})
    if(!reply) {
      return
    }
    //recursively delete replies
    for (const childReplyId of reply.replies) {
      await recursivelyDeleteReply(childReplyId)
    }
    //delete current reply
    await replyModel.findByIdAndDelete({_id: replyId})
  }
exports.deleteComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json("Unauthorized user!");
    }
    const comment = await commentModel.findById({ _id: req.params.id });
    const reply = await replyModel.findById({ _id: req.params.id });

    if (comment) {
      if (req.user._id.toString() !== comment.user.toString()) {
        return res.status(400).json("Unauthorized user!");
      }
      await commentModel.findByIdAndDelete(req.params.id);

     // Recursively delete the replies of the comment
    for (const replyId of comment.replies) {
      await recursivelyDeleteReply(replyId);
    }

      return res.status(201).json({ id: req.params.id });
    } else if (reply) {
      if (req.user._id.toString() !== reply.user.toString()) {
        return res.status(400).json("Unauthorized user!");
      }
      // Delete the reply
      await replyModel.findByIdAndDelete(req.params.id);

      // Remove the deleted reply from its parent's replies array
      await commentModel.updateOne(
        { replies: req.params.id },
        { $pull: { replies: req.params.id } }
      );

      return res.status(201).json({ id: req.params.id });
    }
  } catch (error) {
    return res.status(500).json("Internal error!", error);
  }
};

////// votes routes handler for comment and replies ///////////
exports.commentUpvotes = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await commentModel.findOne({ _id: req.params.id });
    const reply = await replyModel.findOne({ _id: req.params.id });

    if (!(comment || reply)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "comment not found!" });
    }

    if (!req.user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ error: "Unauthorized user!" });
    }

    if (comment) {
      const existingCommentUpvoteIndex = comment.upvote.findIndex(
        (vote) => vote.user && vote.user._id.equals(req.user._id)
      );
      if (existingCommentUpvoteIndex === -1) {
        // User has not upvoted, add the upvote
        comment.upvote.push({ user: req.user });
        comment.upvoteValue += 1;
      } else {
        // User has already upvoted, remove the upvote
        comment.upvote.splice(existingCommentUpvoteIndex, 1);
        comment.upvoteValue -= 1;
      }

      const updatedComment = await commentModel.findByIdAndUpdate(
        req.params.id,
        comment,
        { new: true }
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedComment);
    } else if (reply) {
      const existingReplyUpvoteIndex = reply.upvote.findIndex(
        (vote) => vote.user && vote.user._id.equals(req.user._id)
      );

      if (existingReplyUpvoteIndex === -1) {
        // User has not upvoted, add the upvote
        reply.upvote.push({ user: req.user });
        reply.upvoteValue += 1;
      } else {
        // User has already upvoted, remove the upvote
        reply.upvote.splice(existingReplyUpvoteIndex, 1);
        reply.upvoteValue -= 1;
      }

      const updatedReply = await replyModel.findByIdAndUpdate(
        req.params.id,
        reply,
        { new: true }
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedReply);
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("comment/reply-upvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.commentDownvotes = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await commentModel.findOne({ _id: req.params.id });
    const reply = await replyModel.findOne({ _id: req.params.id });

    if (!(comment || reply)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "comment not found!" });
    }

    if (!req.user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ error: "Unauthorized user!" });
    }

    if (comment) {
      const existingCommentDownvoteIndex = comment.downvote.findIndex(
        (vote) => vote.user && vote.user._id.equals(req.user._id)
      );

      if (existingCommentDownvoteIndex === -1) {
        // User has not downvoted, add the downvote
        comment.downvote.push({ user: req.user });
        comment.downvoteValue += 1;
      } else {
        // User has already downvoted, remove the downvote
        comment.downvote.splice(existingCommentDownvoteIndex, 1);
        comment.downvoteValue -= 1;
      }

      const updatedComment = await commentModel.findByIdAndUpdate(
        req.params.id,
        comment,
        { new: true }
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedComment);
    } else if (reply) {
      const existingReplyDownvoteIndex = reply.downvote.findIndex(
        (vote) => vote.user && vote.user._id.equals(req.user._id)
      );

      if (existingReplyDownvoteIndex === -1) {
        // User has not downvoted, add the downvote
        reply.downvote.push({ user: req.user });
        reply.downvoteValue += 1;
      } else {
        // User has already downvoted, remove the downvote
        reply.downvote.splice(existingReplyDownvoteIndex, 1);
        reply.downvoteValue -= 1;
      }

      const updatedReply = await replyModel.findByIdAndUpdate(
        req.params.id,
        reply,
        { new: true }
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedReply);
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("comment/reply-downvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
