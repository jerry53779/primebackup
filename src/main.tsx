
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
import { AuthProvider } from "./lib/supabase-auth";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
  