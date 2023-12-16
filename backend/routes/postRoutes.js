const express = require('express')
const { createPost, updatePost, getPosts } = require('../controllers/post/postController.js')
const {protect} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.get('/getPosts', getPosts)
router.post('/createPost', protect, createPost)
router.post('/updatePost/:id', protect, updatePost)

module.exports = router