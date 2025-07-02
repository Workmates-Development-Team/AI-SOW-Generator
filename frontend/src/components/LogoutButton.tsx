import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const logout = useMutation(api.auth.logout);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('convex_token_identifier');
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white border-0 px-6 py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      size="lg"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton; 