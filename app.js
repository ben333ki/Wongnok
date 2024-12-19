const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));


const { isAuthenticated, setUserLocals } = require('./middleware/index'); // สมมติว่าชื่อไฟล์คือ index.js ในโฟลเดอร์ middleware
app.use(setUserLocals);

app.use(
    session({
        secret: 'yourSecretKey', // Replace with a strong secret
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.mongoURI, // MongoDB connection string
            ttl: 7 * 24 * 60 * 60, // Session expiration: 1 day in seconds
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Session expires in 1 day
            httpOnly: true, // Prevent client-side JavaScript access
            secure: false, // Set to true if using HTTPS
        },
    })
);


// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// View Engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const followRoutes = require('./routes/follow');
const commentRoutes = require('./routes/comment');
const ratingRoutes = require('./routes/rating');

// Use routes
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);
app.use(followRoutes);
app.use(commentRoutes);
app.use(ratingRoutes);



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/*
    register                    : /register  
    login                       : /login
    main page                   : /main
    post detail                 : /main/post/:postID
    create post                 : /main/post/create
    edit post                   : /main/post/:postID/edit
    following users and post    : /main/user/:userID/following
    following users and post    : /main/user/:userID/favorites
    user profile                : /main/user/:userID
*/

// **Authentication Routes**
// 1. GET /register - Render registration page DDDDDDDD
// 2. POST /register - Handle user registration DDDDDDDDD
// 3. GET /login - Render login page DDDDDDDDDD
// 4. POST /login - Handle user login DDDDDDDDDDD

// **Main Page Routes**
// 5. GET /main - Display the main page with a list of posts DDDDDDDDDDD

// **Post Management Routes (Recipe, Process, Ingredient)**
// 6. GET /main/post/:postID - View details of a post (recipe, process, ingredients, comments, ratings) DDDDDDDDDDDDDDDD
// 7. GET /main/post/create - Render the page to create a new post DDDDDDDDDDDDDDDDDDDDDDDDD
// 8. POST /main/post/create - Handle the creation of a new post DDDDDDDDDDDDDDDDDDDDDDD
// 9. GET /main/post/:postID/edit - Render edit page for a post  DDDDDDDDDDDDDDDDDDDDDDD
// 10. POST /main/post/:postID/edit - Handle editing of post details (recipe, process, ingredients) DDDDDDDDDDDDDDDDDD
// 11. POST /main/post/:postID/delete - Handle deletion of a post DDDDDDDDDDDDDDDDDDDDDDDD

// **User Comment Routes**
// 12. POST /main/post/:postID/comment - Add a comment to a post
// 13. POST /main/post/:postID/comment/:commentID/edit - Edit a user's comment
// 14. POST /main/post/:postID/comment/:commentID/delete - Delete a user's comment

// **User Rating Routes**
// 15. POST /main/post/:postID/rate - Add or update a rating for a post

// **User Favorites and Following Routes**
// 16. GET /main/user/:userID/favorites - View a user's favorite posts
// 17. POST /main/post/:postID/favorite - Add a post to a user's favorites
// 18. POST /main/post/:postID/unfavorite - Remove a post from favorites
// 19. GET /main/user/:userID/following - View users and posts a user is following
// 20. POST /main/user/:userID/follow - Follow a user
// 21. POST /main/user/:userID/unfollow - Unfollow a user

// **User Profile Routes**
// 22. GET /main/user/:userID - View a user's profile
