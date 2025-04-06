import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { generateShoppingList } from "../utils/shoppingList";
import { Link } from "react-router-dom";

export function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchList = async () => {
    try {
      const ref = doc(db, "shoppingLists", "currentWeek");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setItems(snap.data().items || []);
      } else {
        setItems([]);
        console.warn("⚠️ No shopping list found in Firestore.");
      }
    } catch (err) {
      console.error("Failed to fetch shopping list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await generateShoppingList();
      await fetchList(); // reload updated list
    } catch (err) {
      console.error("Failed to regenerate shopping list:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Shopping List</h2>

      <button onClick={handleRefresh} disabled={refreshing} style={{ marginBottom: "1rem" }}>
        {refreshing ? "Refreshing..." : "🔄 Refresh List"}
      </button>

      {loading ? (
        <p>Loading shopping list...</p>
      ) : items.length === 0 ? (
        <>
          <p>No ingredients yet. Add recipes to your week and generate a list.</p>
          <Link to="/">← Back to recipes</Link>
        </>
      ) : (
        <ul>
          {items.map(({ item, unit, quantity }, i) => (
            <li key={`${item}-${unit}-${i}`}>
              {quantity} {unit} {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
