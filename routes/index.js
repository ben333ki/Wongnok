const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Check if user session exists
    if (req.session && req.session.user) {
        // Pass user's name to the view if logged in
        res.render('testIndex', { message: `Welcome, ${req.session.user.name}`, isLogin: 'Logged in' });
    } else {
        // Default message for non-logged-in users
        res.render('testIndex', { message: 'Home', isLogin: 'No login' });
    }
});

module.exports = router;

