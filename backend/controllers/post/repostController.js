const repostModel = require("../../model/repostModel.js");
const postModel = require("../../model/postModel.js");

exports.createRepost = async (req, res) => {
  const { repostComment } = req.body;
  const { id } = req.params;

  if (!req.user) {
    return res.status(400).json("Unauthorized user");
  }

  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json("Post not found");
    }

    const repost = await repostModel.create({
      originalPost: id,
      user: req.user._id,
      repostComment: repostComment,
    });

    post.reposts.push(repost._id); // Assuming `post.reposts` is an array

    await post.save();

    return res.status(201).json(repost);
  } catch (error) {
    console.error("Error creating repost:", error);
    return res.status(500).json("Internal server error");
  }
};
exports.getAllReposts = async (req, res) => {
  try {
    const reposts = await repostModel
      .find()
      .populate({
        path: "originalPost",
        populate: {
          path: "user",
          select: "_id nick_name bio profile_image",
        },
      })
      .populate({
        path: "user",
        select: "_id nick_name bio profile_image",
      });

    if (!reposts) {
      return res.status(404).json("Repost not found");
    }

    return res.status(200).json(reposts);
  } catch (error) {
    console.error("Error fetching repost:", error);
    return res.status(500).json("Internal server error");
  }
};
exports.updateRepost = async (req, res) => {
  const { repostComment } = req.body;
  try {
    const post = await repostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json("Repost not found!");
    }
    if (!req.user) {
      return res.status(404).json(" user not found!");
    }
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(404).json("Unauthorized user!");
    }
    const updatedPost = await repostModel
      .findByIdAndUpdate(
        req.params.id,
        { repostComment: repostComment },
        { new: true }
      )
      .populate({
        path: "originalPost",
        populate: {
          path: "user",
          select: "_id nick_name bio profile_image",
        },
      })
      .populate({
        path: "user",
        select: "_id nick_name bio profile_image",
      });

    return res.status(201).json(updatedPost);
  } catch (error) {
    console.error("updating repost error:", error);
    return res.status(500).json("Internal error!");
  }
};
exports.deleteRepost = async (req, res) => {
  try {
    const post = await repostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json("No Repost found!");
    }
    if (!req.user) {
      return res.status(404).json("User not found!");
    }
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(404).json("Unauthorized user!");
    }

    await repostModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ id: req.params.id });
  } catch (error) {
    console.error("deleting repost error:", error);
    return res.status(500).json("Internal error!");
  }
};

////// votes routes handler ///////////

exports.upvote_repost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Ensure the post exists and the user is authenticated
    const post = await repostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized user!" });
    }

    // Determine if the user has already upvoted
    const existingUpvoteIndex = post.upvote.findIndex(
      (vote) => vote.user && vote.user._id.equals(userId)
    );
    const existingDownvoteIndex = post.downvote.findIndex(
      (vote) => vote.user && vote.user._id.equals(userId)
    );

    let update;
    if (existingUpvoteIndex === -1) {
      // User has not upvoted, add the upvote and remove any existing downvote
      update = {
        $push: { upvote: { user: userId } },
        $inc: { upvoteValue: 1 },
      };

      if (existingDownvoteIndex !== -1) {
        update.$pull = { downvote: { user: userId } };
        update.$inc.downvoteValue = -1;
      }
    } else {
      // User has already upvoted, remove the upvote
      update = {
        $pull: { upvote: { user: userId } },
        $inc: { upvoteValue: -1 },
      };
    }

    // Perform the update
    const updatedPost = await repostModel
      .findOneAndUpdate({ _id: postId }, update, { new: true })
      .populate({
        path: "originalPost",
        populate: {
          path: "user",
          select: "_id nick_name bio profile_image",
        },
      })
      .populate({ path: "user", select: "_id nick_name bio profile_image" });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("upvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.downvote_repost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Ensure the post exists and the user is authenticated
    const post = await repostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized user!" });
    }
    // Determine if the user has already downvoted
    const existingDownvoteIndex = post.downvote.findIndex(
      (vote) => vote.user && vote.user._id.equals(userId)
    );
    const existingUpvoteIndex = post.upvote.findIndex(
      (vote) => vote.user && vote.user._id.equals(userId)
    );

    let update;
    if (existingDownvoteIndex === -1) {
      // User has not downvoted, add the downvote and remove any existing upvote
      update = {
        $push: { downvote: { user: userId } },
        $inc: { downvoteValue: 1 },
      };

      if (existingUpvoteIndex !== -1) {
        update.$pull = { upvote: { user: userId } };
        update.$inc.upvoteValue = -1;
      }
    } else {
      // User has already downvoted, remove the downvote
      update = {
        $pull: { downvote: { user: userId } },
        $inc: { downvoteValue: -1 },
      };
    }

    // Perform the update
    const updatedPost = await repostModel
      .findOneAndUpdate({ _id: postId }, update, { new: true })
      .populate({
        path: "originalPost",
        populate: {
          path: "user",
          select: "_id nick_name bio profile_image",
        },
      })
      .populate({ path: "user", select: "_id nick_name bio profile_image" });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("downvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
