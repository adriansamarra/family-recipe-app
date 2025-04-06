import React from "react";
import recipes from "../data/recipes.json";
import { getThisWeek } from "../utils/weeklyPlanner";
import { Link } from "react-router-dom";

export function ThisWeek() {
  const selected = getThisWeek();
  const selectedRecipes = recipes.filter((r) => selected.includes(r.id));

  if (selectedRecipes.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>This Week's Menu</h2>
        <p>No recipes selected yet.</p>
        <Link to="/">← Back to recipes</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>This Week's Menu</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {selectedRecipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: "1rem" }}>
            <Link to={`/recipe/${recipe.id}`}>
              <strong>{recipe.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/">← Back to recipes</Link>
    </div>
  );
}
