const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment_describe: { type: String, required: true },
    comment_time: { type: Date, default: Date.now },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Link to Post
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
});

module.exports = mongoose.model('Comment', commentSchema);
