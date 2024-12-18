const express = require('express');
const router = express.Router();
const Post = require('../models/post');
// const Ingredient = require('../models/ingredient');
// const Process = require('../models/process');
// const Recipe = require('../models/recipe');
const User = require('../models/user');
const FollowList = require('../models/followlist'); // Replace with your Follow schema if applicable
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

router.get('/main/user', isAuthenticated, (req, res) => {
    console.log(req.session.user); // Debug: Log the user session object
    res.render('main', { user: req.session.user });
});

router.get('/main/user/:userID/following', isAuthenticated, async (req, res) => {
    const userID = req.params.userID; // Get userID from the route
    if (!userID || userID !== req.session.user.userId) {
        return res.redirect('/login'); // Redirect if not matching session user
    }

    try {
        const followings = await FollowList.find({ follower_ID: userID }).populate('followed_ID');
        res.render('following', {
            user: req.session.user,
            followings, // Pass the following list to EJS
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving following list.');
    }
});

// View a specific post
router.get('/main/post/:id', isAuthenticated, async (req, res) => {
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




router.get('/main/create', (req, res) => {
  res.render('createPost');
})

router.post(
  '/main/create', isAuthenticated,
  upload.fields([
    { name: 'post_picture', maxCount: 1 },
    { name: 'processes[0][process_picture]', maxCount: 1 },
    { name: 'processes[1][process_picture]', maxCount: 1 },
    // Add more fields as needed for dynamic steps
  ]),
  async (req, res) => {
    try {
      console.log('Session User ID:', req.session.user.userId);

      const { post_topic, post_describe, ingredients, processes } = req.body; // Include post_describe here
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
        createdBy: req.session.user.userId,
        ingredients: parsedIngredients,
        processes: parsedProcesses,
      });

      await newPost.save();
      res.redirect(`/main/post/${newPost._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating post');
    }
  }
);



// router.get('/main/post/:id', async (req, res) => {
//     try {
//         const postId = req.params.id;

//         // Fetch post details
//         const post = await Post.findById(postId).populate('createdBy');

//         // Fetch related recipe
//         const recipe = await Recipe.findOne({ post: postId });

//         // Fetch ingredients and processes
//         const ingredients = await Ingredient.find({ recipe: recipe._id });
//         const processes = await Process.find({ recipe: recipe._id }).sort('no_step');

//         res.render('showPost', {
//             post,
//             recipe,
//             ingredients,
//             processes,
//             user: post.createdBy,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching post details');
//     }
// });

module.exports = router;

