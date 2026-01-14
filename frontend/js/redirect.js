import Store from "./store/store.js";

const { isAuthenticated } = Store.getState();

if (!isAuthenticated) {
  window.location.href = "/authentification/login.html";
}