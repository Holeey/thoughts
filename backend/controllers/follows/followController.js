const followModel = require('../../model/followModel.js')

exports.follow = async (req, res) => {
    try {
    const { userId } = req.params;
    const followerId = req.user._id; 
    if (!followerId){
        return res.status(404).json('Unauthorized user')
    }
    followModel.create({ follower: followerId, following: userId }) 
    return res.status(201).json(
        'userId has been followed!' 
    )       
    } catch (error) {
        console.error('follow error:', error)
        return res.status(500).json('Internal error!')
    }
  };
  
exports.unFollow = async (req, res) => {
    try {
    const { userId } = req.params;
    const followerId = req.user._id; 
    if (!followerId){
        return res.status(404).json('Unauthorized user')
    }
    followModel.findOneAndDelete(followerId, { follower: followerId, following: userId })  
    
    return res.status(201).json(
        'userId has been unfollowed!' 
    )       
    
    } catch (error) {
        console.error('unfollow error:', error)
    return res.status(500).json('Internal error!')   
    }
  };