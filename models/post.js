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

// Main Post schema
const postSchema = new mongoose.Schema({
    post_topic: { type: String, required: true },
    post_picture: { type: String },
    avg_score: { type: Number, default: 0 },
    post_time: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_describe: { type: String, required: true },
    youtube_url: { type: String },
    processes: [processSchema],
    ingredients: [ingredientSchema],
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }] // เพิ่มฟิลด์ ratings
});




module.exports = mongoose.model('Post', postSchema);
