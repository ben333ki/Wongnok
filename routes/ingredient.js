const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');

// // Add ingredient to recipe
// router.post('/main/recipe/:recipeID/ingredient', async (req, res) => {
//     const { ingredient_name, ingredient_amount } = req.body;
//     const ingredient = new Ingredient({ ingredient_name, recipe: req.params.recipeID, ingredient_amount });
//     await ingredient.save();
//     res.redirect(`/main/post/${req.body.postID}`);
// });

// // View ingredients in a recipe
// router.get('/main/recipe/:recipeID/ingredient', async (req, res) => {
//     const ingredients = await Ingredient.find({ recipe: req.params.recipeID });
//     res.json(ingredients);
// });

module.exports = router;
