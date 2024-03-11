// import processEnvVar from "../utils/processEnvVar.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI69mW0StF39zCNGcjDlLnj3tBsss-Amk",
  authDomain: "online-photofolio.firebaseapp.com",
  projectId: "online-photofolio",
  storageBucket: "online-photofolio.appspot.com",
  messagingSenderId: "735893494494",
  appId: "1:735893494494:web:9ef5eedb692582f30b804f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;