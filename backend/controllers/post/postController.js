const mongoose = require("mongoose").default;
const postModel = require("../../model/postModel.js");

exports.getAllPosts = async (req, res) => {
  try {
    const post = await postModel.find().populate('user');

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.myPost = async (req, res) => {
  const posts = await postModel.find({ user: req.user._id.toString() });
  return res.status(201).json(posts);
};
exports.createPost = async (req, res) => {
  try {
    const { postTitle, postBody } = req.body;

    if (!postTitle || !postBody) {
      return res.status(401).json("Please add fields");
    }
    const post = await postModel.create({
      user: req.user.id,
      postTitle: postTitle,
      postBody: postBody,
    });

    if (post) {
      return res.status(201).json(post);
    }
  } catch (error) {
    console.error("create post error:", error);
    return res.status(500).json("Internal error");
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { postTitle, postBody } = req.body;

    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found!");
    }
    if (!req.user) {
      return res.status(404).json(" user not found!");
    }
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(404).json("Unauthorized user!");
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.id,
      { postTitle: postTitle, postBody: postBody },
      { new: true }
    );

    if (updatedPost) {
      return res.status(201).json(updatedPost);
    }
  } catch (error) {
    console.error("updating post error:", error);
    return res.status(500).json("Internal error!");
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json("No post found!");
    }
    if (!req.user) {
      return res.status(404).json("User not found!");
    }
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(404).json("Unauthorized user!");
    }

    await postModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ id: req.params.id });
  } catch (error) {
    console.error("deleting post error:", error);
    return res.status(500).json("Internal error!");
  }
};
exports.searchPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json("Login in");
    }
    if (!req.query.q) {
      return res.status(400).json("Search term is required");
    }
    const { q: searchTerm } = req.query;

    const result = await postModel.find({
      postTitle: { $regex: searchTerm, $options: "i" },
    });

    if (result.length === 0) {
      return res.status(404).json("No post found!");
    } else {
      return res.status(201).json(result);
    }
  } catch (error) {
    console.error("search error:", error);
    return res.status(500).json("Internal error!");
  }
};
//////////////////////////////////////////////////////////////////////////////

exports.upvotes = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const post = await postModel.findById(req.params.id).session(session);

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Post not found!" });
    }
    
    // Ensure the downvote array exists
    post.upvote = post.upvote || [];

    // Check if the current user has already upvoted
    const existingUpvote = post.upvote.find(upvote => upvote.user && upvote.user.equals(req.user));
   
    if (!existingUpvote) {
      // If not, add a new upvote
      post.upvote.push({ user: req.user, value: + 1});
      post.upvotedBycurrentUser = true;
      post.downvotedBycurrentUser = false;

      await post.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(post);
    } else {
      // Handle case where user has already upvoted
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "User has already upvoted this post" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("upvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

////////////////////////////////////////////////////////////////////////////


exports.downvotes = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const post = await postModel.findById(req.params.id).session(session);

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Post not found!" });
    }

    // Ensure the downvote array exists
    post.downvote = post.downvote || [];

    // Check if the current user has already downvoted
    const existingDownvote = post.downvote.find(downvote => downvote.user && downvote.user.equals(req.user));

    if (!existingDownvote) {
      // If not, add a new downvote
      post.downvote.push({ user: req.user, value: + 1});
      post.upvotedBycurrentUser = false;
      post.downvotedBycurrentUser = true;

      await post.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(post);
    } else {
      // Handle case where user has already downvoted
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "User has already downvoted this post" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("downvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.unUpvoted = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const user = req.user
  console.log('user:', user)
  try {
    const post = await postModel.findById(req.params.id).session(session);

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Post not found!" });
    }

    const existingUpvoteIndex = post.upvote.findIndex(upvote => upvote.user.equals(req.user));

    if (existingUpvoteIndex !== -1) {
      // Remove the existing upvote with the specified user
      post.upvote.splice(existingUpvoteIndex, 1);

      // Update flags
      post.upvotedBycurrentUser = false;
      post.downvotedBycurrentUser = false;

      await post.save();
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(post);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Cannot decrement votes below zero" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("un-Upvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.unDownvoted = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const post = await postModel.findById(req.params.id).session(session);

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Post not found!" });
    }

    const existingDownvoteIndex = post.downvote.findIndex(downvote => downvote.user.equals(req.user));

    if (existingDownvoteIndex !== -1) {
      // Remove the existing upvote with the specified user
      post.upvote.splice(existingDownvoteIndex, 1);

      // Update flags
      post.upvotedBycurrentUser = false;
      post.downvotedBycurrentUser = false;

      await post.save();
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(post);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Cannot decrement votes below zero" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("un-Downvote error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
