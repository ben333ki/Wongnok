const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { isAuthenticated } = require('../middleware');

// Route สำหรับให้คะแนน
const mongoose = require('mongoose'); // เพิ่มการ import mongoose


router.post('/main/post/:id/rate', isAuthenticated, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.session.user.userId;
        const rating = parseInt(req.body.rating, 10); // รับคะแนนจากฟอร์ม (ค่าที่ส่งมาจะเป็น String)

        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).send('Invalid rating. Rating must be between 1 and 5.');
        }

        // ค้นหาโพสต์ในฐานข้อมูล
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        // คำนวณคะแนนใหม่
        let existingRating = post.ratings.find(rating => rating.user.toString() === userId.toString());
        if (existingRating) {
            // ถ้าผู้ใช้เคยให้คะแนนไว้แล้ว ให้ปรับปรุงคะแนนเดิม
            existingRating.rating = rating;
        } else {
            // ถ้าผู้ใช้ยังไม่เคยให้คะแนน ให้เพิ่มคะแนนใหม่
            post.ratings.push({ user: userId, rating });
        }

        // คำนวณค่า avg_score ใหม่
        const totalRatings = post.ratings.length;
        const totalScore = post.ratings.reduce((sum, r) => sum + r.rating, 0);
        post.avg_score = totalScore / totalRatings;

        // บันทึกการเปลี่ยนแปลง
        await post.save();

        // ส่งกลับไปยังหน้ารายละเอียดโพสต์
        res.redirect(`/main/user/post/${postId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rating post');
    }
});



module.exports = router;