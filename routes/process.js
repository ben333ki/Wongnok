const express = require('express');
const router = express.Router();
const Process = require('../models/process');

// // Add process to recipe
// router.post('/main/recipe/:recipeID/process', async (req, res) => {
//     const { no_step, process_picture, process_describe } = req.body;
//     const process = new Process({ no_step, process_picture, process_describe, recipe: req.params.recipeID });
//     await process.save();
//     res.redirect(`/main/post/${req.body.postID}`);
// });

// // View processes in a recipe
// router.get('/main/recipe/:recipeID/process', async (req, res) => {
//     const processes = await Process.find({ recipe: req.params.recipeID });
//     res.json(processes);
// });

module.exports = router;
