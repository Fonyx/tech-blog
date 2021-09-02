const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Tag = require('./Tag');
const PostTag = require('./PostTag');

User.hasMany(Post, {
  foreignKey: 'user_id',
  as: 'posts',
});

Post.belongsTo(User,{
  foreignKey: 'user_id',
  as: 'owner'
});

Post.hasMany(Comment, {
  foreignKey: 'id',
  as: 'comments',
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post"
})

Post.belongsToMany(Tag, {
  through: {
    model: PostTag,
  },
  as: 'tags',
});

Tag.belongsToMany(Post, {
  through: {
    model: PostTag,
  },
  as: 'posts',
});

module.exports = {
  User,
  Post,
  PostTag,
  Comment,
  Tag,
};
