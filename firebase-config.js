import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-check.js";
const firebaseConfig = {
  apiKey: "AIzaSyCwYZIxj_XkoeXh8LWfBtQQjKavKSsy0I4",
  authDomain: "nurjahan-afa41.firebaseapp.com",
  projectId: "nurjahan-afa41",
  storageBucket: "nurjahan-afa41.firebasestorage.app",
  messagingSenderId: "1092980083912",
  appId: "1:1092980083912:web:63274974603464bb78a9fd",
  measurementId: "G-ZZ6MLRZ0H5"
};
const app = initializeApp(firebaseConfig);
const APP_CHECK_SITE_KEY = "REPLACE_WITH_NURJAHAN_RECAPTCHA_ENTERPRISE_SITE_KEY";
if (!APP_CHECK_SITE_KEY.startsWith("REPLACE_")) {
  initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(APP_CHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
}
export const db = getFirestore(app);
export { app, firebaseConfig };
