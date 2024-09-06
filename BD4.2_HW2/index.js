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

// Function to get all tracks
async function getAllTracks() {
  try {
    const tracks = await db.all("SELECT * FROM tracks");
    return tracks;
  } catch (err) {
    console.error("Error fetching tracks:", err.message);
    throw err;
  }
}

// Route to get all tracks
app.get("/tracks", async (req, res) => {
  try {
    if (!db) {
      await initializeDb();
    }
    let results = await getAllTracks();
    if (results.length === 0) {
      res.status(404).json({ error: "No tracks found" });
    } else {
      res.status(200).json({ tracks: results });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to get tracks by artist
async function getTracksByArtist(artist) {
  try {
    const tracks = await db.all("SELECT * FROM tracks WHERE artist = ?", artist);
    return tracks;
  } catch (error) {
    console.error("Error fetching tracks by artist:", error.message);
    throw error;
  }
}

// Route to get tracks by artist
app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    const artist = req.params.artist;
    const tracks = await getTracksByArtist(artist);
    if (tracks.length === 0) {
      res.status(404).json({ error: "No tracks found for this artist" });
    } else {
      res.status(200).json({ tracks });
    }
  } catch (error) {
    console.error("Error in getTracksByArtist:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
Exercise 3: Retrieve Tracks by Genre

Define the endpoint /tracks/genre/:genre to retrieve tracks by genre.

Define the function name getTracksByGenre which returns tracks for a given genre from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return 404 error if no data is found
*/
async function getTracksByGenre(genre) {
  try {
    const tracks = await db.all("SELECT * FROM tracks WHERE genre = ?", genre);
    return tracks;
  } catch (err) {
    console.error("Error fetching tracks by genre:", err.message);
    throw err;
  }
}

app.get("/tracks/genre/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;
    const tracks = await getTracksByGenre(genre);
    if (tracks.length === 0) {
      res.status(404).json({ error: "No tracks found for this genre" });
    } else {
      res.status(200).json({ tracks });
    }
  } catch (error) {
    console.error("Error in getTracksByGenre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
Exercise 4: Retrieve Tracks by Release Year

Define the endpoint /tracks/release_year/:year to retrieve tracks by release year.

Define the function name getTracksByReleaseYear which returns tracks for a given release year from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return 404 error if no data is found
*/
async function getTracksByReleaseYear(year) {
  try {
    const tracks = await db.all("SELECT * FROM tracks WHERE release_year = ?", year);
    return tracks;
  } catch (err) {
    console.error("Error fetching tracks by release year:", err.message);
    throw err;
  }
}

app.get("/tracks/release_year/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const tracks = await getTracksByReleaseYear(year);
    if (tracks.length === 0) {
      res.status(404).json({ error: "No tracks found for this release year" });
    } else {
      res.status(200).json({ tracks });
    }
  } catch (error) {
    console.error("Error in getTracksByReleaseYear:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
