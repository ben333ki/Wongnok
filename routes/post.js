const express = require('express');
const router = express.Router();
const { Post, User, Ingredient, Process } = require('../models/post'); // Adjust path as needed
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

// View all posts
router.get('/main/user', isAuthenticated, async (req, res) => {
  try {
      // Fetch all posts with the associated `createdByUser` and `ratings`
      const posts = await Post.findAll({
          include: [
              {
                  model: User, 
                  as: 'createdByUser', // Alias to match the association
                  attributes: ['profile_name', 'profile_picture', 'username'],
              }
          ]
      });
      
      const loginUser = req.session.user; // Logged-in user
      const user = req.session.user;


      // Pass the posts and user data to the EJS view
      res.render('main', { posts, user, loginUser }); // Render all posts on the `main` view
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

    // Fetch the post by its ID and include the associated `createdByUser`, `Ingredient`, and `Process`
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: 'createdByUser',  // Include the user who created the post
        },
        {
          model: Ingredient,  // Include Ingredient
        },
        {
          model: Process,  // Include Process
        },
      ],
    });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Render the post detail view
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
  ]),
  async (req, res) => {
    try {
      const { post_topic, post_describe, ingredients, processes, youtube_url } = req.body;
      const post_picture = req.files['post_picture'] ? req.files['post_picture'][0].path : '';

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

      // Create the post
      const newPost = await Post.create({
        post_topic,
        post_describe,
        post_picture,
        youtube_url,
        createdBy: req.session.user.userId, // User who created the post
      });

      // Create associated ingredients
      await Promise.all(parsedIngredients.map(async (ingredient) => {
        await Ingredient.create({
          ...ingredient,
          postId: newPost.id, // Associate with the created post
        });
      }));

      // Create associated processes
      await Promise.all(parsedProcesses.map(async (process) => {
        await Process.create({
          ...process,
          postId: newPost.id, // Associate with the created post
        });
      }));

      // Redirect to the post detail page after creation
      res.redirect(`/main/user/post/${newPost.id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating post');
    }
  }
);



// Route to delete a post
router.post('/post/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.userId;

    // Fetch the post by its ID using Sequelize
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Check if the logged-in user is the creator of the post
    if (post.createdBy !== userId) {
      return res.status(403).send('You are not authorized to delete this post');
    }

    // Delete associated processes related to the post
    await Process.destroy({ where: { postId: postId } });

    // Delete associated ingredients related to the post
    await Ingredient.destroy({ where: { postId: postId } });

    // Delete the post itself
    await post.destroy(); // Sequelize method for deleting the post

    // Redirect to the user's posts list after deleting
    res.redirect('/main/user');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the post and related data');
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

router.post('/main/post/:id/comment', isAuthenticated, async (req, res) => {
  try {

      const commentDescribe = req.body.comment_describe;
      const postId  = req.params.id;
      const userId = req.session.user.userId; // Assuming session contains user info
      
      // Ensure the user ID is a valid ObjectId
      const username = req.session.user.username;

      const post = await Post.findById(postId)
      if (!post) {
          return res.status(404).send('Post not found.');
      }

      const newComment = {
          author: {
              id: userId,
              username,
          },
          comment_describe: commentDescribe,
      };

      // Add the comment to the post's comments array
      post.comments.push(newComment);
      await post.save();

      res.redirect(`/main/user/post/${postId}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error adding comment.');
  }
});



router.post('/main/post/:postId/comment/:commentId/delete', isAuthenticated, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.session.user.userId; // Get the logged-in user ID

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Find the comment by ID within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    // Check if the logged-in user is the author of the comment
    if (!comment.author.id.equals(userId)) {
      return res.status(403).send('You can only delete your own comments');
    }

    // Remove the comment from the post
    post.comments.pull(commentId);
    await post.save();

    // Redirect back to the post's detail page
    res.redirect(`/main/user/post/${postId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting comment');
  }
});

router.post('/main/post/:postId/favorite', isAuthenticated, async (req, res) => {
  try {
      const postId = req.params.postId;
      const userId = req.session.user.userId;

      // Fetch the post from the database
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found.' });
      }

      // Ensure that the favorites array exists in the session
      if (!req.session.user.favorites) {
          req.session.user.favorites = [];
      }

      // Check if the post is already in the user's favorites
      const isFavorite = req.session.user.favorites.includes(postId);

      if (isFavorite) {
          // Remove from favorites
          req.session.user.favorites = req.session.user.favorites.filter(id => id !== postId);
      } else {
          // Add to favorites
          req.session.user.favorites.push(postId);
      }

      // Save the session with the updated favorites list
      await req.session.save(); // Save session to persist changes

      // Return updated status
      res.json({ success: true, isFavorite: !isFavorite });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error processing favorite.' });
  }
});


module.exports = router;





