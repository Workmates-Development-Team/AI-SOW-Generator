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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 p-10 rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md">
          <span className="animate-spin text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mx-auto">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M22 12a10 10 0 0 1-10 10" />
            </svg>
          </span>
          <span className="text-white text-lg font-medium tracking-wide">Loading user data</span>
        </div>
      </div>
    );
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
