const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

app.use(cors());


const initializeDb = async () => {
  try {
    db = await open({
      filename: "./database.sqlite", // 
      driver: sqlite3.Database,
    });
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error("Error connecting to the SQLite database:", error);
    throw new Error("Database connection failed");
  }
};

//  employees by minimum salary
const filterEmployeesBySalary = async (minSalary) => {
  try {
    const employees = await db.all(
      "SELECT * FROM employees WHERE salary >= ?",
      [minSalary]
    );
    return employees;
  } catch (err) {
    console.error("Error fetching employees by salary:", err.message);
    throw new Error("Failed to fetch employees by salary.");
  }
};

// Endpoint
app.get("/employees/salary", async (req, res) => {
  const minSalary = parseInt(req.query.minSalary, 10);

  if (isNaN(minSalary)) {
    return res.status(400).json({ error: "Valid minimum salary is required." });
  }

  try {
    const employees = await filterEmployeesBySalary(minSalary);
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found with the given salary." });
    }
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// filter employees by department and minimum experience
const filterEmployeesByDepartmentAndExperience = async (department, minExperience) => {
  try {
    const employees = await db.all(
      "SELECT * FROM employees WHERE department = ? AND years_of_experience >= ?",
      [department, minExperience]
    );
    return employees;
  } catch (err) {
    console.error("Error fetching employees by department and experience:", err.message);
    throw new Error("Failed to fetch employees by department and experience.");
  }
};

// Endpoint
app.get("/employees/department-experience", async (req, res) => {
  const department = req.query.department;
  const minExperience = parseInt(req.query.minExperience, 10);

  if (!department || isNaN(minExperience)) {
    return res.status(400).json({ error: "Department and valid minimum experience are required." });
  }

  try {
    const employees = await filterEmployeesByDepartmentAndExperience(department, minExperience);
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found for the given department and experience." });
    }
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch employees ordered by salary
const fetchEmployeesOrderedBySalary = async () => {
  try {
    const employees = await db.all("SELECT * FROM employees ORDER BY salary DESC");
    return employees;
  } catch (err) {
    console.error("Error fetching employees ordered by salary:", err.message);
    throw new Error("Failed to fetch employees ordered by salary.");
  }
};

// Endpoint
app.get("/employees/ordered-by-salary", async (req, res) => {
  try {
    const employees = await fetchEmployeesOrderedBySalary();
    if (employees.length === 0) {
      return res.status(404).json({ error: "No employees found." });
    }
    res.json({ employees });
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
