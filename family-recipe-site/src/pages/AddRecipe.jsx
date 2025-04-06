import React, { useState } from "react";

export function AddRecipe() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  // 🌐 Replace this with your actual Render backend URL:
  const SCRAPER_API = "https://family-recipe-app.onrender.com";

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const response = await fetch(`${SCRAPER_API}/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error);
      setRecipe(data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch recipe. Check the URL or try again.");
    }

    setLoading(false);
  };

  const handleSave = () => {
    const stored = JSON.parse(localStorage.getItem("recipes")) || [];

    const recipeToSave = {
      ...recipe,
      id: recipe.id || `local-${Date.now()}`
    };

    localStorage.setItem("recipes", JSON.stringify([...stored, recipeToSave]));
    alert("✅ Recipe saved to library!");
    setUrl("");
    setRecipe(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Recipe from URL</h2>

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

      {recipe && (
        <>
          <h3>Preview & Edit</h3>

          <label>Title:</label>
          <input
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
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
        </>
      )}
    </div>
  );
}
