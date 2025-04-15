
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

// Mock user data
const ADMIN_USER = {
  id: "admin1",
  email: "admin@example.com",
  name: "Admin User",
  isAdmin: true,
};

const REGULAR_USER = {
  id: "user1",
  email: "user@example.com",
  name: "Regular User",
  isAdmin: false,
};

// Admin credentials for demo
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// Regular user credentials for demo
const USER_EMAIL = "user@example.com";
const USER_PASSWORD = "user123";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser(ADMIN_USER);
      localStorage.setItem("user", JSON.stringify(ADMIN_USER));
    } else if (email === USER_EMAIL && password === USER_PASSWORD) {
      setUser(REGULAR_USER);
      localStorage.setItem("user", JSON.stringify(REGULAR_USER));
    } else {
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
