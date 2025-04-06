import React, { useState } from "react";
import { Link } from "react-router-dom";
import baseRecipes from "../data/recipes.json";
import { toggleRecipe, getThisWeek } from "../utils/weeklyPlanner";

// Merge base and saved recipes
const localRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
const recipes = [...baseRecipes, ...localRecipes];

export function Home() {
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🍽️ Samarra Family Recipe Library</h2>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: "1rem" }}>
            <Link to={`/recipe/${recipe.id}`}>
              <strong>{recipe.title}</strong> — {recipe.category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
