const express = require('express')
const { createPost, myPost, updatePost, getAllPosts, deletePost, searchPost, upvotes, downvotes } = require('../controllers/post/postController.js')
const { getAllReposts, createRepost } = require('../controllers/post/repostController.js')
const { protect } = require('../middleware/authMiddleware.js')
const { upload } = require('../middleware/ImageMiddleware.js')

const router = express.Router()

router.get('/', getAllPosts)
router.get('/myPost', protect, myPost)
router.post('/createPost', protect, upload.single('postImg'), createPost)
router.put('/updatePost/:id', protect, upload.single('postImg'), updatePost)
router.delete('/deletePost/:id', protect, deletePost)
router.get('/searchPost', protect, searchPost)
router.post('/upvotes/:id', protect, upvotes)
router.post('/downvotes/:id', protect, downvotes)
router.get('/repost', getAllReposts)
router.post('/createRepost/:id', protect, createRepost)

module.exports = router