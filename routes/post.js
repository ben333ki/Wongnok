const express = require('express');
const router = express.Router();
const Post = require('../models/post');
// const User = require('../models/user');
// const FollowList = require('../models/followlist'); // Replace with your Follow schema if applicable
const multer = require('multer');
const { isAuthenticated } = require('../middleware/index')


router.get('/test', isAuthenticated, (req, res) => {
  console.log(req.session.user); // Debug: Log the user session object
  res.render('test', { user: req.session.user });
});

// Configure multer for file uploads (e.g., images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Save uploaded files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Ensure unique file names
  }
});

const upload = multer({ storage: storage });

// View all post
router.get('/main/user', isAuthenticated, async (req, res) => {
    try {
      // Fetch all posts, populate the `createdBy` field (user who created the post)
      const posts = await Post.find().populate('createdBy');
  
      if (!posts.length) {
        return res.status(404).send('No posts found');
      }
  
      res.render('main', { posts }); // Render all posts on the `allPosts` view
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving posts');
    }
  });

// View a specific post
router.get('/main/user/post/:id', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;

    // Populate only the `createdBy` field since `recipe` is no longer used
    const post = await Post.findById(postId).populate('createdBy');

    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('postDetail', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving post');
  }
});


router.get('/main/create', isAuthenticated, (req, res) => {
  res.render('createPost');
})

router.post(
  '/main/create', isAuthenticated,
  upload.fields([
    { name: 'post_picture', maxCount: 1 },
    { name: 'processes[0][process_picture]', maxCount: 1 },
    { name: 'processes[1][process_picture]', maxCount: 1 },
    { name: 'processes[2][process_picture]', maxCount: 1 },
    { name: 'processes[3][process_picture]', maxCount: 1 },
    { name: 'processes[4][process_picture]', maxCount: 1 },
    { name: 'processes[5][process_picture]', maxCount: 1 },
    { name: 'processes[6][process_picture]', maxCount: 1 },
    { name: 'processes[7][process_picture]', maxCount: 1 },
    { name: 'processes[8][process_picture]', maxCount: 1 },
    { name: 'processes[9][process_picture]', maxCount: 1 },
    { name: 'processes[10][process_picture]', maxCount: 1 },
    { name: 'processes[11][process_picture]', maxCount: 1 },
    { name: 'processes[12][process_picture]', maxCount: 1 },
    { name: 'processes[13][process_picture]', maxCount: 1 },
    { name: 'processes[14][process_picture]', maxCount: 1 },
    // Add more fields as needed for dynamic steps
  ]),
  async (req, res) => {
    try {
      console.log('Session User ID:', req.session.user.userId);

      const { post_topic, post_describe, ingredients, processes, youtube_url } = req.body; // Include post_describe here
      const post_picture = req.files['post_picture']
        ? req.files['post_picture'][0].path
        : '';

      const parsedProcesses = processes.map((process, index) => ({
        no_step: index + 1,
        process_picture: req.files[`processes[${index}][process_picture]`]
          ? req.files[`processes[${index}][process_picture]`][0].path
          : '',
        process_describe: process.process_describe,
      }));

      const parsedIngredients = ingredients.map((ingredient) => ({
        ingredient_name: ingredient.ingredient_name,
        ingredient_amount: ingredient.ingredient_amount,
      }));

      const newPost = new Post({
        post_topic,
        post_describe, // Save the description of the post
        post_picture,
        youtube_url,
        createdBy: req.session.user.userId,
        ingredients: parsedIngredients,
        processes: parsedProcesses,
      });

      await newPost.save();
      res.redirect(`/main/user/post/${newPost._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating post');
    }
  }
);


module.exports = router;
