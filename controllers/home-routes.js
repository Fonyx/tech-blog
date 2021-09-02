const { User, Post, Tag } = require('../models');
const router = require('express').Router();
const {onlyIfLoggedIn} = require('../middleware/auth');

// home route get request
router.get('/', async (req, res) => {
  try {
    // Get all posts, sorted by title
    const postData = await Post.findAll({
      include: ['owner', 'comments'],
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

// get login empty page, renders login template
router.get('/login', (req, res) => {
  try{
    if (req.session.logged_in){
      res.redirect('/profile');
      return;
    } else {
      res.render('login');
    }
  } catch(err){
    res.status(500).json(err);
  }
})

// Use withAuth middleware to prevent access to route
router.get('/profile', onlyIfLoggedIn, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const postData = await Post.findAll({
      where :{user_id: req.session.user_id}
    }, {
      include: ['tags'],
    });

    const posts = postData.map((postObj)=>{
      return postObj.get({ plain: true });
    })

    res.render('profile', {posts});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;