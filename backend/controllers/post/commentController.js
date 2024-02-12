const commentModel = require('../../model/commentModel.js')
const postModel = require('../../model/postModel.js')


exports.getComments = async (req, res) => {
    try {
        const replies = await commentModel.find({ post: req.params.id});

        if (replies.length < 1) {
            return res.status(401).json('No replies found for the specified post');
        }
 
        return res.status(201).json(replies)        
    } catch (error) {
        return res.status(500).json('Internal error:', error)
    }
}
exports.postComment = async (req, res) => {
    try {
        const {reply} = req.body
                
        const post = await postModel.findById({_id: req.params.id}) 

        if (!post) {
            return res.status(404).json('No post found!')
        }

        if (!reply) {
            return res.status(404).json('comment your thoughts!')
        }

        if (!req.user) {
            return res.status(404).json('You are not logged in')
        }

        const comment = await commentModel.create({
            user: req.user,
            post: post._id,
            comment: reply,
            upvote: 0,
            downvote: 0
        })

        return res.status(201).json(comment)  

    } catch (error) {
        console.error("postComment:", error)
        return res.status(500).json('Internal error')
    }
}
exports.updateComment = async (req, res) => {
    try {
        const {reply} = req.body
        
        if (!req.user) {
            return res.status(400).json('Unauthorized user!')
        }
        if (!reply) {
            return res.status(400).json('Comment your thoughts!')
        }

        const comment = await commentModel.findById({_id: req.params.id})

        if (req.user._id.toString() !== comment.user.toString()) {
            return res.status(400).json('Unauthorized user!')
        }

        const updatedComment = await commentModel.findByIdAndUpdate(req.params.id, { comment: reply }, { new: true })

        if (updatedComment) {
            return res.status(201).json({ updatedComment })
        }
    }catch(error) {
        return res.status.json('Internal error')
    }
}
exports.deleteComment = async (req, res) => {
    try {
    if (!req.user) {
        return res.status(400).json('Unauthorized user!')
    }
    const comment = await commentModel.findById({_id: req.params.id})

    if (req.user._id.toString() !== comment.user.toString()) {
        return res.status(400).json('Unauthorized user!')
    }
    await commentModel.findByIdAndDelete(req.params.id)

    return res.status(201).json({ id: req.params.id }); 

    } catch (error) {
        return res.status(500).json('Internal error!')
    }
}
