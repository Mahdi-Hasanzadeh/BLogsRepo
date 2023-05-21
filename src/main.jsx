import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./redux.js";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter } from "react-router-dom";

import Practice from "./Components/Practice.jsx";
import { ToastContainer } from "react-toastify";
// import { store } from "./ReduxPractice.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
