
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCQi4_fdQ9d0sM1qb7gM8KsM-46M7rdIvw",
  authDomain: "deakin-web-app-8c97f.firebaseapp.com",
  projectId: "deakin-web-app-8c97f",
  storageBucket: "deakin-web-app-8c97f.appspot.com",
  messagingSenderId: "635282906667",
  appId: "1:635282906667:web:e40b712957c9951b71d46e"
};

const app = initializeApp(firebaseConfig); 


const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };
