const mongoose = require('mongoose');

const followListSchema = new mongoose.Schema({
    follower_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who follows
    followed_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User being followed
    follow_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FollowList', followListSchema);
