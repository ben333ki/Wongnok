const express = require('express');
const router = express.Router();
const UserComment = require('../models/comment');

// // Add comment to post
// router.post('/main/post/:postID/comment', async (req, res) => {
//     const { comment_describe } = req.body;
//     const comment = new UserComment({ comment_describe, post: req.params.postID, user: req.session.user._id });
//     await comment.save();
//     res.redirect(`/main/post/${req.params.postID}`);
// });

// // View comments of a post
// router.get('/main/post/:postID/comment', async (req, res) => {
//     const comments = await UserComment.find({ post: req.params.postID }).populate('user', 'profile_name');
//     res.json(comments);
// });

module.exports = router;
