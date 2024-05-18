const repostModel = require("../../model/repostModel.js");
const postModel = require("../../model/postModel.js");

exports.createRepost = async (req, res) => {
  const  { repostComment }  = req.body;
  const { id } = req.params;

  console.log("RepostId:", id, "repostComment:", repostComment);


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
  const { repostId } = req.params;

  try {
    const repost = await repostModel.findById(repostId).populate({
      path: "originalPost",
      populate: {
        path: "user",
        select: "_id nick_name profile_image", // Specify the fields you want to populate
      },
    });

    if (!repost) {
      return res.status(404).json("Repost not found");
    }

    return res.status(200).json(repost);
  } catch (error) {
    console.error("Error fetching repost:", error);
    return res.status(500).json("Internal server error");
  }
};
exports.updateRepost = async (req, res) => {
  try {
    const { postBody } = req.body;

    const post = await repostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found!");
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
        { repostComment: postBody },
        { new: true }
      )
      .populate("user");

    if (updatedPost) {
      return res.status(201).json(updatedPost);
    }
  } catch (error) {
    console.error("updating post error:", error);
    return res.status(500).json("Internal error!");
  }
};
exports.deleteRepost = async (req, res) => {
  try {
    const post = await repostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json("No post found!");
    }
    if (!req.user) {
      return res.status(404).json("User not found!");
    }
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(404).json("Unauthorized user!");
    }
    // Check if the post has an associated image
    if (post.postImg) {
      const imagePath = path.resolve(
        "frontend",
        "src",
        "images",
        post.postImg
      );

      // Use fs.unlink to delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }

    await repostModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ id: req.params.id });
  } catch (error) {
    console.error("deleting post error:", error);
    return res.status(500).json("Internal error!");
  }
};

////// votes routes handler ///////////

exports.upvotes_repost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await repostModel.findById(req.params.id).lean().session(session);;

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Post not found!" });
    }

    if (!req.user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ error: "Unauthorized user!" });
    }

    const existingUpvoteIndex = post.upvote.findIndex(
      (vote) => vote.user && vote.user._id.equals(req.user._id)
    );

    if (existingUpvoteIndex === -1) {
      // User has not upvoted, add the upvote
      post.upvote.push({ user: req.user });
      post.upvoteValue += 1;
    } else {
      // User has already upvoted, remove the upvote
      post.upvote.splice(existingUpvoteIndex, 1);
      post.upvoteValue -= 1;
    }

    const updatedPost = await repostModel.findByIdAndUpdate(req.params.id, post, {
      new: true,
    }).populate("user").lean().session(session);

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json(updatedPost);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("upvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.downvotes_repost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await repostModel.findById(req.params.id).lean().session(session);;

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Post not found!" });
    }

    if (!req.user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ error: "Unauthorized user!" });
    }

    const existingDownvoteIndex = post.downvote.findIndex(
      (vote) => vote.user && vote.user._id.equals(req.user._id)
    );

    if (existingDownvoteIndex === -1) {
      // User has not downvoted, add the downvote
      post.downvote.push({ user: req.user });
      post.downvoteValue += 1;
    } else {
      // User has already downvoted, remove the downvote
      post.downvote.splice(existingDownvoteIndex, 1);
      post.downvoteValue -= 1;
    }

    const updatedPost = await repostModel.findByIdAndUpdate(req.params.id, post, {
      new: true,
    }).populate("user").lean().session(session);

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json(updatedPost);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("downvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


