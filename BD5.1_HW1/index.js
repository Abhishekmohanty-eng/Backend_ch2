// index.js or server.js
const express = require('express');
const Post = require('./models/post.model.js'); // Import the Post model
const { sequelize } = require('./lib/index.js'); // Import the sequelize instance

const app = express();
const PORT = process.env.PORT || 3000;

// Sync the database and create tables if they don't exist
sequelize.sync().then(() => {
  console.log('Database synced!');
});

// Endpoint to seed the database
app.get('/seed_db', async (req, res) => {
  // Dummy posts data
  const posts = [
    {
      name: 'Post 1',
      author: 'Author 1',
      title: 'Title 1',
      content: 'Content 1'
    },
    {
      name: 'Post 2',
      author: 'Author 2',
      title: 'Title 2',
      content: 'Content 2'
    },
    {
      name: 'Post 3',
      author: 'Author 3',
      title: 'Title 3',
      content: 'Content 3'
    }
  ];

  try {
    // Use bulkCreate to insert multiple records
    await Post.bulkCreate(posts);
    res.status(200).send('Database seeded with dummy data!');
  } catch (error) {
    res.status(500).send('Error seeding database');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
