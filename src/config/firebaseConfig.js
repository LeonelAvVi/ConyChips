import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHnr1K0DKaHLYHsGeXA6v3nIkUn4IPmog",
  authDomain: "conychips-564c9.firebaseapp.com",
  projectId: "conychips-564c9",
  storageBucket: "conychips-564c9.appspot.com",
  messagingSenderId: "79572394882",
  appId: "1:79572394882:web:7c0fa64e9cd1e2d1a5a59b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

