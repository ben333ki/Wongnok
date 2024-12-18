const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FollowList = require('../models/followlist');

// // Follow user
// router.post('/main/user/:userID/follow', async (req, res) => {
//     const follow = new FollowList({ follower_ID: req.session.user._id, followed_ID: req.params.userID });
//     await follow.save();
//     res.redirect(`/main/user/${req.params.userID}`);
// });

// // View following users
// router.get('/main/user/:userID/following', async (req, res) => {
//     const following = await FollowList.find({ follower_ID: req.params.userID }).populate('followed_ID');
//     res.json(following);
// });

// // User profile
// router.get('/main/user/:userID', async (req, res) => {
//     const user = await User.findById(req.params.userID);
//     res.render('userProfile', { user });
// });

// // View favorite posts
// router.get('/main/user/:userID/favorites', async (req, res) => {
//     const favoritePosts = await Post.find({ favorites: req.params.userID });
//     res.json(favoritePosts);
// });

module.exports = router;
