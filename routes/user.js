const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const FollowList = require('../models/followlist');
const { isAuthenticated } = require('../middleware/index')



// router.get('/main/user/:userID/following', isAuthenticated, async (req, res) => {
//     try {
//         // Fetch all posts, populate the `createdBy` field (user who created the post)
//       const posts = await Post.find().populate('createdBy');
  
//       if (!posts.length) {
//         return res.status(404).send('No posts found');
//       }
  
//       res.render('following', { posts }); // Render all posts on the `allPosts` view
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error retrieving posts');
//     }
// });

// router.get('/main/user/:userID/favorite', isAuthenticated, async (req, res) => {
//     try {
//       // Fetch all posts, populate the `createdBy` field (user who created the post)
//       const posts = await Post.find().populate('createdBy');
  
//       if (!posts.length) {
//         return res.status(404).send('No posts found');
//       }
  
//       res.render('favorite', { posts }); // Render all posts on the `allPosts` view
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error retrieving posts');
//     }
// });


router.get('/main/user/profile/:userId?', isAuthenticated, async (req, res) => {
    try {
        // Get the userId from the URL or use the logged-in user's ID if not provided
        const userId = req.params.userId || req.session.user.userId;

        // Fetch the user data by the userId from the URL (or logged-in user if no userId is provided)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch posts created by the user (this will be filtered based on the userId)
        const posts = await Post.find({ createdBy: userId }).populate('createdBy');

        // Render the profile page with the user data and posts
        res.render('profile', { user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user data or posts');
    }
});



module.exports = router;
