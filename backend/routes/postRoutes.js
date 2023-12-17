const express = require('express')
const { createPost, myPost, updatePost, getAllPosts, deletePost, search } = require('../controllers/post/postController.js')
const {protect} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.get('/', getAllPosts)
router.get('/myPost', protect, myPost)
router.post('/createPost', protect, createPost)
router.post('/updatePost/:id', protect, updatePost)
router.post('/deletePost/:id', protect, deletePost)
router.get('/search', search)

module.exports = router