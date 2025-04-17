
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
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

  // Initialize registered users in localStorage if none exist
  useEffect(() => {
    if (!localStorage.getItem("registeredUsers")) {
      const initialUsers = [
        {
          id: ADMIN_USER.id,
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: ADMIN_USER.name,
          isAdmin: ADMIN_USER.isAdmin,
        },
        {
          id: REGULAR_USER.id,
          email: USER_EMAIL,
          password: USER_PASSWORD,
          name: REGULAR_USER.name,
          isAdmin: REGULAR_USER.isAdmin,
        },
      ];
      localStorage.setItem("registeredUsers", JSON.stringify(initialUsers));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check demo accounts first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser(ADMIN_USER);
      localStorage.setItem("user", JSON.stringify(ADMIN_USER));
      setIsLoading(false);
      return;
    } else if (email === USER_EMAIL && password === USER_PASSWORD) {
      setUser(REGULAR_USER);
      localStorage.setItem("user", JSON.stringify(REGULAR_USER));
      setIsLoading(false);
      return;
    }
    
    // Check registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const foundUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userObject = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        isAdmin: foundUser.isAdmin || false,
      };
      setUser(userObject);
      localStorage.setItem("user", JSON.stringify(userObject));
    } else {
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const userExists = registeredUsers.some((u: any) => u.email === email);
    
    if (userExists) {
      setIsLoading(false);
      throw new Error("User with this email already exists");
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      isAdmin: false,
    };
    
    // Add user to registered users
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    
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
        register,
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
