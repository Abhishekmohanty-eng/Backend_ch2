// models/employee.model.js
const { sequelize, DataTypes } = require('../lib/index.js');

// Define the Employee model
const Employee = sequelize.define('Employee', {
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  department: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  designation: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Export the model
module.exports = Employee;
