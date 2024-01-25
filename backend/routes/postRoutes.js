const express = require('express')
const { createPost, myPost, updatePost, getAllPosts, deletePost, searchPost } = require('../controllers/post/postController.js')
const {protect} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.get('/', getAllPosts)
router.get('/myPost', protect, myPost)
router.post('/createPost', protect, createPost)
router.put('/updatePost/:id', protect, updatePost)
router.delete('/deletePost/:id', protect, deletePost)
router.get('/searchPost', protect, searchPost)

module.exports = router