import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "../styles/globals.css";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

//Only for testing, remove from production build
if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
