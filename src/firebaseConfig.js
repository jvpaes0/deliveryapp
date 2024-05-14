import { initializeApp, getApps } from "@react-native-firebase/app";
import database from "@react-native-firebase/database";

if (!getApps().length) {
  const firebaseConfig = {
    apiKey: "AIzaSyBNqcegCUCBk2wN_ZLxddA_2lF-sTLUiOc",
    authDomain: "delivery-app-7a338.firebaseapp.com",
    databaseURL: "https://delivery-app-7a338-default-rtdb.firebaseio.com",
    projectId: "delivery-app-7a338",
    storageBucket: "delivery-app-7a338.appspot.com",
    messagingSenderId: "614536383323",
    appId: "1:614536383323:web:c0c68851275b54dfc3e87e",
    measurementId: "G-T6HNXH5GZ6"
  };

  const app = initializeApp(firebaseConfig);
}

export { database };
