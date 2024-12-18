const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FollowList = require('../models/followlist');
const { isAuthenticated } = require('../middleware/index')



router.get('/main/user/:userID/following', isAuthenticated, async (req, res) => {
  res.render('following');
});

router.get('/main/user/:userID/favorite', isAuthenticated, async (req, res) => {
  res.render('favorite');
});

router.get('/main/user/:userID', isAuthenticated, async (req, res) => {
    res.render('profile');
  });

module.exports = router;
