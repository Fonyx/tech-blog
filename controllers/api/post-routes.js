const { Post, Tag, PostTag } = require('../../models');
const router = require('express').Router();
const clog = require('../../utils/cLogger');
const {onlyIfLoggedIn} = require('../../middleware/auth');

async function makeTagBulkCreatePackage(tag_list) {
    var tags = tag_list.map((name) => {
        return {"name": name};
    })
    return tags;
}

async function makePostTagBulkCreatePackage(tagObjs, postObj){
    let post_tags = tagObjs.map((tag) => {
        return {
            post_id: postObj.id,
            tag_name: tag.name
        }
    });
    return post_tags;
}

// route for a new post
router.post('/', onlyIfLoggedIn, async (req, res) => {
    try{

        const postObj = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });
        // prepare the tags with tag_name label
        let prepped_tags = await makeTagBulkCreatePackage(req.body.tag_list);
        let tagObjs = await Tag.bulkCreate(prepped_tags, {
            ignoreDuplicates: true,
            individualHooks: true,
            returning: true
        });
        // delete all current postTags for a post before creating new ones
        await PostTag.destroy({where: {
            post_id: postObj.id}
        });

        // prepare the postTag elements
        let prepped_post_tags = await makePostTagBulkCreatePackage(tagObjs, postObj);

        let postTags = await PostTag.bulkCreate(prepped_post_tags)

        if(postObj && postTags){
            res.status(200).json({message:"Successfully posted"})
        } else {
            res.status(400).json({message:"Failed to post, check request body"})
        }

    }catch(err){
        clog(err, 'red');
        res.status(500).json(err);
    }
})

// route for updating a post
router.put('/:id', onlyIfLoggedIn, async (req, res) => {
    try{
        const postObj = await Post.findByPk(req.params.id);
        // make the changes to the post object
        postObj.update({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        })
        // prepare the tags with tag_name label
        let prepped_tags = await makeTagBulkCreatePackage(req.body.tag_list);
        let tagObjs = await Tag.bulkCreate(prepped_tags, {
            // ignoreDuplicates: true,
            updateOnDuplicate: ['name'],
            // apply hooks to all elements in bulk
            individualHooks: true,
            returning: true
        });
        // delete all current postTags for a post before creating new ones
        await PostTag.destroy({where: {
            post_id: postObj.id}
        });

        // prepare the postTag elements
        let prepped_post_tags = await makePostTagBulkCreatePackage(tagObjs, postObj);

        let postTags = await PostTag.bulkCreate(prepped_post_tags)

        if(postObj && postTags){
            clog('Successfully updated post', 'green');
            res.status(200).json({message:"Successfully posted"})
        } else {
            clog('Failed to update post', 'red');
            res.status(400).json({message:"Failed to post, check request body"})
        }
    }catch(err){
        clog(err, 'red');
        res.status(500).json(err);
    }
})


module.exports = router;