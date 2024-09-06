const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Exercise 1: Get All Games
app.get("/games", async (req, res) => {
  try {
    db.all("SELECT * FROM games", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ games: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Get Game by ID
app.get("/games/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM games WHERE id = ?", [id], (err, row) => {
      if (err) {
        throw err;
      }
      res.json({ game: row });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Get Games by Genre
app.get("/games/genre/:genre", async (req, res) => {
  const { genre } = req.params;
  try {
    db.all("SELECT * FROM games WHERE genre = ?", [genre], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ games: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Get Games by Platform
app.get("/games/platform/:platform", async (req, res) => {
  const { platform } = req.params;
  try {
    db.all("SELECT * FROM games WHERE platform = ?", [platform], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ games: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 5: Get Games Sorted by Rating
app.get("/games/sort-by-rating", async (req, res) => {
  try {
    db.all("SELECT * FROM games ORDER BY rating DESC", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ games: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 6: Get All Players
app.get("/players", async (req, res) => {
  try {
    db.all("SELECT * FROM players", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ players: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 7: Get Player by ID
app.get("/players/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM players WHERE id = ?", [id], (err, row) => {
      if (err) {
        throw err;
      }
      res.json({ player: row });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 8: Get Players by Platform
app.get("/players/platform/:platform", async (req, res) => {
  const { platform } = req.params;
  try {
    db.all("SELECT * FROM players WHERE platform = ?", [platform], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ players: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 9: Get Players Sorted by Rating
app.get("/players/sort-by-rating", async (req, res) => {
  try {
    db.all("SELECT * FROM players ORDER BY rating DESC", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ players: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 10: Get All Tournaments
app.get("/tournaments", async (req, res) => {
  try {
    db.all("SELECT * FROM tournaments", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ tournaments: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 11: Get Tournament by ID
app.get("/tournaments/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.get("SELECT * FROM tournaments WHERE id = ?", [id], (err, row) => {
      if (err) {
        throw err;
      }
      res.json({ tournament: row });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 12: Get Tournaments by Game ID
app.get("/tournaments/game/:gameId", async (req, res) => {
  const { gameId } = req.params;
  try {
    db.all("SELECT * FROM tournaments WHERE gameId = ?", [gameId], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ tournaments: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 13: Get Tournaments Sorted by Prize Pool
app.get("/tournaments/sort-by-prize-pool", async (req, res) => {
  try {
    db.all("SELECT * FROM tournaments ORDER BY prizePool DESC", [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({ tournaments: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
