const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/users', async (req, res) => {
    try {
        if (!req.session || !req.session.user) return res.redirect('/login');

        const allUsers = await User.find({});
        const otherUsers = allUsers.filter(user => user._id.toString() !== req.session.user.id);
        res.render('testUsers', { users: otherUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving users');
    }
});

module.exports = router;
