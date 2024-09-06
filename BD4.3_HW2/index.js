const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3020;
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
app.get('/',(req,res)=>{
  res.send("i am on BD4.3 - hw2")
})
  // Function to fetch recipes by cuisine
  const filterByCuisine = async (cuisine) => {
    try {
      const recipes = await db.all("SELECT * FROM recipes WHERE cuisine = ?", cuisine);
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes by cuisine:", error.message);
      throw error;
    }
  };

  // Endpoint to fetch recipes by cuisine
  app.get('/recipes/cuisine/:cuisine', async (req, res) => {
    try {
      const cuisine = req.params.cuisine;
      const recipes = await filterByCuisine(cuisine);
      if (recipes.length === 0) {
        return res.status(404).json({ error: "No recipes found for this cuisine" });
      }
      res.status(200).json({ recipes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Function to fetch recipes by main ingredient
  const filterByMainIngredient = async (main_ingredient) => {
    try {
      const recipes = await db.all("SELECT * FROM recipes WHERE main_ingredient = ?", main_ingredient);
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes by main ingredient:", error.message);
      throw error;
    }
  };

  // Endpoint to fetch recipes by main ingredient
  app.get('/recipes/main_ingredient/:main_ingredient', async (req, res) => {
    try {
      const main_ingredient = req.params.main_ingredient;
      const recipes = await filterByMainIngredient(main_ingredient);
      if (recipes.length === 0) {
        return res.status(404).json({ error: "No recipes found for this main ingredient" });
      }
      res.status(200).json({ recipes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Function to fetch recipes by preparation time
  const filterByPreparationTime = async (preparation_time) => {
    try {
      const recipes = await db.all("SELECT * FROM recipes WHERE preparation_time <= ?", preparation_time);
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes by preparation time:", error.message);
      throw error;
    }
  };

  // Endpoint to fetch recipes by preparation time
  app.get('/recipes/preparation_time/:preparation_time', async (req, res) => {
    try {
      const preparation_time = parseInt(req.params.preparation_time);
      const recipes = await filterByPreparationTime(preparation_time);
      if (recipes.length === 0) {
        return res.status(404).json({ error: "No recipes found for this preparation time" });
      }
      res.status(200).json({ recipes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Function to fetch recipes by difficulty
  const filterByDifficulty = async (difficulty) => {
    try {
      const recipes = await db.all("SELECT * FROM recipes WHERE difficulty = ?", difficulty);
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes by difficulty:", error.message);
      throw error;
    }
  };

  // Endpoint to fetch recipes by difficulty
  app.get('/recipes/difficulty/:difficulty', async (req, res) => {
    try {
      const difficulty = req.params.difficulty;
      const recipes = await filterByDifficulty(difficulty);
      if (recipes.length === 0) {
        return res.status(404).json({ error: "No recipes found for this difficulty level" });
      }
      res.status(200).json({ recipes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Function to fetch recipes by vegetarian status
  const filterByVegetarian = async (vegetarian) => {
    try {
      const recipes = await db.all("SELECT * FROM recipes WHERE vegetarian = ?", vegetarian);
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes by vegetarian status:", error.message);
      throw error;
    }
  };

  // Endpoint to fetch recipes by vegetarian status
  app.get('/recipes/vegetarian/:vegetarian', async (req, res) => {
    try {
      const vegetarian = req.params.vegetarian === 'true' ? 'true' : 'false';
      const recipes = await filterByVegetarian(vegetarian);
      if (recipes.length === 0) {
        return res.status(404).json({ error: "No recipes found for this vegetarian status" });
      }
      res.status(200).json({ recipes });
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
