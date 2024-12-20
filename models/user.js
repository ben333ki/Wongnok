const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt

const userSchema = new mongoose.Schema({
    profile_name: { type: String, required: true },
    profile_picture: { type: String },
    username: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_bio: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});



// Hash the password before saving
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('user_password')) {
            return next(); // Skip if the password is not modified
        }

        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.user_password = await bcrypt.hash(this.user_password, salt); // Hash password
        next();
    } catch (err) {
        next(err); // Pass error to next middleware
    }
});

// Add a method to compare passwords
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.user_password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);
