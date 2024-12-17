const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// router.post('/main/post/:postID/comment', async (req, res) => {
//     const { comment_describe } = req.body;
//     const comment = new UserComment({
//         comment_describe,
//         post: req.params.postID,
//         user: req.session.user._id,
//     });
//     await comment.save();
//     res.redirect(`/main/post/${req.params.postID}`);
// });


module.exports = router;
