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
      filename: "artworks.sqlite",
      driver: sqlite3.Database
    });
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error("Error connecting to the SQLite database:", error);
    throw new Error("Database connection failed");
  }
};

// Function to fetch all artworks
const fetchAllArtworks = async () => {
  const query = "SELECT id, title, artist FROM artworks";
  try {
    const artworks = await db.all(query);
    return { artworks };
  } catch (error) {
    console.error("Error fetching all artworks:", error);
    throw error;
  }
};

// Endpoint to get all artworks
app.get("/artworks", async (req, res) => {
  try {
    const artworks = await fetchAllArtworks();
    if (artworks.artworks.length === 0) {
      return res.status(404).json({ error: "No artworks found" });
    }
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchArtworksByArtist = async (artist) => {
  const query = "SELECT id, title, artist, year FROM artworks WHERE artist = ?";
  try {
    const artworks = await db.all(query, [artist]);
    console.log("Artworks fetched:", artworks); // Log the fetched artworks
    return { artworks };
  } catch (error) {
    console.error("Error fetching artworks by artist:", error);
    throw error;
  }
};

app.get("/artworks/artist/:artist", async (req, res) => {
  try {
    const artist = req.params.artist;
    console.log("Fetching artworks for artist:", artist); // Log the artist name
    const artworks = await fetchArtworksByArtist(artist);
    if (artworks.artworks.length === 0) {
      return res.status(404).json({ error: "No artworks found" });
    }
    res.status(200).json(artworks);
  } catch (error) {
    console.error("Error in /artworks/artist/:artist route:", error);
    res.status(500).json({ error: error.message });
  }
});


// Function to fetch artworks by year
const fetchArtworksByYear = async (year) => {
  const query = "SELECT id, title, artist, year FROM artworks WHERE year = ?";
  try {
    const artworks = await db.all(query, [year]);
    return { artworks };
  } catch (error) {
    console.error("Error fetching artworks by year:", error);
    throw error;
  }
};

// Endpoint to get artworks by year
app.get("/artworks/year/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const artworks = await fetchArtworksByYear(year);
    if (artworks.artworks.length === 0) {
      return res.status(404).json({ error: "No artworks found" });
    }
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch artworks by medium
const fetchArtworksByMedium = async (medium) => {
  const query = "SELECT id, title, artist, medium FROM artworks WHERE medium = ?";
  try {
    const artworks = await db.all(query, [medium]);
    return { artworks };
  } catch (error) {
    console.error("Error fetching artworks by medium:", error);
    throw error;
  }
};

// Endpoint to get artworks by medium
app.get("/artworks/medium/:medium", async (req, res) => {
  try {
    const medium = req.params.medium;
    const artworks = await fetchArtworksByMedium(medium);
    if (artworks.artworks.length === 0) {
      return res.status(404).json({ error: "No artworks found" });
    }
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Function to filter movies by release year and actor
const filterByYearAndActor = async (releaseYear, actor) => {
  const query = `
    SELECT id, title, director, genre, release_year, rating, actor, box_office_collection 
    FROM movies 
    WHERE release_year = ? AND actor = ?
  `;
  try {
    const movies = await db.all(query, [releaseYear, actor]);
    return { movies };
  } catch (error) {
    console.error("Error fetching movies by year and actor:", error);
    throw error;
  }
};

// Endpoint to filter movies by release year and actor
app.get("/movies/year-actor", async (req, res) => {
  try {
    const { releaseYear, actor } = req.query;
    const movies = await filterByYearAndActor(releaseYear, actor);
    if (movies.movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Function to filter award-winning movies
const filterAwardWinningMovies = async () => {
  const query = `
    SELECT id, title, director, genre, release_year, rating, actor, box_office_collection 
    FROM movies 
    WHERE rating >= 4.5 
    ORDER BY rating ASC
  `;
  try {
    const movies = await db.all(query);
    return { movies };
  } catch (error) {
    console.error("Error fetching award-winning movies:", error);
    throw error;
  }
};

// Endpoint to fetch award-winning movies
app.get("/movies/award-winning", async (req, res) => {
  try {
    const movies = await filterAwardWinningMovies();
    if (movies.movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }
    res.status(200).json(movies);
  } catch (error) {
    res
      // Function to fetch blockbuster movies
      const fetchBlockbusterMovies = async () => {
        const query = `
          SELECT id, title, director, genre, release_year, rating, actor, box_office_collection 
          FROM movies 
          WHERE box_office_collection >= 100 
          ORDER BY box_office_collection DESC
        `;
        try {
          const movies = await db.all(query);
          return { movies };
        } catch (error) {
          console.error("Error fetching blockbuster movies:", error);
          throw error;
        }
      };
    app.get("/movies/blockbuster", async (req, res) => {
      try {
        const movies = await fetchBlockbusterMovies();
        if (movies.movies.length === 0) {
          return res.status(404).json({ error: "No movies found" });
        }
        res.status(200).json(movies);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
// Start the server
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
