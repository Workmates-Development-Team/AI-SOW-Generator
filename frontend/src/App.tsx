import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GeneratePPTPage from "./pages/GenerateSOWPage";
import SOWViewer from "./pages/SOWViewer";
import Layout from "./components/Layout";
import { ConvexProvider } from "convex/react";
import { convex } from "./convex/client";
import LoginPage from "./pages/LoginPage";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from 'react';

function AuthenticatedRoutes() {
  const storedTokenIdentifier = localStorage.getItem('convex_token_identifier');
  const user = useQuery(api.auth.getIdentity, { tokenIdentifier: storedTokenIdentifier || undefined });

  console.log("User identity from Convex:", user);

  // This useEffect is a fallback to ensure reactivity, though useQuery should handle it.
  useEffect(() => {
    // Force a re-render or re-evaluation if the token changes in localStorage
    // This is a bit of a hack, but can help with reactivity issues.
    const handleStorageChange = () => {
      // This will cause the useQuery to re-evaluate
      // In a real app, you might use a more sophisticated state management or context
      // to trigger a re-render of components dependent on auth state.
      console.log("localStorage changed, re-evaluating identity...");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (user === undefined) {
    return <div>Loading user data...</div>; // Or a loading spinner
  }

  return user ? (
    <Layout>
      <Routes>
        <Route path="/" element={<GeneratePPTPage isAuthenticated={!!user} />} />
        <Route path="/presentation" element={<SOWViewer />} />
      </Routes>
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
}

export default function App() {
  return(
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/*" element={<AuthenticatedRoutes />} />
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  )
}
