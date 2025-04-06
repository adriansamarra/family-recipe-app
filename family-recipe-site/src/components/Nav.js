import React from "react";
import { Link } from "react-router-dom";

export function Nav() {
  return (
    <nav style={{ padding: "1rem", background: "#eee", marginBottom: "2rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      <Link to="/this-week" style={{ marginRight: "1rem" }}>This Week</Link>
      <Link to="/shopping-list"style={{ marginRight: "1rem" }}>Shopping List</Link>
      <Link to="/add-recipe" style={{ marginRight: "1rem" }}>Add Recipe</Link>
    </nav>
  );
}
