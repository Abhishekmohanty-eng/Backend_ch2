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

// Function to fetch all books from the database
const getAllBooks = async () => {
  try {
    const books = await db.all("SELECT * FROM books");
    if (books.length === 0) {
      throw new Error("No books found");
    }
    return books;
  } catch (err) {
    console.error("Error fetching all books:", err.message);
    throw err;
  }
};

app.get("/", (req, res) => {
  res.send("started BD4.2 - HW1");
});

// Fetch all books
app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json({ books });
  } catch (err) {
    if (err.message === "No books found") {
      res.status(404).json({ error: "No books found" });
    } else {
      res.status(500).json({ error: "Failed to fetch books" });
    }
  }
});

const getAllBooksByAuthor = async (author) => {
  try {
    const books = await db.all("SELECT * FROM books WHERE author = ?", author);
    if (books.length === 0) {
      throw new Error("No books found for the specified author");
    }
    return books;
  } catch (err) {
    console.error("Error fetching books by author:", err.message);
    throw err;
  }
};

app.get("/books/author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const books = await getAllBooksByAuthor(author);
    res.status(200).json({ books });
  } catch (err) {
    if (err.message === "No books found for the specified author") {
      res
        .status(404)
        .json({ error: "No books found for the specified author" });
    } else {
      res.status(500).json({ error: "Failed to fetch books by author" });
    }
  }
});

const getAllBooksByGenre = async (genre) => {
  try {
    const books = await db.all("SELECT * FROM books WHERE genre = ?", genre);
    if (books.length === 0) {
      throw new Error("No books found for the specified genre");
    }
    return books;
  } catch (err) {
    console.error("Error fetching books by genre:", err.message);
    throw err;
  }
};
app.get("/books/genre/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    const books = await getAllBooksByGenre(genre);
    res.status(200).json({ books });
  } catch (err) {
    if (err.message === "No books found for the specified genre") {
      res.status(404).json({ error: "No books found for the specified genre" });
    } else {
      res.status(500).json({ error: "Failed to fetch books by genre" });
    }
  }
});

const getAllBooksByPublicationYear = async (year) => {
  try {
    const books = await db.all(
      "SELECT * FROM books WHERE publication_year = ?",
      year,
    );
    if (books.length === 0) {
      throw new Error("No books found for the specified publication year");
    }
    return books;
  } catch (err) {
    console.error("Error fetching books by publication year:", err.message);
    throw err;
  }
};
app.get("/books/publication_year/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const books = await getAllBooksByPublicationYear(parseInt(year, 10));
    res.status(200).json({ books });
  } catch (err) {
    if (err.message === "No books found for the specified publication year") {
      res
        .status(404)
        .json({ error: "No books found for the specified publication year" });
    } else {
      res
        .status(500)
        .json({ error: "Failed to fetch books by publication year" });
    }
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
