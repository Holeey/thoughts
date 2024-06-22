const express = require('express')
const { createPost, myPost, updatePost, getAllPosts, deletePost, searchPost, upvotes, downvotes } = require('../controllers/post/postController.js')
const { getAllReposts, createRepost, updateRepost, deleteRepost, upvote_repost, downvote_repost } = require('../controllers/post/repostController.js')
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

//Repost Routes
router.get('/repost', getAllReposts)
router.post('/createRepost/:id', protect, createRepost)
router.put('/updateRepost/:id', protect, updateRepost)
router.delete('/deleteRepost/:id', protect, deleteRepost)
router.post('/upvote_repost/:id', protect, upvote_repost)
router.post('/downvote_repost/:id', protect, downvote_repost)

module.exports = router