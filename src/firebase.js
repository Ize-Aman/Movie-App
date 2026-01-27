import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  increment,
  serverTimestamp,
  limit,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --------------------------------------------------
// Function: updateSearchCount (inside firebase.js)
// --------------------------------------------------
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const metricsRef = collection(db, "metrics");

    // 1) Check if searchTerm exists
    const q = query(metricsRef, where("movie_id", "==", movie.id));
    const result = await getDocs(q);

    // 2) If it exists, update the count
    if (!result.empty) {
      const docRef = result.docs[0].ref;

      await setDoc(
        docRef,
        {
          count: increment(1),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      // 3) If it doesn't exist, create a new document
      await setDoc(doc(metricsRef), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "-",
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const metricsRef = collection(db, "metrics");
    const q = query(metricsRef, orderBy("count", "desc"), limit(10));
    const result = await getDocs(q);

    return result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log(error);
  }
};