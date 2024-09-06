// models/post.model.js
const { sequelize, DataTypes } = require('../lib/index.js');

// Define the Post model
const Post = sequelize.define('Post', {
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Export the model
module.exports = Post;
