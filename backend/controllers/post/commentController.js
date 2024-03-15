const { commentModel, replyModel } = require("../../model/commentModel.js");
const postModel = require("../../model/postModel.js");
const mongoose = require("mongoose");

const populateReplies = async (reply) => {
  // Check if 'reply' is a Mongoose document
  if (!(reply instanceof mongoose.Document)) {
    //create a new instance of the object to convert it to a mongoose document
    reply = await replyModel.findOne({ _id: reply._id }).populate("user");

    // If there are nested replies, recursively populate them
    if (reply.replies.length > 0) {
      reply.replies = await Promise.all(
        reply.replies.map(async (nestedReply) => {
          return await populateReplies(nestedReply);
        })
      );
    }
  }
  return reply;
};
const populateComments = async (comment) => {
  const populatedReplies = [];

  for (const reply of comment.replies) {
    const populatedReply = await populateReplies(reply);
    populatedReplies.push(populatedReply);
  }
  return {...comment.toObject(), replies: populatedReplies } ;
};
exports.getComments = async (req, res) => {
  try {
    const comments = await commentModel.find({ post: req.params.id }).populate('user')
    console.log('comments:', comments)
    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
      return await populateComments(comment)
      })
    );

    if (populatedComments.length === 0) {
      return res.status(401).json("No replies found for the specified post");
    }console.log('populated:', populatedComments)
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

    const comment = await commentModel.findById({ _id: req.params.commentId });
    const replyId = await replyModel.findById({ _id: req.params.replyId });
    const postId = comment.post;

    if (!postId) {
      return res.status(404).json("No post found!");
    }

    if (!(comment || replyId)) {
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
    console.error("postCommentReply:", error);
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
exports.deleteComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json("Unauthorized user!");
    }
    const comment = await commentModel.findById({ _id: req.params.id });

    if (req.user._id.toString() !== comment.user.toString()) {
      return res.status(400).json("Unauthorized user!");
    }
    await commentModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json("Internal error!", error);
  }
};

////// votes routes handler ///////////
exports.commentUpvotes = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const comment = await commentModel.findById(req.params.id);
  
      if (!comment) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "comment not found!" });
      }
  
      if (!req.user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({ error: "Unauthorized user!" });
      }
  
      const existingUpvoteIndex = comment.upvote.findIndex((vote) =>
        vote.user && vote.user._id.equals(req.user._id)
      );
  
      if (existingUpvoteIndex === -1) {
        // User has not upvoted, add the upvote
        comment.upvote.push({ user: req.user });
        comment.upvoteValue += 1;
      } else {
        // User has already upvoted, remove the upvote
        comment.upvote.splice(existingUpvoteIndex, 1);
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

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("comment-upvote error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  exports.commentDownvotes = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const comment = await commentModel.findById(req.params.id);
  
      if (!comment) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "Post not found!" });
      }
  
      if (!req.user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({ error: "Unauthorized user!" });
      }
  
      const existingDownvoteIndex = comment.downvote.findIndex((vote) =>
        vote.user && vote.user._id.equals(req.user._id)
      );
  
      if (existingDownvoteIndex === -1) {
        // User has not downvoted, add the downvote
        comment.downvote.push({ user: req.user });
        comment.downvoteValue += 1;
      } else {
        // User has already downvoted, remove the downvote
        comment.downvote.splice(existingDownvoteIndex, 1);
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
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("comment-downvote error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
