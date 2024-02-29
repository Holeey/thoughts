const express = require('express')
const { postComment, getComments, updateComment, deleteComment, replyComment } = require('../controllers/post/commentController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:id', protect, getComments)
router.post('/postComment/:id', protect, postComment)
router.post('/replyComment/:id', protect, replyComment)
// router.put('/updateComment/:id', protect, updateComment)
router.delete('/deleteComment/:id', protect, deleteComment)
module.exports = router