const express = require('express');
const router = express.Router();
const FollowList = require('../models/followlist');
const User = require('../models/user');
const { isAuthenticated } = require('../middleware/index')

// // Follow a user
// router.post('/follow/:id', isAuthenticated, async (req, res) => {
//     try {
//         const followedId = req.params.id;
//         const followerId = req.session.user.userId;

//         if (followerId === followedId) {
//             return res.status(400).send("You can't follow yourself.");
//         }

//         // Check if the user is already followed
//         const existingFollow = await FollowList.findOne({ follower_ID: followerId, followed_ID: followedId });

//         if (existingFollow) {
//             return res.status(400).send("You are already following this user.");
//         }

//         // Create a new follow record
//         const newFollow = new FollowList({
//             follower_ID: followerId,
//             followed_ID: followedId,
//         });

//         await newFollow.save();

//         res.status(200).send('Followed successfully.');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error following user.');
//     }
// });

// // Unfollow a user
// router.post('/unfollow/:id', isAuthenticated, async (req, res) => {
//     try {
//         const followedId = req.params.id;
//         const followerId = req.session.user.userId;

//         // Remove the follow record
//         await FollowList.findOneAndDelete({ follower_ID: followerId, followed_ID: followedId });

//         res.status(200).send('Unfollowed successfully.');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error unfollowing user.');
//     }
// });


module.exports = router;
