import firebase from  "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCfyTVq0WdXG9KyVid7nDaR0whzvMSyGKI",
  authDomain: "spatial-encoder-294504.firebaseapp.com",
  projectId: "spatial-encoder-294504",
  storageBucket: "spatial-encoder-294504.appspot.com",
  messagingSenderId: "103815499234",
  appId: "1:103815499234:web:715a7d44f5d3b549957dbb"
};

const app = !firebase.apps.length?firebase.initializeApp(firebaseConfig):firebase.app();

const db = app.firestore();

export {db};
