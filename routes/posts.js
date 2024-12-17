const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { isAuthenticated } = require('../middleware/index');
const multer = require('multer');

// Configure storage for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({}).populate('createdBy', 'name email');
        res.render('viewPosts', { posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving posts');
    }
});

router.get('/posts/create', isAuthenticated, (req, res) => {
    res.render('createPost');
});

router.post('/posts', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { topic } = req.body;
        const newPost = new Post({
            topic,
            image: `/uploads/${req.file.filename}`,
            createdBy: req.session.user.id,
        });
        await newPost.save();
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating the post');
    }
});

router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('createdBy', 'name email'); // Fetch post by ID
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Check if the current user owns the post
        let isOwner = false;
        if (req.session.user && post.createdBy._id.toString() === req.session.user.id) {
            isOwner = true;
        }

        // Render the post detail page
        res.render('postDetail', { post, isOwner }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving post details');
    }
});


// GET route to render the edit form
router.get('/posts/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Check if the current user is the one who created the post
        if (post.createdBy.toString() !== req.session.user.id) {
            return res.status(403).send('You are not authorized to edit this post');
        }

        // Render the edit post page with the current post data
        res.render('editPost', { post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving post for edit');
    }
});


router.post('/posts/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const { topic } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post || post.createdBy.toString() !== req.session.user.id) {
            return res.status(403).send('You are not authorized to update this post');
        }

        post.topic = topic; // Update the topic
        await post.save();
        res.redirect(`/posts/${post._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the post');
    }
});

router.post('/posts/:id/delete', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.createdBy.toString() !== req.session.user.id) {
            return res.status(403).send('You are not authorized to delete this post');
        }

        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/posts'); // Redirect to the posts list after deleting
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the post');
    }
});



module.exports = router;
