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
