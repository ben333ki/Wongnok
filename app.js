const express = require('express');
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require('sequelize');
const config = require('./config');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

const { isAuthenticated, setUserLocals } = require('./middleware/index');
app.use(setUserLocals);

// Connect to MySQL using Sequelize (use config from config.js)
const sequelize = config.sequelize; // Using the sequelize instance from config.js

// Test MySQL connection
sequelize
    .authenticate()
    .then(() => console.log('MySQL Connected'))
    .catch((err) => console.error('Unable to connect to MySQL:', err));

// Session Store using MySQL
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions',
});

app.use(
    session({
        secret: 'yourSecretKey', // Replace with a strong secret
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Session expires in 7 days
            httpOnly: true, // Prevent client-side JavaScript access
            secure: false, // Set to true if using HTTPS
        },
    })
);

// Sync session table
sessionStore.sync();

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
<<<<<<< HEAD
app.use(mysqlRoutes);
=======
>>>>>>> 7fe5f268084c0de725dcd8d49fcbb0c94e96ea8f

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
<<<<<<< HEAD

app.use('/auth', authRoutes); // เพิ่ม path prefix


=======
>>>>>>> 7fe5f268084c0de725dcd8d49fcbb0c94e96ea8f
