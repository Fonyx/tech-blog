const { User, Comment, Post, Tag } = require('../models');
const router = require('express').Router();
const {onlyIfLoggedIn} = require('../middleware/auth');
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

// tag route gets all tags, and returns a sound tag and a list of allTags
router.get('/tag/:name', async (req, res) => {
  try {
    let spaceName = req.params.name.replace(/-+/g, ' ');

    const allRawTags = await Tag.findAll({
      include: [{nested: true, all: true}],
      order: [['name', 'ASC']],
    })

    // Serialize all tags
    const allTags = allRawTags.map((tag)=>{
      return tag.get({plain:true});
    })

    // get the searched tag and return separately
    const tag = allTags.find(element => element.name===spaceName);

    let session_logged_in = req.session.logged_in? true: false;

    // Pass serialized data into Handlebars.js template
    res.render('tag', { layout:'main', tag, allTags, logged_in: session_logged_in });
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
router.get('/logout', onlyIfLoggedIn, (req, res) => {
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

// get a specific post - render post view - you can do this when not logged in
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
router.get('/post/update/:id',onlyIfLoggedIn, async(req, res) => {

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

      // check post owner is the current user
      if(post.owner.id === req.session.user_id){
        clog(`Found post: ${post.title}`, 'green');
        res.render('update-post',{post, logged_in:req.session.logged_in});
      } else {
        clog('User does not have permission to update this post', 'red');
        res.redirect('/login');
      }

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
      res.render('confirm-delete-post', post);
  }catch(err){
      clog(err, 'red');
      res.status(500).json(err);
  }
});

// route for deleting a comment
router.get('/comment/update/delete/:id', async(req, res) => {
  try{
      let postObj = await Post.findByPk(req.params.id);
      let post = postObj.get();
      res.render('confirm-delete-comment', post);
  }catch(err){
      clog(err, 'red');
      res.status(500).json(err);
  }
});

// route for viewing a comment - yuck route, models can't give back their owner object - this isn't an issue for the get/post because all the data is returned as nested objects - this should be improved
router.get('/comment/:id', async(req, res) => {
  try{
    // get comment object
    let commentObj = await Comment.findByPk(req.params.id, {
      all: true,
      nested: true
    });
    let comment = commentObj.get();
    // get post object
    let postObj = await Post.findByPk(comment.post_id, {
      all: true,
      nested: true
    });
    let post = postObj.get();
    // get comment owner object
    let commentOwnerObj = await User.findByPk(comment.user_id, {
      all: true,
      nested: true
    });
    let commentOwner = commentOwnerObj.get();
    // check if the comment owner is currently logged in
    let commenter_is_comment_owner = req.session.user_id === commentOwner.id? true: false
    res.render('comment', {comment, post, commentOwner, commenter_is_comment_owner});
}catch(err){
    clog(err, 'red');
    res.status(500).json(err);
}
});

module.exports = router;