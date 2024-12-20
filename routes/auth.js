const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FollowList = require('../models/followlist');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

// Configure multer for file upload
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

        // Hash the user's password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);

        // Create a new user instance
        const newUser = await User.create({
            profile_name,
            username,
            user_password: hashedPassword,
            user_email,
            user_bio,
            profile_picture: defaultProfilePicture,
        });
        console.log('Original Password:', user_password);
        console.log('Hashed Password:', hashedPassword);

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
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).send('Invalid username or password.');
        }

        // Check if password is valid by comparing the entered password with the stored hashed password
        console.log('Entered Password:', user_password);
        console.log('Stored Hashed Password:', user.user_password);
        const isMatch = await bcrypt.compare(user_password, user.user_password);
        console.log('Password Match:', isMatch);
        
        if (!isMatch) {
            return res.status(400).send('Invalid username or password.');
        }

        // Store user information in session
        req.session.user = {
            userId: user.id,
            profileName: user.profile_name,
            username: user.username,
            profile_picture: user.profile_picture,
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

// Change Profile Picture
router.post('/change-profile-picture', upload.single('profile_picture'), async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).send('Unauthorized: Please log in first.');
        }

        const userId = req.session.user.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).send('Please upload a valid image file.');
        }

        // Path to the new profile picture
        const newProfilePicturePath = `/uploads/${file.filename}`;

        // Update the user's profile picture in the database
        const updatedUser = await User.update(
            { profile_picture: newProfilePicturePath },
            { where: { id: userId }, returning: true, plain: true }
        );

        if (!updatedUser[1]) {
            return res.status(404).send('User not found.');
        }

        // Update the session with the new profile picture path
        req.session.user.profile_picture = updatedUser[1].profile_picture;

        // Redirect back to the user's profile page
        res.redirect('/main/user/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating the profile picture.');
    }
});

module.exports = router;
