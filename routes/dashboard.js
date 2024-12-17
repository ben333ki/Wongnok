const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/index');

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('testDashboard', { user: req.session.user });
});

module.exports = router;
