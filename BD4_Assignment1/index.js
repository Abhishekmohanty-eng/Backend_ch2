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

// Get All Restaurants
app.get("/restaurants", (req, res) => {
  const sql = "SELECT * FROM restaurants";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }
    res.json({ restaurants: rows });
  });
});

// Get Restaurant by ID
app.get("/restaurants/details/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM restaurants WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json({ restaurant: row });
  });
});

// Get Restaurants by Cuisine
app.get("/restaurants/cuisine/:cuisine", (req, res) => {
  const cuisine = req.params.cuisine;
  const sql = "SELECT * FROM restaurants WHERE cuisine = ?";
  db.all(sql, [cuisine], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No restaurants found for this cuisine" });
    }
    res.json({ restaurants: rows });
  });
});

// Get Restaurants by Filter
app.get("/restaurants/filter", (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
  const filters = [];
  const values = [];

  if (isVeg) {
    filters.push("isVeg = ?");
    values.push(isVeg);
  }
  if (hasOutdoorSeating) {
    filters.push("hasOutdoorSeating = ?");
    values.push(hasOutdoorSeating);
  }
  if (isLuxury) {
    filters.push("isLuxury = ?");
    values.push(isLuxury);
  }

  const sql = `SELECT * FROM restaurants WHERE ${filters.join(" AND ")}`;
  db.all(sql, values, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No restaurants found matching the filters" });
    }
    res.json({ restaurants: rows });
  });
});

// Get Restaurants Sorted by Rating
app.get("/restaurants/sort-by-rating", (req, res) => {
  const sql = "SELECT * FROM restaurants ORDER BY rating DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }
    res.json({ restaurants: rows });
  });
});

// Get All Dishes
app.get("/dishes", (req, res) => {
  const sql = "SELECT * FROM dishes";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No dishes found" });
    }
    res.json({ dishes: rows });
  });
});

// Get Dish by ID
app.get("/dishes/details/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM dishes WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Dish not found" });
    }
    res.json({ dish: row });
  });
});

// Get Dishes by Filter
app.get("/dishes/filter", (req, res) => {
  const { isVeg } = req.query;
  const sql = "SELECT * FROM dishes WHERE isVeg = ?";
  db.all(sql, [isVeg], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No dishes found matching the filter" });
    }
    res.json({ dishes: rows });
  });
});

// Get Dishes Sorted by Price
app.get("/dishes/sort-by-price", (req, res) => {
  const sql = "SELECT * FROM dishes ORDER BY price ASC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No dishes found" });
    }
    res.json({ dishes: rows });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
