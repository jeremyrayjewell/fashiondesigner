// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, 
  signInWithEmailAndPassword,
  signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlQrgx_Jt9utW1XVuM90OuSS6y2YHWWN4",
  authDomain: "saborcaribe-b3d6f.firebaseapp.com",
  projectId: "saborcaribe-b3d6f",
  storageBucket: "saborcaribe-b3d6f.appspot.com",
  messagingSenderId: "536011684254",
  appId: "1:536011684254:web:cbd83b4eda113b81ba7e8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function() {

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")
const appWelcomeEl = document.getElementById("app-welcome")
const logInNotification = document.getElementById("login-notification") 
const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")
const signInButtonEl = document.getElementById("sign-in-btn")
const signOutButtonEl = document.getElementById("sign-out-btn")
const adminFunctionBtnsEl = document.getElementById("admin-function-btns")

const returnButtonEl = document.getElementById("return-btn")
const menuUpdateBtnEl = document.getElementById("menu-update-btn")
const menuAddBtnEl = document.getElementById("menu-add-btn")
const inventoryBtnEl = document.getElementById("inventory-btn")
const financesBtnEl = document.getElementById("finances-btn")
const ordersBtnEl = document.getElementById("orders-btn")

const menuUpdateViewEl = document.getElementById("update-menu-view")
const menuAddViewEl = document.getElementById("add-menu-view")
const inventoryViewEl = document.getElementById("inventory-view")
const financesViewEl = document.getElementById("finances-view")
const ordersViewEl = document.getElementById("orders-view")

/* == UI - Event Listeners == */

signInButtonEl.addEventListener("click", authSignInWithEmail)
signOutButtonEl.addEventListener("click", authSignOut)
returnButtonEl.addEventListener("click", returnButtonClick)

menuUpdateBtnEl.addEventListener("click", showMenuUpdateView)
menuAddBtnEl.addEventListener("click", showMenuAddView)
inventoryBtnEl.addEventListener("click", showInventoryView)
financesBtnEl.addEventListener("click", showFinancesView)
ordersBtnEl.addEventListener("click", showOrdersView)

/* === Main Code === */

showLoggedOutView()

/* = Functions - Firebase - Authentication = */

function authSignInWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      showLoggedInView()
      appWelcomeEl.innerHTML = `Hola ${user.email}!`
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      logInNotification.innerHTML = `<span>Error ${error.code}: incapaz de iniciar sesión.</span> <br> Verifique que su correo electrónico y contraseña sean correctos y pertenezcan a una cuenta existente.`      });
}

function authSignOut() {
  signOut(auth).then(() => {
      showLoggedOutView()
  }).catch((error) => {
      // An error happened.
    });
  }

/* == Functions - UI Functions == */

function showLoggedOutView() {
  hideElement(viewLoggedIn)
  showElement(viewLoggedOut)
}

function showLoggedInView() {
  hideElement(viewLoggedOut)
  showElement(viewLoggedIn)
}

function returnButtonClick() {
  hideElement(menuUpdateViewEl)
  hideElement(menuAddViewEl)
  hideElement(inventoryViewEl)
  hideElement(financesViewEl)
  hideElement(ordersViewEl)
  showElement(adminFunctionBtnsEl)
}

function showMenuUpdateView() {
  hideElement(appWelcomeEl) 
  hideElement(adminFunctionBtnsEl)
  showElement(menuUpdateViewEl)
}

function showMenuAddView() {
  hideElement(appWelcomeEl) 
  hideElement(adminFunctionBtnsEl)
  showElement(menuAddViewEl)
}

function showInventoryView() {
  hideElement(appWelcomeEl)
  hideElement(adminFunctionBtnsEl)
  showElement(inventoryViewEl)
}

function showFinancesView() {
  hideElement(appWelcomeEl)
  hideElement(adminFunctionBtnsEl)
  showElement(financesViewEl)
}

function showOrdersView() {
  hideElement(appWelcomeEl)
  hideElement(adminFunctionBtnsEl)
  showElement(ordersViewEl)
}

function showElement(element) {
  element.style.display = "flex"
}

function hideElement(element) {
  element.style.display = "none"
}

});