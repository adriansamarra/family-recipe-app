import recipes from "../data/recipes.json";
import { getThisWeek } from "./weeklyPlanner";

// Helper: Extract quantity, unit, and item name
function parseIngredient(ingredient) {
    const fractionMap = {
      "½": 0.5,
      "¼": 0.25,
      "¾": 0.75,
      "⅓": 0.33,
      "⅔": 0.66,
    };
  
    // Normalize white space
    ingredient = ingredient.replace(/\s+/g, " ").trim();
  
    // Match pattern: quantity [optional unit] item
    const match = ingredient.match(/^([\d¼½¾⅓⅔\.\/]+)\s*(\w+)?\s+(.*)$/);
    if (!match) {
      console.log("❌ No match:", ingredient);
      return {
        quantity: 1,
        unit: "",
        item: ingredient.toLowerCase().trim(),
      };
    }
  
    let rawQty = match[1];
    let unit = match[2] || "";
    let item = match[3].toLowerCase().trim();
  
    // Fix rare broken spacing in item (e.g., 'onio n')
    item = item.replace(/([a-z])\s([a-z])/gi, "$1$2");
  
    // Convert quantity
    if (fractionMap[rawQty]) {
      rawQty = fractionMap[rawQty];
    } else if (rawQty.includes("/")) {
      const [num, denom] = rawQty.split("/").map(Number);
      rawQty = denom ? num / denom : 1;
    } else {
      rawQty = parseFloat(rawQty);
    }
  
    const parsed = {
      quantity: isNaN(rawQty) ? 1 : rawQty,
      unit: unit.toLowerCase(),
      item,
    };
  
    console.log("✅ Parsed:", parsed);
    return parsed;
  }

export function generateShoppingList() {
  const selectedIds = getThisWeek();
  const selectedRecipes = recipes.filter((r) => selectedIds.includes(r.id));

  const list = {};

  for (const recipe of selectedRecipes) {
    for (const raw of recipe.ingredients) {
      const { quantity, unit, item } = parseIngredient(raw);
      const key = `${item}__${unit}`;

      if (!list[key]) {
        list[key] = quantity;
      } else {
        list[key] += quantity;
      }
    }
  }

  return Object.entries(list).map(([key, qty]) => {
    const [item, unit] = key.split("__");
    return {
      item,
      unit,
      quantity: parseFloat(qty.toFixed(2)),
    };
  });
}
