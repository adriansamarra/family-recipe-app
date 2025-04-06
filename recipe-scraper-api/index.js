const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5001;

// 🛠 Replace this with your actual Spoonacular API key
const SPOONACULAR_API_KEY = "5d5f1e533c0a4c2a8a5ce399cc75e94f";

app.use(cors());

app.get("/api/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing recipe URL." });
  }

  try {
    const response = await axios.get("https://api.spoonacular.com/recipes/extract", {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        url: url
      }
    });

    const recipe = response.data;

    const formatted = {
      id: `local-${Date.now()}`,
      title: recipe.title || "Untitled Recipe",
      category: "Imported",
      ingredients: recipe.extendedIngredients?.map((i) => i.original) || [],
      instructions: recipe.instructions || "",
      tags: ["new"]
    };

    res.json(formatted);
  } catch (err) {
    console.error("❌ Failed to scrape:", err.message);
    res.status(500).json({ error: "Failed to fetch recipe data." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Spoonacular Scraper API running on http://localhost:${PORT}`);
});
