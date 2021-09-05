const connection = require('../config/connection');
const {User, Post, PostTag, Comment, Tag} = require('../models');
const userData = require('./herokuSeeds/user-data.json');
const tagData = require('./herokuSeeds/tag-data.json');
const postData = require('./herokuSeeds/post-data.json');
const postTagData = require('./herokuSeeds/post-tags-data.json');
const commentData = require('./herokuSeeds/comment-data.json');
// https://fuzzyblog.io/blog/heroku/2019/10/16/importing-your-local-mysql-database-into-heroku.html
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