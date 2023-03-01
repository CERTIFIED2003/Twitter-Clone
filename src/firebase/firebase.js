import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_SENDER,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// export default app;
export { app, database, auth, storage };