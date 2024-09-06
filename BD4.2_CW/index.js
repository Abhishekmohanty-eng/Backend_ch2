const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.2 CW Template" });
});

// YOUR ENDPOINTS GO HERE
/**
Exercise 1: Get all movies

Wrap the database call in a try/catch block to handle errors.

If no movies are found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies

Expected Output

{
   movies: [... All the movies in DB]
}
*/

async function fetchAllMovies(){
  try {
    let query = 'SELECT * FROM movies';
    let response = await db.all(query);
    return { movies: response };
  } catch (error) {
    console.error('Error fetching movies from database:', error);
    throw new Error('Database query failed');
  }
}

app.get('/movies', async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await fetchAllMovies();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
Exercise 2: Fetch movies by genre

Wrap the database call in a try/catch block to handle errors.

If no movies by genre are found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies/genre/Biography
*/

async function fetchMoviesByGenre(genre) {
  try {
    let query = 'SELECT * FROM movies WHERE genre = ?';
    let response = await db.all(query, genre);
    return response;
  } catch (error) {
    console.error('Error fetching movies from database:', error);
    throw new Error('Database query failed');
  }
}

app.get('/movies/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  try {
    const movies = await fetchMoviesByGenre(genre);
    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found for the given genre" });
    }
    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/***
Exercise 3: Fetch movie by ID

Wrap the database call in a try/catch block to handle errors.

If no movie by ID is found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies/details/2

Expected Output

{
  movie: {
    id: 2,
    title: 'Baahubali 2: The Conclusion',
    director: 'S.S. Rajamouli',
    genre: 'Action',
    release_year: 2017,
    rating: 4.7,
    actor: 'Prabhas',
    box_office_collection: 181,
  },
*/
async function fetchMovieById(id) {
  try {
    let query = 'SELECT * FROM movies WHERE id = ?';
    let movie = await db.get(query, id);
    return movie;
  } catch (error) {
    console.error('Error fetching movie from database:', error);
    throw new Error('Database query failed');
  }
}
app.get('/movies/details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await fetchMovieById(id);
    if (!movie) {
      return res.status(404).json({ error: "No movie found for the given ID" });
    }
    res.status(200).json({ movie });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
Exercise 4: Fetch movies by release year

Wrap the database call in a try/catch block to handle errors.

If no movies by release year are found return 404 error

If some error happens while reading database return 500 error

Otherwise send 200 status & the data

API Call

http://localhost:3000/movies/release-year/2015

Expected Output

{
  movies: [
    {
      id: 4,
      title: 'Bajrangi Bhaijaan',
      director: 'Kabir Khan',
      genre: 'Drama',
      release_year: 2015,
      rating: 4.5,
      actor: 'Salman Khan',
      box_office_collection: 130,
    },
  ],
}
*/


async function fetchMoviesByReleaseYear(year) {
  try {
    let query = 'SELECT * FROM movies WHERE release_year = ?';
    let response = await db.all(query, year);
    return response;
  } catch (error) {
    console.error('Error fetching movies from database:', error);
    throw new Error('Database query failed');
  }
}

app.get('/movies/release-year/:year', async (req, res) => {
  const { year } = req.params;
  try {
    const movies = await fetchMoviesByReleaseYear(year);
    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found for the given release year" });
    }
    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});