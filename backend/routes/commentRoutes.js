const express = require('express')
const { postComment, getComments, updateComment, deleteComment } = require('../controllers/post/commentController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:id', protect, getComments)
router.post('/postComment/:id', protect, postComment)
router.post('/updateComment/:id', protect, updateComment)
router.post('/deleteComment/:id', protect, deleteComment)
module.exports = router