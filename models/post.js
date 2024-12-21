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
User.hasMany(Post, { foreignKey: 'createdBy', as: 'posts' });

const Ingredient = sequelize.define('Ingredient', {
    ingredient_name: { type: DataTypes.STRING, allowNull: false },
    ingredient_amount: { type: DataTypes.STRING, allowNull: false },
});

const Process = sequelize.define('Process', {
    no_step: { type: DataTypes.INTEGER, allowNull: false },
    process_picture: { type: DataTypes.STRING },
    process_describe: { type: DataTypes.TEXT, allowNull: false },
});

// const Comment = sequelize.define('Comment', {
//     comment_describe: { type: DataTypes.TEXT },
//     username: { type: DataTypes.STRING },
// });

Ingredient.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Ingredient, { foreignKey: 'postId' }); // Add this if missing

Process.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Process, { foreignKey: 'postId' }); // Add this if missing

// Comment.belongsTo(Post, { foreignKey: 'postId' });
// Post.hasMany(Comment, { as: 'Comments', foreignKey: 'postId' });

// Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
// User.hasMany(Comment, { as: 'author', foreignKey: 'authorId' }); // Add this if missing


sequelize.sync({ force: false })  // Set to 'true' to force table creation (drops tables if they exist)
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing the database:", err);
    });

// sequelize.sync({ alter: true }) // Use `alter` to modify the schema without dropping data
//     .then(() => console.log("Database synchronized"))
//     .catch(err => console.error("Error synchronizing database:", err));


module.exports = { Post, Ingredient, Process, User };

// module.exports = { Post, Ingredient, Process, Comment, User };
