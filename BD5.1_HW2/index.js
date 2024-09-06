// index.js or server.js
const express = require('express');
const Employee = require('./models/employee.model.js'); // Import the Employee model
const { sequelize } = require('./lib/index.js'); // Import the sequelize instance

const app = express();
const PORT = process.env.PORT || 3000;

// Sync the database and create tables if they don't exist
sequelize.sync().then(() => {
  console.log('Database synced!');
});

// Dummy employees data
let employees = [
  {
    name: 'John Doe',
    department: 'Engineering',
    salary: 70000,
    designation: 'Software Engineer'
  },
  {
    name: 'Jane Smith',
    department: 'Marketing',
    salary: 55000,
    designation: 'Marketing Specialist'
  },
  {
    name: 'Alice Johnson',
    department: 'HR',
    salary: 60000,
    designation: 'HR Manager'
  },
  {
    name: 'Bob Brown',
    department: 'Sales',
    salary: 50000,
    designation: 'Sales Executive'
  }
];

// Endpoint to seed the database
app.get('/seed_db', async (req, res) => {
  try {
    // Use bulkCreate to insert multiple records
    await Employee.bulkCreate(employees);
    res.status(200).send('Database seeded with employee data!');
  } catch (error) {
    res.status(500).send('Error seeding database');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
