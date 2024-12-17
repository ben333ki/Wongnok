const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Ingredient = require('../models/ingredient');
const Process = require('../models/process');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const multer = require('multer');
const { isAuthenticated } = require('../middleware/index')

router.get('/main', (req, res) => {
    // Check if the user is logged in
    if (req.session.user) {
        // Pass user information to the template
        console.log('this');
        res.render('main', { user: req.session.user });
    } else {
        // If the user is not logged in, redirect to the login page
        console.log('ok')
        res.redirect('/login');
    }
});


// Configure multer for file uploads (e.g., images)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save uploaded files to 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname); // Ensure unique file names
    }
  });
  
  const upload = multer({ storage: storage });

  router.get('/main/post/create', (req, res) => {
    res.render('createPost');
  })
  
  router.post('/main/post/create', isAuthenticated, upload.single('post_picture'), async (req, res) => {
    try {
        const { post_topic, recipe_name, recipe_type, ingredients, processes } = req.body;
        
        console.log(req.user); // Verify req.user contains user data

        // Create and save the post
        const newPost = new Post({
            post_topic,
            post_picture: req.file ? req.file.path : null, // Save the uploaded file path
            createdBy: req.user.userId, // Use req.user.userId
        });

        await newPost.save();

        // Create the recipe linked to the post
        const newRecipe = new Recipe({
            recipe_name,
            recipe_type,
            post: newPost._id,
        });

        await newRecipe.save();

        // Save ingredients for the recipe
        for (let ingredientData of ingredients) {
            const ingredient = new Ingredient({
                ingredient_name: ingredientData.ingredient_name,
                ingredient_amount: ingredientData.ingredient_amount,
                recipe: newRecipe._id,
            });
            await ingredient.save();
        }

        // Save the steps (processes) for the recipe
        for (let processData of processes) {
            const process = new Process({
                no_step: processData.no_step,
                process_describe: processData.process_describe,
                recipe: newRecipe._id,
                process_picture: processData.process_picture,
            });
            await process.save();
        }

        // Redirect to a success page
        res.redirect('/main');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating post');
    }
});

router.get('/main/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Fetch post details
        const post = await Post.findById(postId).populate('createdBy');

        // Fetch related recipe
        const recipe = await Recipe.findOne({ post: postId });

        // Fetch ingredients and processes
        const ingredients = await Ingredient.find({ recipe: recipe._id });
        const processes = await Process.find({ recipe: recipe._id }).sort('no_step');

        res.render('showPost', {
            post,
            recipe,
            ingredients,
            processes,
            user: post.createdBy,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching post details');
    }
});


module.exports = router;

