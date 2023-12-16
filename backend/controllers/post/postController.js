
const userModel = require('../../model/userModel.js')
const postModel = require('../../model/postModel.js')

exports.getPosts = async(req, res) => {
    const posts = await postModel.find({user: req.user.id})
    return res.status(201).json(posts)
}

exports.createPost = async (req, res) => {
    try{
    const {postTitle, postBody } = req.body

    if (!postTitle || !postBody ) {
        return res.status(401).json('Please add fields')
    }
    const post = await postModel.create({
        user: req.user.id,
        postTitle: postTitle,
        postBody: postBody,
        upvote: 0,
        downvote: 0
     })
     
     if (post) {
        return res.status(201).json({ post })     
    }
    }catch(error) {
        console.error('create post error:', error)
        return res.status(500).json('Internal error')
    }
}

exports.updatePost = async (req, res) => {
    try {
    const { postTitle, postBody } = req.body
   
    const post = await postModel.findById(req.params.id)

    if (!post) {
        return res.status(401).json('Post not found!')
    }

    if (!req.user) {
        return res.status(401).json(' user not found!')
    }

    if (req.user._id.toString() !== post.user.toString()) {
        return res.status(401).json('Unauthorized user!')
    }

    const updatedPost = await postModel.findByIdAndUpdate(req.params.id, {postTitle: postTitle, postBody:postBody}, {new: true}) 

    if (updatedPost) {
        return res.status(201).json({updatedPost})
    }
            
    } catch (error) {
        console.error('updating post error:', error)
        return res.status(500).json('Internal error!')
    }

}