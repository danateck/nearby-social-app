import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOESDi2WFbBVqwTcLRQAVHGq_meeiq8Ko",
  authDomain: "quickmeet-c7b49.firebaseapp.com",
  projectId: "quickmeet-c7b49",
  storageBucket: "quickmeet-c7b49.firebasestorage.app",
  messagingSenderId: "621273425754",
  appId: "1:621273425754:web:9cff925bdda28c4a433563",
  measurementId: "G-CS788KBXRE"
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);