import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./css/style.css";
createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
