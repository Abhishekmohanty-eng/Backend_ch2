const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "books_database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.1 HW1 Template" });
});
/**
Exercise 1: Fetch All Books

Create an endpoint /books return all the books

Create a function fetchAllBooks to fetch all the books from the database.

API Call:

http://localhost:3000/books

Expected Output:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 2,
      'title': '1984',
      'author': 'George Orwell',
      'genre': 'Dystopian',
      'publication_year': 1949
    }
    ...
  ]
}
*/
// YOUR ENDPOINTS GO HERE
// Define fetchAllBooks function
async function fetchAllBooks() {
  try {
    const books = await db.all("SELECT * FROM books");
    console.log(books)
    return books;
  } catch (err) {
    console.error("Error fetching books:", err.message);
    throw err;
  }
}

// Define /books endpoint
app.get("/books", async (req, res) => {
  try {
    const books = await fetchAllBooks();
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});


/**
Exercise 2: Fetch Books by Author

Create an endpoint /books/author/:author return all the books by a specific author.

Create a function fetchBooksByAuthor to fetch all the books by an author from the database.

API Call:

http://localhost:3000/books/author/George%20Orwell

Expected Output:

{
  'books': [
    {
      'id': 2,
      'title': '1984',
      'author': 'George Orwell',
      'genre': 'Dystopian',
      'publication_year': 1949
    },
    {
      'id': 3,
      'title': 'Animal Farm',
      'author': 'George Orwell',
      'genre': 'Political Satire',
      'publication_year': 1945
    }
  ]
}
*/

// Function to fetch books by a specific author
async function fetchBooksByAuthor(author) {
  try {
    const books = await db.all("SELECT * FROM books WHERE author = ?", author);
    return books;
  } catch (err) {
    console.error("Error fetching books by author:", err.message);
    throw err;
  }
}

// Define /books/author/:author endpoint
app.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const books = await fetchBooksByAuthor(author);
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books by author." });
  }
});
/**
Exercise 3: Fetch Books by Genre

Create an endpoint /books/genre/:genre

Create a function fetchBooksByGenre to fetch all the books based on specific genre.

API Call:

http://localhost:3000/books/genre/Fiction

Expected Output:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 4,
      'title': 'Pride and Prejudice',
      'author': 'Jane Austen',
      'genre': 'Fiction',
      'publication_year': 1813
    }
  ]
}


*/

// Function to fetch books by a specific genre

async function fetchBooksByGenre(genre){
  try {
    const books = await db.all("SELECT * FROM books WHERE genre = ?", genre);
    return books;
  } catch (err) {
    console.error("Error fetching books by genre:", err.message);
    throw err;
  }
}
app.get("/books/genre/:genre", async (req, res) =>{
  const genre = req.params.genre;
  try {
    const books = await fetchBooksByGenre(genre);
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books by genre." });
  }
})

/**
Exercise 4: Fetch Books by Publication Year

Create an endpoint /books/publication_year/:year return all the books

Create a function fetchBooksByPublicationYear to fetch all the books in a specific year.

API Call:

http://localhost:3000/books/publication_year/1960

Expected Output:

 {
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 5,
      'title': 'Green Eggs and Ham',
      'author': 'Dr. Seuss',
      'genre': 'Children's literature',
      'publication_year': 1960
    }
  ]
}
*/

// Function to fetch books by a specific publication year

async function fetchBooksByPublicationYear(year){
  try {
    const books = await db.all("SELECT * FROM books WHERE publication_year = ?", year);
    return books;
  } catch (err) {
    console.error("Error fetching books by publication year:", err.message);
    throw err;
  }
}

// Define /books/publication_year/:year endpoint

app.get("/books/publication_year/:year", async (req, res) => {
  const year = req.params.year;
  try {
    const books = await fetchBooksByPublicationYear(year);
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books by publication year." });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
