const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
let db;


app.use(cors()); 

// Initialize and connect to SQLite database
const initializeDb = async () => {
  try {
    db = await open({ filename: "database.sqlite", driver: sqlite3.Database });
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error("Error connecting to the SQLite database:", error);
    throw new Error("Database connection failed");
  }
};
/**
Exercise 1: Fetch all movies

Create an endpoint /movies that fetches all the movies from the database.

API Call

http://localhost:3000/movies

Expected Output

// You'll get all the movies in the database in the format
// { movies: [...] }
*/
// Fetch all movies from the database
const fetchAllMovies = async () => {
  try {
    let query = 'SELECT * FROM movies';
    let response = await db.all(query);
    return { movies: response };
  } catch (error) {
    console.error('Error fetching movies from database:', error);
    throw new Error('Database query failed');
  }
};

// Set up the /movies endpoint
app.get('/movies', async (req, res) => {
  try {
    if (!db) {
      await initializeDb(); // Ensure the database is initialized
    }
    let results = await fetchAllMovies();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
Exercise 2: Fetch all movies by genre

Create an endpoint /movies/genre/:genre that fetches movies based on genre from the database.

API Call

http://localhost:3000/movies/genre/Biography

Expected Output

{
  movies: [
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 6,
      title: 'Sanju',
      director: 'Rajkumar Hirani',
      genre: 'Biography',
      release_year: 2018,
      rating: 4.4,
      actor: 'Ranbir Kapoor',
      box_office_collection: 120,
    },
  ],
}
*/


const fetchMoviesByGenre = async (genre) => {
  try {
    let query = 'SELECT * FROM movies WHERE genre = ?';
    let response = await db.all(query, [genre]);
    return { movies: response };
  } catch (error) {
    console.error('Error fetching movies from database:', error);
    throw new Error('Database query failed');
  }
};

app.get('/movies/genre/:genre', async (req, res) => {
  try {
    if (!db) {
      await initializeDb(); 
    }
    let results = await fetchMoviesByGenre(req.params.genre);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
Exercise 3: Fetch movie details by ID

Create an endpoint /movies/details/:id that fetches movies based on id from the database.

API Call

http://localhost:3000/movies/details/3

Expected Output

{
  movie: {
    id: 3,
    title: 'PK',
    director: 'Rajkumar Hirani',
    genre: 'Comedy',
    release_year: 2014,
    rating: 4.6,
    actor: 'Aamir Khan',
    box_office_collection: 140,  
  }
}
*/
const fetchMovieById = async (id) => {
  try {
    let query = 'SELECT * FROM movies WHERE id = ?';
    let response = await db.get(query, [id]);
    if (response) {
      return { movie: response };
    } else {
      throw new Error('Movie not found');
    }
  } catch (error) {
    console.error('Error fetching movie from database:', error);
    throw new Error('Database query failed');
  }
};

app.get('/movies/details/:id', async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await fetchMovieById(req.params.id);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
Exercise 4: Fetch movie details by release_year

Create an endpoint /movies/release_year/:year that fetches movies based on release_year from the database.

API Call

http://localhost:3000/movies/release_year/2016

Expected Output

{
  movies: [
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 5,
      title: 'Sultan',
      director: 'Ali Abbas Zafar',
      genre: 'Drama',
      release_year: 2016,
      rating: 4.3,
      actor: 'Salman Khan',
      box_office_collection: 120,
    },
  ],
}
*/
const fetchMoviesByReleaseYear = async (year) => {
  try {
    let query = 'SELECT * FROM movies WHERE release_year = ?';
    let response = await db.all(query, [year]);
    return { movies: response };
  } catch (error) {
    console.error('Error fetching movies from database:', error);
    throw new Error('Database query failed');
  }
};

app.get('/movies/release_year/:year', async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await fetchMoviesByReleaseYear(req.params.year);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

(async () => {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();
