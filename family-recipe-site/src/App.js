import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { RecipeView } from "./pages/RecipeView";
import { ThisWeek } from "./pages/ThisWeek";
import { ShoppingList } from "./pages/ShoppingList";
import { Nav } from "./components/Nav";
import { AddRecipe } from "./pages/AddRecipe";

function App() {
  return (
    <Router>
      <Nav /> {/* ← add this */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/this-week" element={<ThisWeek />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>
    </Router>
  );
}

export default App;
