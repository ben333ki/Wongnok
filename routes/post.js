const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
// const FollowList = require('../models/followlist'); // Replace with your Follow schema if applicable
const multer = require('multer');
const { isAuthenticated } = require('../middleware/index')
const methodOverride = require('method-override');

router.use(methodOverride('_method'));  // This tells Express to look for the "_method" field in the request


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
      const user = req.session.user;
      console.log(user)
  
      if (!posts.length) {
        return res.status(404).send('No posts found');
      }
  
      res.render('main', { posts, user }); // Render all posts on the `allPosts` view
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving posts');
    }
  });

// View a specific post
router.get('/main/user/post/:id', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.session.user;
    // Populate only the `createdBy` field since `recipe` is no longer used
    const post = await Post.findById(postId).populate('createdBy');

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Ensure the correct user object is passed
    res.render('postDetail', { post, user });
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


// Route to delete a post
router.post('/post/:id/delete', isAuthenticated, async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (!post || post.createdBy.toString() !== req.session.user.userId) {
          return res.status(403).send('You are not authorized to delete this post');
      }

      await Post.findByIdAndDelete(req.params.id);
      res.redirect('/main/user'); // Redirect to the posts list after deleting
  } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting the post');
  }
});


// Search posts by topic
router.get('/main/user/search', isAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.q; // Get the search query from the request
    const user = req.session.user;

    // Perform a case-insensitive search for `post_topic` containing the query
    const posts = await Post.find({
      post_topic: { $regex: searchQuery, $options: 'i' }
    }).populate('createdBy');

    res.render('main', { posts, user }); // Render the same page with filtered posts
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during search');
  }
});

// Route to handle search functionality
router.get('/main/user/search', isAuthenticated, async (req, res) => {
  try {
      const searchQuery = req.query.query || ""; // Get the search query from the URL parameter
      const user = req.session.user;

      // Find posts where post_topic contains the search query (case-insensitive)
      const posts = await Post.find({
          post_topic: { $regex: searchQuery, $options: 'i' } // Regex search for case-insensitive match
      }).populate('createdBy');

      // If no posts match the search query
      if (posts.length === 0) {
          return res.render('main', { posts: [], user, message: "No posts found for the given search." });
      }

      res.render('main', { posts, user });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error performing search');
  }
});



// Search posts based on query
// Search posts based on query, including ingredients_name
router.get('/search', isAuthenticated, async (req, res) => {
  try {
      const query = req.query.query;  // ดึงคำค้นจาก query parameter
      if (!query) {
          return res.status(400).json({ error: 'Query parameter is required.' });
      }

      const posts = await Post.find({
          $or: [
              { post_topic: { $regex: query, $options: 'i' } }, // ค้นหาจากหัวข้อโพสต์
              { ingredients_name: { $regex: query, $options: 'i' } } // ค้นหาจากชื่อส่วนผสม
          ]
      }).populate('createdBy');

      if (posts.length === 0) {
          return res.status(404).json({ message: 'No posts found.' });
      }

      res.json(posts);  // ส่งผลลัพธ์กลับไปที่ฝั่ง frontend
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error during search' });
  }
});


// Route for fetching all posts (without search filter)
router.get('/all-posts', async (req, res) => {
  try {
    // Fetch all posts, populate the `createdBy` field (user who created the post)
    const posts = await Post.find().populate('createdBy');

    if (!posts.length) {
      return res.status(404).json({ error: 'No posts found' });
    }

    // ส่งข้อมูลโพสต์ทั้งหมดไปยัง frontend
    res.json(posts); // ส่งข้อมูลในรูปแบบ JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving posts' });
  }
});


// Route สำหรับค้นหาตามประเภทอาหาร
router.get('/search-by-type', async (req, res) => {
  try {
    const { type } = req.query;  // ดึงประเภทจาก query parameter

    // ค้นหาจากประเภทอาหาร
    const posts = await Post.find({ post_topic: { $regex: type, $options: 'i' } }).populate('createdBy');

    if (!posts.length) {
      return res.status(404).json({ error: 'No posts found for this type' });
    }

    // ส่งข้อมูลโพสต์ที่ตรงกับประเภทไปยัง frontend
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving posts by type' });
  }
});



module.exports = router;



