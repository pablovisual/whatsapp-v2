import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAi-jFhGSfFI6SK0jdh1fb48TZBcZX9z_U",
  authDomain: "whatsapp-2-97160.firebaseapp.com",
  projectId: "whatsapp-2-97160",
  storageBucket: "whatsapp-2-97160.appspot.com",
  messagingSenderId: "250702077636",
  appId: "1:250702077636:web:c2c51dd58ab572e05e7391"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };