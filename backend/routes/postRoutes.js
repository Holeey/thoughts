const express = require('express')
const { createPost, myPost, updatePost, getAllPosts, deletePost, searchPost, upvotes, downvotes, un_upvotes } = require('../controllers/post/postController.js')
const { getAllReposts, createRepost, updateRepost, deleteRepost, upvotes_repost, downvotes_repost } = require('../controllers/post/repostController.js')
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
// router.post('/un-upvotes/:id', protect, un_upvotes)
// router.post('/un-downvotes/:id', protect, un_downvotes)

//Repost Routes
router.get('/repost', getAllReposts)
router.post('/createRepost/:id', protect, createRepost)
router.put('/updateRepost/:id', protect, updateRepost)
router.delete('/deleteRepost/:id', protect, deleteRepost)
router.post('/upvotes_repost/:id', protect, upvotes_repost)
router.post('/downvotes_repost/:id', protect, downvotes_repost)

module.exports = router