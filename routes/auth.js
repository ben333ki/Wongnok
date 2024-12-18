const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FollowList = require('../models/followlist');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Display Add User Form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle Form Submission (Add User with Profile Picture)
router.post('/register', upload.single('profile_picture'), async (req, res) => {
    try {
 
        const { profile_name, username, user_password, user_email, user_bio } = req.body;
        const defaultProfilePicture = '/images/defaultProfile.png';

        const newUser = new User({
            profile_name,
            username,
            user_password,
            user_email,
            user_bio,
            profile_picture: defaultProfilePicture,
        });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while saving the user.');
    }
});


// Display login form
router.get('/login', (req, res) => {
    res.render('login'); // Render the login HTML form
});

// Handle login logic
router.post('/login', async (req, res) => {
    try {
        const { username, user_password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send('Invalid username or password.');
        }

        // Check if password is valid
        const isMatch = await user.isValidPassword(user_password);

        if (!isMatch) {
            return res.status(400).send('Invalid username or password.');
        }


        // Store user information in session
        req.session.user = {
            userId: user._id,
            profileName: user.profile_name,
            username: user.username,
        };

        // Redirect to the main page
        res.redirect('/main/user');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while logging in.');
    }
});


// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out');
        }
        res.redirect('/login'); // Redirect to the login page after logout
    });
});


module.exports = router;
