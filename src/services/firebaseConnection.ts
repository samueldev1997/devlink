import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDqCRIwH3AWT0PtvKp4wPxLo3aujh_r2YA",
  authDomain: "reactlinks-43a1d.firebaseapp.com",
  projectId: "reactlinks-43a1d",
  storageBucket: "reactlinks-43a1d.appspot.com",
  messagingSenderId: "488946236215",
  appId: "1:488946236215:web:51cae187b9c295946238b2"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }