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
    db = await open({ filename: "courses.sqlite", driver: sqlite3.Database });
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error("Error connecting to the SQLite database:", error);
    throw new Error("Database connection failed");
  }
};
async function fetchAllCourses() {
  try {
    let query = "SELECT id, title, release_year FROM courses";
    let response = await db.all(query);
    return { courses: response };
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err;
  }
}
app.get("/courses", async (req, res) => {
  try {
    const courses = await fetchAllCourses();
    if (courses.courses.length === 0) {
      return res.status(404).json({ error: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error handling /courses request:", err);
    res.status(500).json({ error: err.message });
  }
});
async function fetchCoursesByInstructor(instructor) {
  try {
    let query = "SELECT id, title, instructor, category FROM courses WHERE instructor = ?";
    let response = await db.all(query, [instructor]);
    return { courses: response };
  } catch (err) {
    console.error("Error fetching courses by instructor:", err);
    throw err;
  }
}
app.get("/courses/instructor/:instructor", async (req, res) => {
  try {
    const instructor = req.params.instructor;
    const courses = await fetchCoursesByInstructor(instructor);
    if (courses.courses.length === 0) {
      return res.status(404).json({ error: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error handling /courses/instructor/:instructor request:", err);
    res.status(500).json({ error: err.message });
  }
});
async function fetchCoursesByCategory(category) {
  try {
    let query = "SELECT id, title, release_year, category FROM courses WHERE category = ?";
    let response = await db.all(query, [category]);
    return { courses: response };
  } catch (err) {
    console.error("Error fetching courses by category:", err);
    throw err;
  }
}
app.get("/courses/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const courses = await fetchCoursesByCategory(category);
    if (courses.courses.length === 0) {
      return res.status(404).json({ error: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error handling /courses/category/:category request:", err);
    res.status(500).json({ error: err.message });
  }
});
async function fetchCoursesByYear(year) {
  try {
    let query = "SELECT id, title, release_year, category FROM courses WHERE release_year = ?";
    let response = await db.all(query, [year]);
    return { courses: response };
  } catch (err) {
    console.error("Error fetching courses by year:", err);
    throw err;
  }
}
app.get("/courses/year/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const courses = await fetchCoursesByYear(year);
    if (courses.courses.length === 0) {
      return res.status(404).json({ error: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error handling /courses/year/:year request:", err);
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
