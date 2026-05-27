import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB3jb4WU93Pqg0WbnIdBUgSstHPkSP5AcU",
  authDomain: "nushelter-7981c.firebaseapp.com",
  projectId: "nushelter-7981c",
  storageBucket: "nushelter-7981c.firebasestorage.app",
  messagingSenderId: "835858050720",
  appId: "1:835858050720:web:d27053360141dc09a723c5",
  measurementId: "G-4WKNF14JG2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);