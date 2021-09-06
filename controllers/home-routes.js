const { User, Post, Tag } = require('../models');
const router = require('express').Router();
const {onlyIfLoggedIn, homeRedirectOnSessionOut} = require('../middleware/auth');
const clog = require('../utils/cLogger');

// home route get request
router.get('/', async (req, res) => {
  try {
    // Get all posts, sorted by title
    const postData = await Post.findAll({
      include: ['owner', 'comments', 'tags'],
      order: [['title', 'ASC']],
    });

    // Serialize user data so templates can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    let session_logged_in = req.session.logged_in? true: false;

    // Pass serialized data into Handlebars.js template
    res.render('dashboard', { layout:'main', posts, logged_in: session_logged_in });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// tag route get all posts for a tag
router.get('/tag/:name', async (req, res) => {
  try {
    let spaceName = req.params.name.replace(/-+/g, ' ');
    // Get all posts, sorted by title
    const rawTag = await Tag.findOne({
      where: {name: spaceName},
      include: [{nested: true, all: true}],
      order: [['name', 'ASC']],
    });

    // Serialize user data so templates can read it
    const tag = rawTag.get({ plain: true });

    let session_logged_in = req.session.logged_in? true: false;

    // Pass serialized data into Handlebars.js template
    res.render('tag', { layout:'main', tag, logged_in: session_logged_in });
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

// get logout confirm template
router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    clog('Redirecting to logout confirmation', 'magenta');
      res.render('confirm-logout');
  } else {
    clog('User not logged in, ignoring request', 'yellow')
      res.status(404).end();
  }
  });

// get signup empty page, renders signup template
router.get('/signup', (req, res) => {
  try{
    if (req.session.logged_in){
      res.redirect('/profile');
      return;
    } else {
      res.render('signup');
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
      include: ['tags', 'comments', 'owner']
    });

    const posts = rawPosts.map((postObj)=>{
      return postObj.get({ plain: true });
    })

    res.render('profile', {posts, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

// render create post form view
router.get('/profile/post', onlyIfLoggedIn, async(req, res) => {
  try{
      res.render('create-post');  
  }
  catch(err){
    res.status(500).json(err)
  }
});

// get a specific post - render post view
router.get('/post/:id', async(req, res) => {

  try{
    var postObj = await Post.findByPk(req.params.id, {
      // include: ['owner', 'comments', 'tags'],
      include: [{nested: true, all: true}],
      attributes: {
        exclude: ['password']
      }
    })

    if(postObj){
      var post = postObj.get({plain: true});
      clog(`Found post: ${post.title}`, 'green');
      res.render('post',{
        post, 
        logged_in:req.session.logged_in,
        user_is_owner: req.session.user_id === postObj.owner.id? true: false,
      });
    } else {
      res.status(404).json({message:`No post for id:${req.params.id}`})
    }
  }
  catch(err){
    res.status(500).json(err)
  }
});


// get a specific post to update - render post view
router.get('/post/update/:id', async(req, res) => {

  try{
    var postObj = await Post.findByPk(req.params.id, {
      // include: ['owner', 'comments', 'tags'],
      include: [{nested: true, all: true}],
      attributes: {
        exclude: ['password']
      }
    })

    if(postObj){
      var post = postObj.get({plain: true});
      clog(`Found post: ${post.title}`, 'green');
      res.render('update-post',{post, logged_in:req.session.logged_in});
    } else {
      res.status(404).json({message:`No post for id:${req.params.id}`})
    }
  }
  catch(err){
    res.status(500).json(err)
  }
});

// get the create comment form
router.get('/post/:id/comment/', onlyIfLoggedIn, async(req, res) => {
  try{
    let rawPost = await Post.findByPk(req.params.id);
    var postObj = rawPost.get();
    res.render('create-comment', {post: postObj});  
  }
  catch(err){
    res.status(500).json(err)
  }
});

// route for deleting a post
router.get('/post/update/delete/:id', async(req, res) => {
  try{
      let postObj = await Post.findByPk(req.params.id);
      let post = postObj.get();
      res.render('confirm-delete', post);
  }catch(err){
      clog(err, 'red');
      res.status(500).json(err);
  }
});

module.exports = router;