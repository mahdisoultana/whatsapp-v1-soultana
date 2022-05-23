import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDDG9Nf2nHPAo0YrWK7aM4TMJhqt42hWw",
  authDomain: "whatsapp-clone-b9421.firebaseapp.com",
  projectId: "whatsapp-clone-b9421",
  storageBucket: "whatsapp-clone-b9421.appspot.com",
  messagingSenderId: "886188020304",
  appId: "1:886188020304:web:abab3e2d675df855bb7755",
  measurementId: "G-VVBH3WB22E",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage().ref("images");
const audioStorage = firebase.storage().ref("audios");
const createTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;

export {
  db,
  auth,
  provider,
  storage,
  audioStorage,
  createTimestamp,
  serverTimestamp,
};
