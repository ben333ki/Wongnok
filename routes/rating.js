const express = require('express');
const router = express.Router();
const UserRating = require('../models/rating');

// // Add rating to post
// router.post('/main/post/:postID/rating', async (req, res) => {
//     const { score } = req.body;
//     const rating = new UserRating({ score, post: req.params.postID, user: req.session.user._id });
//     await rating.save();
//     res.redirect(`/main/post/${req.params.postID}`);
// });

// // View ratings of a post
// router.get('/main/post/:postID/rating', async (req, res) => {
//     const ratings = await UserRating.find({ post: req.params.postID });
//     res.json(ratings);
// });

module.exports = router;
