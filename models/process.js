const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
    no_step: { type: Number, required: true },
    process_picture: { type: String },
    process_describe: { type: String, required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }, // Link to Recipe
});

module.exports = mongoose.model('Process', processSchema);

