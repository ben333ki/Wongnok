const express = require('express');
const router = express.Router();
const { Post } = require('../models/post');
const User = require('../models/user');
const FollowList = require('../models/followlist');
const { isAuthenticated } = require('../middleware/index')
const Follow = require('../models/followlist'); // Import the Follow model
const user = require('../models/user');

// Route: Get users being followed
router.get('/main/user/following', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.userId; // Logged-in user ID

        // Find all users the logged-in user is following
        const followList = await FollowList.findAll({
            where: { follower_ID: userId },
            include: { model: User, as: 'followedUser' }
        });

        const loginUser = req.session.user;

        if (!followList.length) {
            return res.render('following', { posts: [], followProfiles: [] }); // If no following users
        }

        // Fetch posts of followed users
        const followedUserIds = followList.map(follow => follow.followed_ID);
        const posts = await Post.findAll({
            where: { createdBy : followedUserIds },
            include: { model: User, as: 'createdByUser' }
        });

        res.render('following', { 
            posts, 
            followProfiles: followList.map(follow => follow.followedUser),
            loginUser 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving following users or posts.');
    }
});

// Route: Get favorite posts
router.get('/main/user/favorite', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.userId;

        // Fetch favorite posts using session favorites
        const favorites = req.session.user.favorites || [];
        const posts = await Post.findAll({
            where: { id: favorites },
            include: { model: User, as: 'createdByUser' }
        });

        res.render('favorite', { posts, loginUser: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving posts.');
    }
});

// Route: Get user profile
router.get('/main/user/profile/:userId?', isAuthenticated, async (req, res) => {
    try {
        const userId = req.params.userId || req.session.user.userId;
        const loginUserId = req.session.user.userId;

        // Fetch logged-in user
        const loginUser = await User.findByPk(loginUserId);

        if (!loginUser) {
            return res.status(404).send('Logged-in user not found.');
        }

        // Fetch the profile user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Fetch posts of the profile user
        const posts = await Post.findAll({
            where: { createdBy : userId },
            include: { model: User, as: 'createdByUser' }
        });

        const postCount = posts.length;

        // Count followers
        const followerCount = await FollowList.count({ where: { followed_ID: userId } });

        // Check if logged-in user follows the profile user
        const isFollowing = !!(await FollowList.findOne({
            where: { follower_ID: loginUserId, followed_ID: userId }
        }));
        console.log(user.id)
        console.log(userId)

        res.render('profile', { 
            currentUser: req.session.user, 
            user, 
            posts, 
            loginUser, 
            isFollowing, 
            postCount, 
            followerCount,
            loginUserId,
            userId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user data or posts.');
    }
});

// Route: Follow a user
router.post('/follow/:userId', isAuthenticated, async (req, res) => {
    try {
        const userToFollowId = req.params.userId;
        const loggedInUserId = req.session.user.userId;

        // Check if already following
        const existingFollow = await FollowList.findOne({
            where: { follower_ID: loggedInUserId, followed_ID: userToFollowId }
        });

        if (existingFollow) {
            return res.json({ message: 'You are already following this user.' });
        }

        // Create new follow relationship
        await FollowList.create({
            follower_ID: loggedInUserId,
            followed_ID: userToFollowId
        });

        res.json({ message: 'You are now following this user.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error following the user.' });
    }
});

// Route: Toggle follow/unfollow
router.post('/main/user/profile/:userId/toggleFollow', isAuthenticated, async (req, res) => {
    try {
        const followerId = req.session.user.userId;
        const followedId = req.params.userId;

        // Check if the follow relationship exists
        const existingFollow = await FollowList.findOne({
            where: { follower_ID: followerId, followed_ID: followedId }
        });

        if (existingFollow) {
            // Unfollow the user
            await existingFollow.destroy();
            return res.json({ success: true, isFollowing: false });
        }

        // Follow the user
        await FollowList.create({
            follower_ID: followerId,
            followed_ID: followedId
        });
        res.json({ success: true, isFollowing: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error toggling follow status.' });
    }
});



router.post('/main/user/edit-profile', isAuthenticated, async (req, res) => {
    try {
        const { profile_name } = req.body; // Extract the new profile name from the request body
        const userId = req.session.user.userId; // Get the logged-in user's ID from the session

        // Update the profile name in the database
        await User.update(
            { profile_name }, // Fields to update
            { where: { id: userId } } // Condition to match the specific user
        );

        // Redirect back to the profile page
        res.redirect(`/main/user/profile/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating profile name');
    }
});




module.exports = router;