const { User, Post, Tag } = require('../models');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    // Get all posts, sorted by title
    const postData = await Post.findAll({
      include: ['owner', 'post comment'],
      order: [['title', 'ASC']],
    });

    // Serialize user data so templates can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data into Handlebars.js template
    res.render('homepage', { posts });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;