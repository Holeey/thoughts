const postModel = require("../../model/postModel.js");


exports.getAllPosts = async (req, res) => {
  const posts = await postModel.find();
  return res.status(201).json({ posts });
};
exports.myPost = async (req, res) => {
  const posts = await postModel.find({ user: req.user._id.toString() });
  return res.status(201).json({ posts });
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
      upvote: 0,
      downvote: 0
    });

    if (post) {
      return res.status(201).json({ post });
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
      return res.status(201).json({ updatedPost });
    }
  } catch (error) {
    console.error("updating post error:", error);
    return res.status(500).json("Internal error!");
  }
};
exports.deletePost = async (req, res) => {
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
};
exports.search = async (req, res) => {
    try {
      if (!req.query.q) {
          return res.status(400).json('Search term is required');
      }
      const { q: searchTerm } = req.query;
  
      const result = await postModel.find({ postTitle: { $regex: searchTerm, $options: "i" } })
  
      if (result.length ==  0) {
        return res.status(404).json('No post found!')
      }else {
        return res.status(201).json( result )   
      } 
      
    } catch (error) {
      console.error('search error:', error)
      return res.status(500).json('Internal error!')
    }
  };
