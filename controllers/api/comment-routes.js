const { Comment, User} = require('../../models');
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

// route for deleting a comment
router.delete('/:id', onlyIfLoggedIn, async (req, res) => {
    try{
        const commentObj = await Comment.findByPk(req.params.id);

        const owner = await User.findByPk(commentObj.user_id);

        // check that the logged in user is the comment owner
        if(req.session.user_id === owner.id){
            let result = await commentObj.destroy();
            if(result){
                clog('Successfully deleted comment', 'green');
                // this is redirecting to profile for some reason
                res.status(200).json({message: "Successfully deleted comment"});
            } else {
                clog('Failed to create comment', 'red');
                res.status(400).json({message:"Failed to deleted comment based on submitted details"})
            }
        } else {
            clog(`User doesn't have access to delete other peoples comments`, 'red');
            res.render('login');
        }

    }catch(err){
        clog(err, 'red');
        res.status(500).json({message:"Failed to deleted comment for some uncaught reason"})
    }
});


module.exports = router;