const mongoose = require('mongoose');

// Process schema embedded inside the Post schema
const processSchema = new mongoose.Schema({
    no_step: { type: Number, required: true }, // Step number in the process
    process_picture: { type: String }, // Picture for the process step (optional)
    process_describe: { type: String, required: true }, // Description of the process step
});

// Ingredient schema embedded inside the Post schema
const ingredientSchema = new mongoose.Schema({
    ingredient_name: { type: String, required: true }, // Name of the ingredient
    ingredient_amount: { type: String, required: true }, // Amount of the ingredient (e.g., 1 cup, 2 tbsp)
});

const commentSchema = new mongoose.Schema({
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
        },
        comment_describe: String
});

// Main Post schema
const postSchema = new mongoose.Schema({
    post_topic: { type: String, required: true }, // Topic of the post
    post_picture: { type: String }, // Picture for the post (optional)
    avg_score: { type: Number, default: 0 }, // Average score for the post (optional)
    post_time: { type: Date, default: Date.now }, // Timestamp for when the post was created
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the post
    post_describe: { type: String, required: true }, // Description of the post
    youtube_url : { type: String },
    processes: [processSchema], // Array of processes (each post can have multiple steps)
    ingredients: [ingredientSchema], // Array of ingredients (each post can have multiple ingredients)
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }], // เพิ่มฟิลด์ ratings
    comments: [commentSchema]
});


module.exports = mongoose.model('Post', postSchema);
