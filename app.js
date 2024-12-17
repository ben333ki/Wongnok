const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const config = require('./config');
const Post = require('./models/post'); // Import the Post model

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: false })); // Middleware for forms
app.use(bodyParser.json()); // Parse JSON data for forms
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Session Configuration
app.use(
    session({
        secret: 'yourSecretKey', // Replace with a strong secret
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.mongoURI,
            ttl: 7 * 24 * 60 * 60, // 7 days
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
        },
    })
);

// MongoDB Connection
mongoose
    .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error(err));

// View Engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('createPost'); // Render form from 'views/createPost.ejs'
});

// Form Handling Route
app.post('/submit', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'stepImages', maxCount: 10 }
]), async (req, res) => {
    const { topic, description, ingredients, steps, video, author } = req.body;
    const mainImage = req.files['mainImage'] ? req.files['mainImage'][0].path : ''; // Get uploaded main image path
    const stepImages = req.files['stepImages'] ? req.files['stepImages'].map(file => file.path) : [];

    // Prepare the ingredients array
    const ingredientsArray = ingredients.split(',').map(ingredient => {
        const [name, amount] = ingredient.split(':');
        return { ingredient: name, amount };
    });

    // Prepare the steps array with images
    const stepsArray = steps.split(',').map((step, index) => {
        const stepImage = stepImages[index] || '';
        return { description: step, stepImage };
    });

    try {
        // Create a new post
        const newPost = new Post({
            topic,
            description,
            ingredients: ingredientsArray,
            steps: stepsArray,
            video,
            author,
            mainImage
        });

        // Save the post to the database
        await newPost.save();
        res.send('Post created successfully!');
    } catch (error) {
        res.status(500).send('Error creating post: ' + error.message);
    }
});

// Static Routes for Other Features
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/posts'));
app.use('/', require('./routes/users'));
app.use('/', require('./routes/dashboard'));

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
