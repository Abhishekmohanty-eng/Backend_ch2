// lib/index.js
const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite' // The file where SQLite stores the data
});

// Export sequelize instance and DataTypes
module.exports = { sequelize, DataTypes };
