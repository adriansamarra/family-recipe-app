import React from "react";
import { generateShoppingList } from "../utils/shoppingList";
import { Link } from "react-router-dom";

export function ShoppingList() {
  const items = generateShoppingList(); // ← fixed: use directly

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Shopping List</h2>
      {items.length === 0 ? (
        <>
          <p>No ingredients yet. Add recipes to your week to generate a list.</p>
          <Link to="/">← Back to recipes</Link>
        </>
      ) : (
        <ul>
          {items.map(({ item, unit, quantity }) => (
            <li key={`${item}-${unit}`}>
              {quantity} {unit} {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
