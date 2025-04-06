import { db } from "../firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";

const COLLECTION_NAME = "thisWeek";
const DOC_ID = "currentWeek";

export async function getThisWeek() {
  const ref = doc(db, COLLECTION_NAME, DOC_ID);
  const snap = await getDoc(ref);
  const data = snap.data();
  return data?.ids || [];
}

export async function toggleRecipe(id) {
  const current = await getThisWeek();
  const updated = current.includes(id)
    ? current.filter((rid) => rid !== id)
    : [...current, id];

  const ref = doc(db, COLLECTION_NAME, DOC_ID);
  await setDoc(ref, { ids: updated });
}