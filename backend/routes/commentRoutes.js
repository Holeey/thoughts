const express = require('express')
const { postComment, getComments, updateComment, deleteComment, replyComment, replyReplies, commentUpvotes, commentDownvotes } = require('../controllers/post/commentController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:id', protect, getComments)
router.post('/postComment/:postId', protect, postComment)
router.post('/replyComment/:commentId', protect, replyComment)
router.post('/replyComment/:commentId/replies/:replyId', protect, replyReplies);
router.post('/upvotes/:id', protect, commentUpvotes)
router.post('/downvotes/:id', protect, commentDownvotes)
router.put('/updateComment/:id', protect, updateComment)
router.delete('/deleteComment/:commentId', protect, deleteComment)
module.exports = router