import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { toggleRecipe, getThisWeek } from "../utils/weeklyPlanner";
import { Link } from "react-router-dom";

export function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [thisWeek, setThisWeek] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "recipes"));
        const data = snap.docs.map((doc) => ({
          ...doc.data(),
          firestoreId: doc.id, // preserve Firestore ID separately
        }));
        
        setRecipes(data);

        const weekIds = await getThisWeek();
        setThisWeek(weekIds);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load recipes:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = async (id) => {
    await toggleRecipe(id);
    const updated = await getThisWeek();
    setThisWeek(updated);
  };

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

      {loading ? (
        <p>Loading recipes...</p>
      ) : filtered.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((recipe) => (
  <li key={recipe.firestoreId}>
    <Link to={`/recipe/${recipe.firestoreId}`}>
      <strong>{recipe.title}</strong> — {recipe.category}
    </Link>
    <br />
    <button onClick={() => handleToggle(recipe.firestoreId)}>
      {thisWeek.includes(recipe.firestoreId)
        ? "✅ Remove from This Week"
        : "➕ Add to This Week"}
    </button>
  </li>
))}

        </ul>
      )}
    </div>
  );
}
