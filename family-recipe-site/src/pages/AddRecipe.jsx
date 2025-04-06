import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export function AddRecipe() {
  const [mode, setMode] = useState("url"); // "url" or "manual"
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const SCRAPER_API = "https://family-recipe-app.onrender.com"; // replace with your actual URL

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    setRecipe(null);

    try {
      const response = await fetch(`${SCRAPER_API}/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error);
      setRecipe(data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch recipe. Please check the URL.");
    }

    setLoading(false);
  };

  const handleManualStart = () => {
    setRecipe({
      id: `manual-${Date.now()}`,
      title: "",
      category: "",
      image: "",
      ingredients: [],
      instructions: "",
      tags: ["new"]
    });
    setSuccess(false);
    setError("");
  };

  const handleSave = async () => {
    try {
      const recipeToSave = {
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : recipe.ingredients?.split?.("\n") || [],
        timestamp: new Date()
      };
      

      await addDoc(collection(db, "recipes"), recipeToSave);
      setSuccess(true);
      setRecipe(null);
      setUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe to the cloud.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add a New Recipe</h2>

      {/* Toggle between modes */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          <input
            type="radio"
            value="url"
            checked={mode === "url"}
            onChange={() => setMode("url")}
          />
          &nbsp;From URL
        </label>
        &nbsp;&nbsp;
        <label>
          <input
            type="radio"
            value="manual"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          &nbsp;Manual Entry
        </label>
      </div>

      {/* URL Entry Mode */}
      {mode === "url" && (
        <>
          <input
            type="text"
            placeholder="Paste recipe URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <button onClick={handleFetch} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Recipe"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      {/* Manual Entry Mode */}
      {mode === "manual" && !recipe && (
        <button onClick={handleManualStart}>📝 Start Manual Recipe</button>
      )}

      {/* Recipe Editor Preview */}
      {recipe && (
        <>
          <h3>Preview & Edit</h3>

          <label>Title:</label>
          <input
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Category:</label>
          <input
            value={recipe.category}
            onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Image URL:</label>
          <input
            value={recipe.image}
            onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Ingredients:</label>
          <textarea
            rows={6}
            value={recipe.ingredients.join("\n")}
            onChange={(e) =>
              setRecipe({ ...recipe, ingredients: e.target.value.split("\n") })
            }
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Instructions:</label>
          <textarea
            rows={6}
            value={recipe.instructions}
            onChange={(e) =>
              setRecipe({ ...recipe, instructions: e.target.value })
            }
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <button onClick={handleSave}>✅ Save to Library</button>
          {success && <p style={{ color: "green", marginTop: "1rem" }}>Saved!</p>}
        </>
      )}
    </div>
  );
}
