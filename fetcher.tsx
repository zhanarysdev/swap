import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export const fetcher = async (collection_name: string) => {
  const colRef = collection(db, collection_name);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
