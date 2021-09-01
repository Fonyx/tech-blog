const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Tag = require('./Tag');
const PostTag = require('./PostTag');

User.hasMany(Post, {
  foreignKey: 'id',
  as: 'User Post',
});

Post.hasMany(Comment, {
  foreignKey: 'id',
  as: 'Post Comment',
});

Post.belongsToMany(Tag, {
  through: {
    model: PostTag,
  },
  as: 'Post Tags',
});

Tag.belongsToMany(Post, {
  through: {
    model: PostTag,
  },
  as: 'Tag Posts',
});

module.exports = {
  User,
  Post,
  PostTag,
  Comment,
  Tag,
};
