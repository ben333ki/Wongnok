const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// // Add recipe to post
// router.post('/main/post/:postID/recipe', async (req, res) => {
//     const { recipe_name, recipe_type } = req.body;
//     const recipe = new Recipe({ recipe_name, recipe_type, post: req.params.postID });
//     await recipe.save();
//     res.redirect(`/main/post/${req.params.postID}`);
// });

// // View recipes of a post
// router.get('/main/post/:postID/recipe', async (req, res) => {
//     const recipes = await Recipe.find({ post: req.params.postID });
//     res.json(recipes);
// });

module.exports = router;
