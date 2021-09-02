const connection = require('../config/connection');
const {User, Post, PostTag, Comment, Tag} = require('../models');
const userData = require('./user-data.json');
const tagData = require('./tag-data.json');
const postData = require('./post-data.json');
const postTagData = require('./post-tags-data.json');
const commentData = require('./comment-data.json');

const seedDatabase = async() => {
    
    await connection.sync({force: true});

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    await Tag.bulkCreate(tagData, {
        individualHooks: true,
        returning: true,
    })
    await Post.bulkCreate(postData, {
        individualHooks: true,
        returning: true,
    })
    await PostTag.bulkCreate(postTagData, {
        individualHooks: true,
        returning: true,
    })
    await Comment.bulkCreate(commentData, {
        individualHooks: true,
        returning: true,
    })

    process.exit(0);
}

seedDatabase();