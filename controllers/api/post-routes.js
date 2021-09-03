const { Post } = require('../../models');
const router = require('express').Router();
const clog = require('../../utils/cLogger');
const {onlyIfLoggedIn} = require('../../middleware/auth');


// route for a new post
router.post('/', onlyIfLoggedIn, async (req, res) => {
    try{

        const postObj = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });
        if(postObj){
            res.status(200).json({message:"Successfully posted"})
        } else {
            res.status(400).json({message:"Failed to post, check request body"})
        }

    }catch(err){
        clog(err, 'red');
        res.status(500).json(err);
    }
})


module.exports = router;