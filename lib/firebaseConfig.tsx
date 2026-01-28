// src/lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA8bLTRK7Csl4WJ1XnL5KDV9MXRPj_saJ4",
  authDomain: "mystictarot-750bf.firebaseapp.com",
  projectId: "mystictarot-750bf",
  storageBucket: "mystictarot-750bf.firebasestorage.app",
  messagingSenderId: "43040274099",
  appId: "1:43040274099:web:38f8e0896e4bdb2b34a2c6",
  measurementId: "G-X8BBC8L8KX"
};


const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;