const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const FollowList = require('../models/followlist');
const { isAuthenticated } = require('../middleware/index')



router.get('/main/user/following', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.userId; // ID ของผู้ใช้ที่เข้าสู่ระบบ
        const followList = await FollowList.find({ follower_ID: userId }).populate('followed_ID'); // ดึงข้อมูลผู้ใช้ที่ติดตาม
        const user = req.session.user;
        
        if (!followList.length) {
            return res.render('following', { posts: [], followProfiles: [] }); // หากไม่มีข้อมูล
        }

        // ดึงโพสต์ของผู้ใช้ที่ติดตาม
        const followedUserIds = followList.map(follow => follow.followed_ID._id);
        const posts = await Post.find({ createdBy: { $in: followedUserIds } }).populate('createdBy');

        res.render('following', { 
            posts, user,
            followProfiles: followList.map(follow => follow.followed_ID) // โปรไฟล์ของผู้ใช้ที่ติดตาม
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving following users or posts.');
    }
});



router.get('/main/user/favorite', isAuthenticated, async (req, res) => {
    try {
      // Fetch all posts, populate the `createdBy` field (user who created the post)
      const posts = await Post.find().populate('createdBy');
      const user = req.session.user;
  
      if (!posts.length) {
        return res.status(404).send('No posts found');
      }
  
      res.render('favorite', { posts,user }); // Render all posts on the `allPosts` view
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving posts');
    }
});


router.get('/main/user/profile/:userId?', isAuthenticated, async (req, res) => {
  try {
      const userId = req.params.userId || req.session.user.userId;
      const loginUser = await User.findById(req.session.user.userId);

      if (!loginUser) {
          return res.status(404).send('Logged in user not found.');
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      const posts = await Post.find({ createdBy: userId }).populate('createdBy');

      // Fetch follow list
      const followList = await FollowList.find({ follower_ID: req.session.user.userId });

      const isFollowing = followList.some(follow => follow && follow.followed_ID.toString() === user._id.toString());

      res.render('profile', { user, posts, loginUser, isFollowing });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving user data or posts');
  }
});



// router.get('/main', isAuthenticated, async (req, res) => {
//     try {
//         const userId = req.session.user.userId;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         res.render('main', { user });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error loading main page');
//     }
// });


const Follow = require('../models/followlist'); // Import Follow model
const user = require('../models/user');

router.post('/follow/:userId', isAuthenticated, async (req, res) => {
    try {
        const userToFollowId = req.params.userId;
        const loggedInUserId = req.session.user.userId;

        // Check if the user is already following
        const existingFollow = await Follow.findOne({
            follower_ID: loggedInUserId,
            followed_ID: userToFollowId
        });

        if (existingFollow) {
            return res.json({ message: 'You are already following this user.' });
        }

        // Create new follow relationship
        const newFollow = new Follow({
            follower_ID: loggedInUserId,
            followed_ID: userToFollowId
        });
        await newFollow.save();

        res.json({ message: 'You are now following this user.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error following the user.' });
    }
});

router.post('/main/user/profile/:userId/toggleFollow', isAuthenticated, async (req, res) => {
  try {
      const followerId = req.session.user.userId; // Logged-in user
      const followedId = req.params.userId; // User being followed/unfollowed

      const existingFollow = await FollowList.findOne({
          follower_ID: followerId,
          followed_ID: followedId,
      });

      if (existingFollow) {
          // If already following, unfollow
          await FollowList.deleteOne({ _id: existingFollow._id });
          res.json({ success: true, isFollowing: false });
      } else {
          // If not following, follow
          await FollowList.create({
              follower_ID: followerId,
              followed_ID: followedId,
          });
          res.json({ success: true, isFollowing: true });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error toggling follow status.' });
  }
});

router.post('/main/user/profile/:userId/toggleFollow', isAuthenticated, async (req, res) => {
  try {
      const followerId = req.session.user.userId; // Logged-in user
      const followedId = req.params.userId; // User being followed/unfollowed

      const existingFollow = await FollowList.findOne({
          follower_ID: followerId,
          followed_ID: followedId,
      });

      if (existingFollow) {
          // If already following, unfollow
          await FollowList.deleteOne({ _id: existingFollow._id });
          return res.json({ success: true, isFollowing: false });
      } else {
          // If not following, follow
          await FollowList.create({
              follower_ID: followerId,
              followed_ID: followedId,
          });
          return res.json({ success: true, isFollowing: true });
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error toggling follow status.' });
  }
});

router.post('/main/user/edit-profile', isAuthenticated, async (req, res) => {
  try {
      const { profile_name } = req.body;
      const userId = req.session.user.userId;

      // อัปเดตชื่อโปรไฟล์ในฐานข้อมูล
      await User.findByIdAndUpdate(userId, { profile_name });

      // รีไดเรกต์กลับไปยังหน้าดูโปรไฟล์
      res.redirect(`/main/user/profile/${userId}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating profile name');
  }
});



module.exports = router;
