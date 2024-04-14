const mongoose = require("mongoose").default;
const postModel = require("../../model/postModel.js");
const path = require("path");
const fs = require("fs");

exports.createPost = async (req, res) => {
  try {
    // Extract data from request body
    const { postTitle, postBody } = req.body;

    // Check if required fields are provided
    if (!postTitle || !postBody) {
      return res.status(400).json("Please provide post title and body");
    }

    // Extract the filename from the absolute path
    const filename = path.basename(req.file.path);

    // Save only the filename to the database
    const postImg = filename;

    // Create post using Mongoose model
    const post = await postModel.create({
      user: req.user.id,
      postTitle: postTitle,
      postBody: postBody,
      postImg: postImg, // Assign the file path to postImg field
    });

    // Respond with the created post
    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json("Internal server error");
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate({ path: "user" });

    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.myPost = async (req, res) => {
  const posts = await postModel.find({ user: req.user._id.toString() });
  return res.status(201).json(posts);
};
exports.updatePost = async (req, res) => {
  try {
    const { postTitle, postBody, postImg } = req.body;

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

    if (req.file) {
      const filename = req.file.filename;
      const newImagePath = path.resolve("frontend", "src", "images", filename);
      const currentImagePath = path.resolve(
        "frontend",
        "src",
        "images",
        post.postImg
      );
      if (fs.existsSync(currentImagePath)) {
        // Delete the existing image file
        fs.unlinkSync(currentImagePath);
        // Replace the existing image file with the new one
        fs.renameSync(req.file.path, newImagePath);
      }
      post.postImg = filename;
      await post.save();
    } else {
      if (!req.file && postImg !== undefined) {
        const newImagePath = path.resolve("frontend", "src", "images", postImg);
        const currentImagePath = path.resolve(
          "frontend",
          "src",
          "images",
          post.postImg
        );
        if (fs.existsSync(currentImagePath)) {
          // Replace the existing image file with the new one
          fs.renameSync(currentImagePath, newImagePath);
          post.postImg = postImg;
          console.log("Image file replaced successfully");
        }
      }
    }

    const updatedPost = await postModel
      .findByIdAndUpdate(
        req.params.id,
        { postTitle: postTitle, postBody: postBody, postImg: postImg },
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
////// votes routes handler ///////////
exports.upvotes = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await postModel.findById(req.params.id);

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

    const updatedPost = await postModel.findByIdAndUpdate(req.params.id, post, {
      new: true,
    }).populate("user");;

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

exports.downvotes = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await postModel.findById(req.params.id);

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

    const updatedPost = await postModel.findByIdAndUpdate(req.params.id, post, {
      new: true,
    }).populate("user");;

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
