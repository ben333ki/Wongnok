const { DataTypes } = require('sequelize');
const { sequelize } = require('../config'); // Correct path to config
const User = require('./user');

const Follow = sequelize.define('Follow', {
    follower_ID: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
    followed_ID: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

Follow.belongsTo(User, { foreignKey: 'followed_ID', as: 'followedUser' });
Follow.belongsTo(User, { foreignKey: 'follower_ID', as: 'followerUser' });

User.hasMany(Follow, { foreignKey: 'follower_ID', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followed_ID', as: 'followers' });

sequelize.sync({ force: false })  // Set to 'true' to force table creation (drops tables if they exist)
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing the database:", err);
    });

module.exports = Follow;
