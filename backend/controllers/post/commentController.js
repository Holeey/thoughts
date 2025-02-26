const { commentModel, replyModel } = require("../../model/commentModel.js");
const postModel = require("../../model/postModel.js");

const populateReplies = async (replyId) => {
   const reply = await replyModel.findById(replyId).populate({
     path: 'user',
     select: '_id nick_name profile_image', // Specify the fields you want to populate
   });
  
   if (!reply) return null;
  
   let populatedReplies = [];
  
   if (reply.replies.length > 0) {
    populatedReplies = await Promise.all((reply.replies || []).map(async (nestedReply) => {
       return await populateReplies(nestedReply._id);
     }));
   }
   return { ...reply.toObject(), replies: populatedReplies };
 };
 const populateComments = async (commentId) => {
    const comment = await commentModel.findById(commentId).populate({
    path: 'user',
    select: '_id nick_name profile_image', // Specify the fields you want to populate
  });
   if (!comment) return null;
   const populatedReplies = await Promise.all((comment.replies || []).map(async (replyId) => {
     return await populateReplies(replyId);
   }));
   return { ...comment.toObject(), replies: populatedReplies };
 };


exports.getComments = async (req, res) => {
  try {
    const comments = await commentModel.find({ post: req.params.id });
    if (!comments || comments.length === 0) {
      return res.status(404).json("No comments found for the specified post");
    }

    const populatedComments = await Promise.all(comments.map(async (comment) => {
      return await populateComments(comment._id);
    }));

    return res.status(200).json(populatedComments);
  } catch (error) {
    console.error("getComments:", error);
    return res.status(500).json("Internal error:", error.message);
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

     const updatedPopulatedComment = await populateComments(updatedComment._id)

    res.status(201).json(updatedPopulatedComment);
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

    const updatedPopulatedReply = await populateReplies(updatedReply._id)

    res.status(201).json(updatedPopulatedReply);
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
  try {
      const reply = await replyModel.findById(replyId);
      if (!reply) {
          return;
      }
      // Recursively delete child replies
      for (const childReplyId of reply.replies) {
          await recursivelyDeleteReply(childReplyId); 
      }
      // Delete current reply
      await replyModel.findByIdAndDelete(replyId);
  } catch (error) {
      console.error('Error deleting reply:', error);
  }
};
exports.deleteComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json("Unauthorized user!");
    }

    // Check if the ID corresponds to a parent comment
    const parentComment = await commentModel.findById(req.params.commentId);
    if (parentComment) {
      // Check if the user is authorized to delete the parent comment
      if (req.user._id.toString() !== parentComment.user.toString()) {
        return res.status(400).json("Unauthorized user!");
      }

      // Recursively delete the replies of the parent comment
      if (parentComment.replies && parentComment.replies.length > 0) {
        for (const replyId of parentComment.replies) {
          await recursivelyDeleteReply(replyId);
        }
      }

      // Delete the parent comment
      await commentModel.findByIdAndDelete(req.params.commentId);

      return res.status(201).json({ id: req.params.commentId });
    }

    // Check if the ID corresponds to a child comment
    const childComment = await replyModel.findById(req.params.commentId);
    if (childComment) {
      // Check if the user is authorized to delete the child comment
      if (req.user._id.toString() !== childComment.user.toString()) {
        return res.status(400).json("Unauthorized user!");
      }

      // Delete the child comment
      await replyModel.findByIdAndDelete(req.params.commentId);

      // Check if the parent is a root comment or a reply comment
      const rootComment = await commentModel.findOne({ replies: req.params.commentId });
      if (rootComment) {
        // Remove the deleted child comment from the root comment's replies array
        await commentModel.updateOne(
          { _id: rootComment._id },
          { $pull: { replies: req.params.commentId } }
        );
      } else {
        const replyComment = await replyModel.findOne({ replies: req.params.commentId });
        // Remove the deleted child comment from its parent's replies array
        await replyModel.updateOne(
          { _id: replyComment._id },
          { $pull: { replies: req.params.commentId } }
        );
      }

      return res.status(201).json({ id: req.params.commentId });
    }

    // If neither a parent nor child comment was found
    return res.status(404).json("Comment not found!");
  } catch (error) {
    return res.status(500).json("Internal error!", error);
  }
};


////// votes controller for comment and replies ///////////


exports.commentUpvotes = async (req, res) => {

  try {

    const comment = await commentModel.findOne({ _id: req.params.id });
    const reply = await replyModel.findOne({ _id: req.params.id });

    if (!(comment || reply)) {

      return res.status(404).json({ error: "Comment or reply not found!" });
    }

    if (!req.user) {

      return res.status(401).json({ error: "Unauthorized user!" });
    }

    if (comment) {
      const existingCommentUpvoteIndex = comment.upvote.findIndex(
        (vote) => vote.user && vote.user._id.equals(req.user._id)
      );
      if (existingCommentUpvoteIndex === -1) {
        comment.upvote.push({ user: req.user });
        comment.upvoteValue += 1;
      } else {
        comment.upvote.splice(existingCommentUpvoteIndex, 1);
        comment.upvoteValue -= 1;
      }

      await comment.save();
      const updatedComment = await populateComments(comment._id);
     if (!updatedComment ) {
        return res.status(500).json({ error: "Failed to update comment" });
    }

      return res.status(200).json(updatedComment);
    } 
    
    if (reply) {
      const existingReplyUpvoteIndex = reply.upvote.findIndex(
        (vote) => vote.user && vote.user._id.equals(req.user._id)
      );

      if (existingReplyUpvoteIndex === -1) {
        reply.upvote.push({ user: req.user });
        reply.upvoteValue += 1;
      } else {
        reply.upvote.splice(existingReplyUpvoteIndex, 1);
        reply.upvoteValue -= 1;
      }

      await reply.save();
      const updatedReply = await populateReplies(reply._id);

      console.log("updatedReply:", updatedReply)
 
      return res.status(200).json(updatedReply);

    
    }
  } catch (error) {
    console.error("comment/reply-upvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.commentDownvotes = async (req, res) => {

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
       await comment.save()
  
      const updatedComment = await populateComments(comment._id);
      
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
      await reply.save();

       const updatedReply = await populateReplies(reply._id);

      return res.status(200).json(updatedReply);
    }
  } catch (error) {
    console.error("comment/reply-downvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
