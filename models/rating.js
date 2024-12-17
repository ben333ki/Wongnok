const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    score: { type: Number, required: true, min: 1, max: 5 },
    rating_time: { type: Date, default: Date.now },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Link to Post
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
});

module.exports = mongoose.model('Rating', ratingSchema);
