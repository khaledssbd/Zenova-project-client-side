import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SA_APIKEY,
  authDomain: import.meta.env.VITE_SA_AUTHDOMAIN,
  projectId: import.meta.env.VITE_SA_PROJECTID,
  storageBucket: import.meta.env.VITE_SA_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_SA_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_SA_APPID,
};

const app = initializeApp(firebaseConfig);
export default app;