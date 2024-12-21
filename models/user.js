const bcrypt = require('bcrypt'); // Import bcrypt
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config'); // Import Sequelize instance from config


// Define User model using Sequelize
const User = sequelize.define('User', {
    profile_name: { type: DataTypes.STRING, allowNull: false },
    profile_picture: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_password: { type: DataTypes.STRING(60), allowNull: false },
    user_email: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_bio: { type: DataTypes.TEXT },
});


// Hash the password before saving
User.beforeSave(async (user, options) => {
    try {
        if (!user.changed('user_password')) {
            return; // Skip if the password is not modified
        }

        const salt = await bcrypt.genSalt(10); // Generate a salt
        user.user_password = await bcrypt.hash(user.user_password, salt); // Hash password
    } catch (err) {
        throw err; // Pass error to next middleware
    }
});



// Add a method to compare passwords
User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.user_password);
};

sequelize.sync({ force: false })  // Set to 'true' to force table creation (drops tables if they exist)
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing the database:", err);
});


module.exports = User;
