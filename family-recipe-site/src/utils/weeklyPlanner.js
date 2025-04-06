const STORAGE_KEY = "thisWeekRecipes";

export function getThisWeek() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function setThisWeek(recipeIds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipeIds));
}

export function toggleRecipe(id) {
  const current = getThisWeek();
  if (current.includes(id)) {
    setThisWeek(current.filter((r) => r !== id));
  } else {
    setThisWeek([...current, id]);
  }
}
