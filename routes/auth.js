const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
    res.render('testLogin');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        // Save user info in session
        req.session.user = { id: user._id, email: user.email, name: user.name };

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

router.get('/register', (req, res) => res.render('testRegister'));

router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        await newUser.save();
        console.log('User successfully saved!');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to save user');
    }
});

module.exports = router;
