const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000
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

app.get('/', (req, res) => {
  res.send("I am on BD4.3 - CWv");
});
// Fetch all movies
const fetchAllMovies = async () => {
  try {
    const movies = await db.all("SELECT * FROM movies");
    return movies;
  } catch (error) {
    console.error("Error fetching all movies:", error.message);
    throw error;
  }
};

app.get("/movies", async (req, res) => {
  try {
    const movies = await fetchAllMovies();
    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch movies by actor
const filterByActor = async (actor) => {
  try {
    const movies = await db.all("SELECT * FROM movies WHERE actor = ?", actor);
    return movies;
  } catch (error) {
    console.error("Error fetching movies by actor:", error.message);
    throw error;
  }
};

app.get("/movies/actor/:actor", async (req, res) => {
  try {
    const actor = req.params.actor;
    const movies = await filterByActor(actor);
    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found for this actor" });
    }
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch movies by director
const filterByDirector = async (director) => {
  try {
    const movies = await db.all("SELECT * FROM movies WHERE director = ?", director);
    return movies;
  } catch (error) {
    console.error("Error fetching movies by director:", error.message);
    throw error;
  }
};

app.get("/movies/director/:director", async (req, res) => {
  try {
    const director = req.params.director;
    const movies = await filterByDirector(director);
    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found for this director" });
    }
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
