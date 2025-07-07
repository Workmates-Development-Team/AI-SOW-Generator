import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GeneratePPTPage from "./pages/GenerateSOWPage";
import SOWViewer from "./pages/SOWViewer";
import SOWList from "./pages/SOWList";
import Logo from "./components/Logo";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from 'react';
import { api } from "./lib/api";

function AuthenticatedRoutes() {
  const [user, setUser] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.auth.getIdentity(token);
          setUser(response);
        } catch (error) {
          console.error("Failed to validate token:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    validateUser();

    const handleStorageChange = () => {
      validateUser();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return <div>Loading user data...</div>; // Or a loading spinner
  }

  return user ? (
    <Logo>
      <Routes>
        <Route path="/" element={<GeneratePPTPage />} />
        <Route path="/presentation" element={<SOWViewer />} />
        <Route path="/sow-list" element={<SOWList />} />
      </Routes>
    </Logo>
  ) : (
    <Navigate to="/login" />
  );
}

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Logo><LoginPage /></Logo>} />
        <Route path="/*" element={<AuthenticatedRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
