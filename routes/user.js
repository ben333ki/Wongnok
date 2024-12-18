const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const FollowList = require('../models/followlist');
const { isAuthenticated } = require('../middleware/index')



router.get('/main/user/:userID/following', isAuthenticated, async (req, res) => {
    try {
        // Fetch all posts, populate the `createdBy` field (user who created the post)
      const posts = await Post.find().populate('createdBy');
  
      if (!posts.length) {
        return res.status(404).send('No posts found');
      }
  
      res.render('following', { posts }); // Render all posts on the `allPosts` view
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving posts');
    }
});

router.get('/main/user/:userID/favorite', isAuthenticated, async (req, res) => {
    try {
      // Fetch all posts, populate the `createdBy` field (user who created the post)
      const posts = await Post.find().populate('createdBy');
  
      if (!posts.length) {
        return res.status(404).send('No posts found');
      }
  
      res.render('favorite', { posts }); // Render all posts on the `allPosts` view
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving posts');
    }
});

router.get('/main/user/:userID', isAuthenticated, async (req, res) => {
    try {
      // Fetch all posts, populate the `createdBy` field (user who created the post)
      const posts = await Post.find().populate('createdBy');
  
      if (!posts.length) {
        return res.status(404).send('No posts found');
      }
  
      res.render('profile', { posts }); // Render all posts on the `allPosts` view
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving posts');
    }
  });

module.exports = router;
