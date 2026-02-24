// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { I18nextProvider } from "react-i18next";
// import i18n from "./i18n";

// ReactDOM.createRoot(document.getElementById("root")).render(
//     <I18nextProvider i18n={i18n}>
//         <App />
//     </I18nextProvider>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css"; // Import Horizon theme
import "./i18n"; // ✅ IMPORTANT
import { ThemeProvider } from "./context/ThemeContext";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // The service worker will be automatically registered by vite-plugin-pwa
    // This is just to handle the registration events
    navigator.serviceWorker.ready.then((registration) => {
      console.log('✅ Service Worker registered and ready');
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
