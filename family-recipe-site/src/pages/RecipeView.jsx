import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function RecipeView() {
  const { id } = useParams(); // Firestore ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const ref = doc(db, "recipes", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setRecipe(snap.data());
        } else {
          console.error("Recipe not found");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!recipe) return <div style={{ padding: "2rem" }}>Recipe not found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/">← Back to recipes</Link>
      <h2>{recipe.title}</h2>
      <p><em>{recipe.category}</em></p>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ maxWidth: "100%", marginBottom: "1rem" }}
        />
      )}

      <h4>🧂 Ingredients:</h4>
      <ul>
        {recipe.ingredients.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h4>📖 Instructions:</h4>
      <p style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</p>
    </div>
  );
}
