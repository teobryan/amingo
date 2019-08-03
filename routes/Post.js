const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

/**
 * Post route for creating a new message
 * 
 * @name POST: /posts/
 * 
 * @param {string} message - message to post in posts collection
 */
router.post('/', (req, res) => {
    const newPost = new Post({
        message: req.body.message,
        user: req.user
    })
    newPost
        .save()
        .then(post=> res.json (post))
        .catch(err => res.json(err))
});

// Method: GET
// Route to fetch all the posts from collection
router.get('/', (req, res) => {
    Post.find({user: req.user})
        .then(posts => res.json(posts))
        .catch(err => console.log(err)) 
});


module.exports = router;