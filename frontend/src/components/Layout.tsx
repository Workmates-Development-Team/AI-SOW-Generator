import React from "react";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <Link to="/" className="fixed top-4 left-4 z-50 flex items-center">
        <img
          src="/workmates_logo.png"
          alt="Workmates Logo"
          className="h-16 w-auto drop-shadow-lg rounded-xl shadow-md"
          style={{ maxWidth: 240 }}
        />
      </Link>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Layout; 