const express = require('express')

const { follow, unFollow } = require('../controllers/follows/followController.js')

const router = express.Router()

router.post('/:id', follow)
router.post('/unfollow/:id', unFollow)

module.exports = router