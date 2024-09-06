// index.js or server.js
const express = require('express');
const Book = require('./models/book.model.js'); // Import the Book model
const { sequelize } = require('./lib/index.js'); // Import the sequelize instance

const app = express();
const PORT = process.env.PORT || 3000;

// Sync the database and create tables if they don't exist
sequelize.sync().then(() => {
  console.log('Database synced!');
});

// Dummy books data
let books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A novel about the American dream and the roaring twenties.',
    genre: 'Fiction'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about racial injustice in the deep South.',
    genre: 'Fiction'
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel set in a totalitarian society under constant surveillance.',
    genre: 'Dystopian'
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    description: 'A narrative of the adventures of the wandering sailor Ishmael.',
    genre: 'Adventure'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel that also critiques the British landed gentry.',
    genre: 'Romance'
  }
];

// Endpoint to seed the database
app.get('/seed_db', async (req, res) => {
  try {
    // Use bulkCreate to insert multiple records
    await Book.bulkCreate(books);
    res.status(200).send('Database seeded with book data!');
  } catch (error) {
    res.status(500).send('Error seeding database');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
