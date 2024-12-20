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
const ratingRoutes = require('./routes/rating');
const mysqlRoutes = require('./routes/mysql');

// Use routes
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);
app.use(ratingRoutes);
app.use(mysqlRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/auth', authRoutes); // เพิ่ม path prefix


