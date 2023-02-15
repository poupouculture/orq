import { getAuth, signInWithCustomToken } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  doc,
  getDocs,
  onSnapshot,
  collection,
  initializeFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
const auth = getAuth(app);

export {
  auth,
  app,
  db,
  doc,
  getDocs,
  onSnapshot,
  collection,
  getAuth,
  signInWithCustomToken,
};
