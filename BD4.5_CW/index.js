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
    db = await open({
      filename: "movies.sqlite",
      driver: sqlite3.Database
    });
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error("Error connecting to the SQLite database:", error);
    throw new Error("Database connection failed");
  }
};

app.get("/", (req, res) => {
  res.send("Hello World");
});
// Endpoint: /movies/year-actor
app.get("/movies/year-actor", async (req, res) => {
  const releaseYear = req.query.releaseYear;
  const actor = req.query.actor;

  if (!releaseYear || !actor) {
    return res.status(400).json({ error: "Release year and actor are required." });
  }

  try {
    const movies = await filterByYearAndActor(releaseYear, actor);
    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found for the given criteria." });
    }
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const filterByYearAndActor = async (releaseYear, actor) => {
  try {
    const movies = await db.all(
      "SELECT * FROM movies WHERE release_year = ? AND actor = ?",
      releaseYear,
      actor
    );
    return movies;
  } catch (error) {
    throw new Error("Failed to fetch movies by year and actor.");
  }
};
// Endpoint: /movies/award-winning
app.get("/movies/award-winning", async (req, res) => {
  try {
    const movies = await filterAwardWinningMovies();
    if (movies.length === 0) {
      return res.status(404).json({ error: "No award-winning movies found." });
    }
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const filterAwardWinningMovies = async () => {
  try {
    const movies = await db.all(
      "SELECT * FROM movies WHERE rating >= 4.5 ORDER BY rating ASC"
    );
    return movies;
  } catch (error) {
    throw new Error("Failed to fetch award-winning movies.");
  }
};
// Endpoint: /movies/blockbuster
app.get("/movies/blockbuster", async (req, res) => {
  try {
    const movies = await fetchBlockbusterMovies();
    if (movies.length === 0) {
      return res.status(404).json({ error: "No blockbuster movies found." });
    }
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchBlockbusterMovies = async () => {
  try {
    const movies = await db.all(
      "SELECT * FROM movies WHERE box_office_collection >= 100 ORDER BY box_office_collection DESC"
    );
    return movies;
  } catch (error) {
    throw new Error("Failed to fetch blockbuster movies.");
  }
};

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
