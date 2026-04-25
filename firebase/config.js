
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDXQu_CjmdCDaGa5Mdd1o3txbTHrT5g5oU",
  authDomain: "carpak-af4d5.firebaseapp.com",
  projectId: "carpak-af4d5",
  storageBucket: "carpak-af4d5.firebasestorage.app",
  messagingSenderId: "187688067015",
  appId: "1:187688067015:web:d3206d93b71c8a368f03e2",
  measurementId: "G-7BNC43J935"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
