const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower_ID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    followed_ID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Follow', followSchema);
