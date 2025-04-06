import { db } from "../firebase";
import { getThisWeek } from "./weeklyPlanner";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

// 🔍 Helper: Extract quantity, unit, and item name
function parseIngredient(ingredient) {
  const fractionMap = {
    "½": 0.5,
    "¼": 0.25,
    "¾": 0.75,
    "⅓": 0.33,
    "⅔": 0.66,
  };

  ingredient = ingredient.replace(/\s+/g, " ").trim();
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
  item = item.replace(/([a-z])\s([a-z])/gi, "$1$2");

  if (fractionMap[rawQty]) {
    rawQty = fractionMap[rawQty];
  } else if (rawQty.includes("/")) {
    const [num, denom] = rawQty.split("/").map(Number);
    rawQty = denom ? num / denom : 1;
  } else {
    rawQty = parseFloat(rawQty);
  }

  return {
    quantity: isNaN(rawQty) ? 1 : rawQty,
    unit: unit.toLowerCase(),
    item,
  };
}

// ✅ Main function: build list and save to Firestore
export async function generateShoppingList() {
  const selectedIds = await getThisWeek();

  // Fetch all recipes from Firestore
  const snapshot = await getDocs(collection(db, "recipes"));
  const allRecipes = snapshot.docs.map((doc) => ({
    ...doc.data(),
    firestoreId: doc.id,
  }));

  const selectedRecipes = allRecipes.filter((r) =>
    selectedIds.includes(r.firestoreId)
  );

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

  const finalList = Object.entries(list).map(([key, qty]) => {
    const [item, unit] = key.split("__");
    return {
      item,
      unit,
      quantity: parseFloat(qty.toFixed(2)),
    };
  });

  // 📝 Save to Firestore
  await setDoc(doc(db, "shoppingLists", "currentWeek"), {
    items: finalList,
    updatedAt: new Date(),
  });

  return finalList;
}
