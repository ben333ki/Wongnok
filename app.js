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
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/posts'));
app.use('/', require('./routes/users'));
app.use('/', require('./routes/dashboard'));

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