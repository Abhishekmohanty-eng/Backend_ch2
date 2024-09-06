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
      filename: "./courses.sqlite",
      driver: sqlite3.Database,
    });
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error("Error connecting to the SQLite database:", error);
    throw new Error("Database connection failed");
  }
};
// filter courses by rating
const filterCoursesByRating = async (minRating) => {
  try {
    const courses = await db.all("SELECT * FROM courses WHERE rating > ?", [minRating]);
    return courses;
  } catch (err) {
    console.error("Error fetching courses by rating:", err.message);
    throw new Error("Failed to fetch courses by rating.");
  }
};

// Endpoint: /courses/rating
app.get("/courses/rating", async (req, res) => {
  const minRating = parseFloat(req.query.minRating);

  if (isNaN(minRating)) {
    return res.status(400).json({ error: "Valid minimum rating is required." });
  }

  try {
    const courses = await filterCoursesByRating(minRating);
    if (courses.length === 0) {
      return res.status(404).json({ error: "No courses found with the given rating." });
    }
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// filter courses by instructor and minimum duration
const filterCoursesByInstructorAndDuration = async (instructor, minDuration) => {
  try {
    const courses = await db.all(
      "SELECT * FROM courses WHERE instructor = ? AND duration > ?",
      [instructor, minDuration]
    );
    return courses;
  } catch (err) {
    console.error("Error fetching courses by instructor and duration:", err.message);
    throw new Error("Failed to fetch courses by instructor and duration.");
  }
};

// Endpoint: /courses/instructor-duration
app.get("/courses/instructor-duration", async (req, res) => {
  const instructor = req.query.instructor;
  const minDuration = parseInt(req.query.minDuration, 10);

  if (!instructor || isNaN(minDuration)) {
    return res.status(400).json({ error: "Instructor and valid minimum duration are required." });
  }

  try {
    const courses = await filterCoursesByInstructorAndDuration(instructor, minDuration);
    if (courses.length === 0) {
      return res.status(404).json({ error: "No courses found for the given instructor and duration." });
    }
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch courses ordered by price
const fetchCoursesOrderedByPrice = async () => {
  try {
    const courses = await db.all("SELECT * FROM courses ORDER BY price DESC");
    return courses;
  } catch (err) {
    console.error("Error fetching courses ordered by price:", err.message);
    throw new Error("Failed to fetch courses ordered by price.");
  }
};

// Endpoint: /courses/ordered-by-price
app.get("/courses/ordered-by-price", async (req, res) => {
  try {
    const courses = await fetchCoursesOrderedByPrice();
    if (courses.length === 0) {
      return res.status(404).json({ error: "No courses found." });
    }
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// St
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
