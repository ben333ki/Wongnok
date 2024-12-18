const express = require('express');
const router = express.Router();
const FollowList = require('../models/followlist');

// Add to follow list
// router.post('/main/user/:userID/follow', async (req, res) => {
//     const follow = new FollowList({ follower_ID: req.session.user._id, followed_ID: req.params.userID });
//     await follow.save();
//     res.redirect(`/main/user/${req.params.userID}`);
// });

module.exports = router;
