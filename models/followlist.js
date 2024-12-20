const { DataTypes } = require('sequelize');
const { sequelize } = require('../config'); // Correct path to config
const User = require('./user');

const Follow = sequelize.define('Follow', {
    follower_ID: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
    followed_ID: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

sequelize.sync({ force: false })  // Set to 'true' to force table creation (drops tables if they exist)
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing the database:", err);
    });

module.exports = Follow;
