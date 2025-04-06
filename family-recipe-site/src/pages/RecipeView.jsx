import React from "react";
import { useParams, Link } from "react-router-dom";
import baseRecipes from "../data/recipes.json";

export function RecipeView() {
  const { id } = useParams();
  const localRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  const allRecipes = [...baseRecipes, ...localRecipes];

  const recipe = allRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Recipe not found</h2>
        <Link to="/">← Back to recipes</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ maxWidth: "100%", borderRadius: "1rem", marginBottom: "1rem" }}
        />
      )}
      <h2>{recipe.title}</h2>
      <h4>Category: {recipe.category}</h4>

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</p>

      <br />
      <Link to="/">← Back to recipes</Link>
    </div>
  );
}
