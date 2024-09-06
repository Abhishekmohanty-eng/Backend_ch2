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

async function fetchAllMovies() {
  try {
    let query = "SELECT id, title, release_year FROM movies"; // Fixed typo here
    let respond = await db.all(query);
    return { movies: respond };
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

app.get("/movies", async (req, res) => {
  try {
    const movies = await fetchAllMovies();
    if (movies.movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
Exercise 2: SELECT id, title, actor & release_year from all movies by an actor

Create an endpoint /movies/actor/:actor to return all the movies of an actor.

Create a function fetchMoviesByActor to fetch all the movies of an actor from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/actor/Salman%20Khan*/

async function fetchMoviesByActor(actor) {
  try {
    let query = 'SELECT id, title, actor, release_year FROM movies WHERE actor = ?';
    let response = await db.all(query, [actor]); // Use `response` for clarity
    return { movies: response };
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw err;
  }
}

app.get("/movies/actor/:actor", async (req, res) => {
  try {
    const actor = req.params.actor;
    const movies = await fetchMoviesByActor(actor);
    if (movies.movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error("Error handling /movies/actor/:actor request:", err);
    res.status(500).json({ error: err.message });
  }
});
/**
Exercise 3: SELECT id, title, director & release_year from all movies by a director

Create an endpoint /movies/director/:director to return all the movies of an actor.

Create a function fetchMoviesByDirector to fetch all the movies of an actor from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/director/Kabir%20Khan
*/

async function fetchMoviesByDirector(director) {
  try {
    let query = 'SELECT id, title, director, release_year FROM movies WHERE director = ?';
    let response = await db.all(query, [director]);
    return { movies: response };
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw err;
  }
}
app.get("/movies/director/:director", async (req, res) => {
  try {
    const director = req.params.director;
    const movies = await fetchMoviesByDirector(director);
    if (movies.movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error("Error handling /movies/director/:director request:", err);
    res.status(500).json({ error: err.message });
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
