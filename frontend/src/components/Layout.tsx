import React from "react";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <Link to="/" className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 flex items-center p-2 sm:p-4">
        <img
          src="/workmates_logo.png"
          alt="Workmates Logo"
          className="h-10 w-auto max-w-xs object-contain transition-all duration-200"
          style={{ maxWidth: 'min(32vw, 240px)' }}
        />
      </Link>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Layout; 