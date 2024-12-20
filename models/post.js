const { DataTypes } = require('sequelize');
const { sequelize } = require('../config'); // Correct path to config
const User = require('./user');

const Post = sequelize.define('Post', {
    post_topic: { type: DataTypes.STRING, allowNull: false },
    post_picture: { type: DataTypes.STRING },
    avg_score: { type: DataTypes.FLOAT, defaultValue: 0 },
    post_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    post_describe: { type: DataTypes.TEXT, allowNull: false },
    youtube_url: { type: DataTypes.STRING },
});

// Change the 'as' alias to prevent naming collision
Post.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });

const Ingredient = sequelize.define('Ingredient', {
    ingredient_name: { type: DataTypes.STRING, allowNull: false },
    ingredient_amount: { type: DataTypes.STRING, allowNull: false },
});

const Process = sequelize.define('Process', {
    no_step: { type: DataTypes.INTEGER, allowNull: false },
    process_picture: { type: DataTypes.STRING },
    process_describe: { type: DataTypes.TEXT, allowNull: false },
});

const Comment = sequelize.define('Comment', {
    comment_describe: { type: DataTypes.TEXT },
    username: { type: DataTypes.STRING },
});

Ingredient.belongsTo(Post, { foreignKey: 'postId' });
Process.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
sequelize.sync({ force: false })  // Set to 'true' to force table creation (drops tables if they exist)
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing the database:", err);
    });


module.exports = { Post, Ingredient, Process, Comment };
