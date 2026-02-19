import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7qF2sioZz4PweMphH69LySpjrtUwpiws",
  authDomain: "olx-clone-6a062.firebaseapp.com",
  projectId: "olx-clone-6a062",
  storageBucket: "olx-clone-6a062.firebasestorage.app",
  messagingSenderId: "803168479514",
  appId: "1:803168479514:web:fc96bcc28210a48c7c64a3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const fireStore = getFirestore(app);
export const storage = getStorage(app);

export const addProductToFirestore = async (productData) => {
  try {
    const docRef = await addDoc(collection(fireStore, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
    });

    console.log("🔥 Product added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("🔥 Firestore add error:", error);
    throw error;
  }
};

export const fetchFromFirestore = async () => {
  try {
    const snapshot = await getDocs(collection(fireStore, "products"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("🔥 Fetch error:", error);
    return [];
  }
};
