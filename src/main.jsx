import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { KustomerProvider } from "./context/KustomerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <KustomerProvider>
    <App />
  </KustomerProvider>
);
