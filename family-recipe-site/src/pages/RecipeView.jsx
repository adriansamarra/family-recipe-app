import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export function RecipeView() {
  const { id } = useParams(); // Firestore ID
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const ref = doc(db, "recipes", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRecipe(snap.data());
        } else {
          console.warn("Recipe not found");
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSave = async () => {
    if (!recipe) return;

    setSaving(true);
    try {
      const ref = doc(db, "recipes", id);
      await updateDoc(ref, {
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : recipe.ingredients.split("\n"),
      });
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteDoc(doc(db, "recipes", id));
      navigate("/");
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!recipe) return <div style={{ padding: "2rem" }}>Recipe not found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/">← Back to recipes</Link>

      {editing ? (
        <>
          <h2>Edit Recipe</h2>

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
            value={Array.isArray(recipe.ingredients) ? recipe.ingredients.join("\n") : recipe.ingredients}
            onChange={(e) =>
              setRecipe({ ...recipe, ingredients: e.target.value })
            }
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Instructions:</label>
          <textarea
            rows={6}
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <button onClick={handleSave} disabled={saving}>
            💾 {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: "1rem" }}>
            ❌ Cancel
          </button>
        </>
      ) : (
        <>
          <h2>{recipe.title}</h2>
          <p><em>{recipe.category}</em></p>

          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ maxWidth: "100%", marginBottom: "1rem" }}
            />
          )}

          <h4>🧂 Ingredients</h4>
          <ul>
            {recipe.ingredients.map((i, index) => (
              <li key={index}>{i}</li>
            ))}
          </ul>

          <h4>📖 Instructions</h4>
          <p style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</p>

          <button onClick={() => setEditing(true)}>✏️ Edit</button>
          <button
            onClick={handleDelete}
            style={{ marginLeft: "1rem", color: "red" }}
          >
            🗑️ Delete
          </button>
          {success && <p style={{ color: "green", marginTop: "1rem" }}>✅ Changes saved!</p>}
        </>
      )}
    </div>
  );
}
