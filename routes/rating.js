const express = require('express');
const router = express.Router();
const Comment = require('../models/rating');

// router.post('/main/post/:postID/rating', async (req, res) => {
//     const { score } = req.body;
//     const rating = new UserRating({
//         score,
//         post: req.params.postID,
//         user: req.session.user._id,
//     });
//     await rating.save();
//     res.redirect(`/main/post/${req.params.postID}`);
// });


module.exports = router;