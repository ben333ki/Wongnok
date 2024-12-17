const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post_topic: { type: String, required: true },
    post_picture: { type: String },
    avg_score: { type: Number, default: 0 },
    post_time: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


module.exports = mongoose.model('Post', postSchema);
