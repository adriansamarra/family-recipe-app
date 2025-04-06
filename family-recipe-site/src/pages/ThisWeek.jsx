import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getThisWeek } from "../utils/weeklyPlanner";
import { Link } from "react-router-dom";

export function ThisWeek() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeek = async () => {
      const weekIds = await getThisWeek();
      const snapshot = await getDocs(collection(db, "recipes"));
      const all = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const weekRecipes = all.filter((r) => weekIds.includes(r.id));
      setRecipes(weekRecipes);
      setLoading(false);
    };

    fetchWeek();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>This Week's Menu</h2>
      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes selected for this week.</p>
      ) : (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <Link to={`/recipe/${r.id}`}>{r.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
