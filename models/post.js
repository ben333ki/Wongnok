const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    mainImage: {
        type: String, // The image file name or path will be stored here
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: [{
        ingredient: String, // Name of the ingredient
        amount: String, // Amount of the ingredient
    }],
    video: {
        type: String, // YouTube video link
        default: '',
    },
    steps: [{
        description: String, // Description of each step
        stepImage: String, // Optional: Image associated with the step
    }],
}, { timestamps: true });

// Create and export the model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
