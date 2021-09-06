const { Post, Tag, PostTag, Comment } = require('../../models');
const router = require('express').Router();
const clog = require('../../utils/cLogger');
const {onlyIfLoggedIn} = require('../../middleware/auth');


// route for updating a comment
router.put('/:id', onlyIfLoggedIn, async (req, res) => {
    try{
        const commentObj = await Comment.findByPk(req.params.id);
        // make the changes to the post object
        let result = await commentObj.update({
            content: req.body.content
        })
        if(result){
            clog('Successfully updated comment', 'green');
            // this is redirecting to profile for some reason
        res.status(200).json({message: "Successfully updated comment"});
        } else {
            clog('Failed to create comment', 'red');
            res.status(400).json({message:"Failed to update comment based on submitted details"})
        }
    }catch(err){
        clog(err, 'red');
        res.status(500).json({message:"Failed to update comment"})
    }
});


module.exports = router;