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

app.get('/', (req, res) => {
  res.send("I am on BD4.3 - HW1");
});
// Function to fetch employees by gender
const filterByGender = async (gender) => {
  try {
    const employees = await db.all("SELECT * FROM employees WHERE gender = ?", gender);
    return employees;
  } catch (error) {
    console.error("Error fetching employees by gender:", error.message);
    throw error;
  }
};

// Endpoint to fetch employees by gender
app.get("/employees/gender/:gender", async (req, res) => {
  try {
    const gender = req.params.gender;
    const employees = await filterByGender(gender);
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found for this gender" });
    }
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch employees by department
const filterByDepartment = async (department) => {
  try {
    const employees = await db.all("SELECT * FROM employees WHERE department = ?", department);
    return employees;
  } catch (error) {
    console.error("Error fetching employees by department:", error.message);
    throw error;
  }
};

// Endpoint to fetch employees by department
app.get("/employees/department/:department", async (req, res) => {
  try {
    const department = req.params.department;
    const employees = await filterByDepartment(department);
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found for this department" });
    }
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Function to fetch employees by job title
const filterByJobTitle = async (job_title) => {
  try {
    const employees = await db.all("SELECT * FROM employees WHERE job_title = ?", job_title);
    return employees;
  } catch (error) {
    console.error("Error fetching employees by job title:", error.message);
    throw error;
  }
};

// Endpoint to fetch employees by job title
app.get("/employees/job_title/:job_title", async (req, res) => {
  try {
    const job_title = req.params.job_title;
    const employees = await filterByJobTitle(job_title);
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found for this job title" });
    }
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Function to fetch employees by location
const filterByLocation = async (location) => {
  try {
    const employees = await db.all("SELECT * FROM employees WHERE location = ?", location);
    return employees;
  } catch (error) {
    console.error("Error fetching employees by location:", error.message);
    throw error;
  }
};

// Endpoint to fetch employees by location
app.get("/employees/location/:location", async (req, res) => {
  try {
    const location = req.params.location;
    const employees = await filterByLocation(location);
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found for this location" });
    }
    res.status(200).json({ employees });
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
