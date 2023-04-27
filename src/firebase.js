import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAyXollF3m3lrtrGcd9hKCUHqAHXFVhzeU",
    authDomain: "chatbridge-f7e2c.firebaseapp.com",
    projectId: "chatbridge-f7e2c",
    storageBucket: "chatbridge-f7e2c.appspot.com",
    messagingSenderId: "430576887564",
    appId: "1:430576887564:web:1cdfc8917bbacb86ff8b29"
};
// Initialize Firebase
var app = initializeApp(firebaseConfig);

const auth = getAuth();
let db = getFirestore();
let storage = getStorage();

export { auth, db, storage, app };
