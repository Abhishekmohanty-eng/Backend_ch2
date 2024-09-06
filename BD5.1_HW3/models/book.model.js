// models/book.model.js
const { sequelize, DataTypes } = require('../lib/index.js');

// Define the Book model
const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Export the model
module.exports = Book;
 