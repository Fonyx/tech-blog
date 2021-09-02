const { User, Post, Tag } = require('../models');
const router = require('express').Router();
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/cLogger');

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

    let session_logged_in = req.session.logged_in? true: false;

    // Pass serialized data into Handlebars.js template
    res.render('homepage', { posts, logged_in: session_logged_in });
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
    const rawPosts = await Post.findAll({
      where :{user_id: req.session.user_id},
      include: 'tags',
    });

    const posts = rawPosts.map((postObj)=>{
      return postObj.get({ plain: true });
    })

    res.render('profile', {posts, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/post/:id', async(req, res) => {

  try{
    var postObj = await Post.findByPk(req.params.id, {
      include: ['owner', 'comments', 'tags'],
      attributes: {
        exclude: ['password']
      }
    })

    if(postObj){
      var post = postObj.get({plain: true});
      clog(`Found post: ${post.title}`, 'green');
      res.render('post',{post, logged_in:req.session.logged_in});
    } else {
      res.status(404).json({message:`No post for id:${req.params.id}`})
    }
  }
  catch(err){
    res.status(500).json(err)
  }
});

module.exports = router;