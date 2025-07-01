import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const logout = useMutation(api.auth.logout);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('convex_token_identifier');
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen w-full">
      <Link to="/" className="fixed top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center p-2 sm:p-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-2 flex items-center">
          <img
            src="/workmates_logo.png"
            alt="Workmates Logo"
            className="h-10 w-auto max-w-xs object-contain transition-all duration-200"
            style={{ maxWidth: 'min(32vw, 240px)' }}
          />
        </div>
      </Link>
      <div className="fixed bottom-4 left-4 z-10">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-2">
          <Button
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-500 hover:from-blue-700 hover:via-blue-800 hover:to-yellow-600 text-white border-0 px-6 py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            size="lg"
          >
            Log Out
          </Button>
        </div>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Layout; 