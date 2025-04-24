import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  getUsers: () => User[];
  getUserDetails: (userId: string) => UserDetails | null;
  saveUserCardInformation: (cardInfo: CardInformation) => void;
}

interface UserDetails extends User {
  createdAt: string;
  lastLogin: string;
  orderCount: number;
  password?: string;
  cardInformation?: CardInformation;
}

interface CardInformation {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
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
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          orderCount: 0,
          cardInformation: {
            cardNumber: "4111 1111 1111 1111",
            cardHolder: "Admin User",
            expiryDate: "12/25",
            cvv: "123"
          }
        },
        {
          id: REGULAR_USER.id,
          email: USER_EMAIL,
          password: USER_PASSWORD,
          name: REGULAR_USER.name,
          isAdmin: REGULAR_USER.isAdmin,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          orderCount: 0,
          cardInformation: {
            cardNumber: "5555 4444 3333 2222",
            cardHolder: "Regular User",
            expiryDate: "10/24",
            cvv: "456"
          }
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
      
      // Update last login for admin
      updateUserLastLogin(ADMIN_USER.id);
      
      setIsLoading(false);
      return;
    } else if (email === USER_EMAIL && password === USER_PASSWORD) {
      setUser(REGULAR_USER);
      localStorage.setItem("user", JSON.stringify(REGULAR_USER));
      
      // Update last login for regular user
      updateUserLastLogin(REGULAR_USER.id);
      
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
      
      // Update last login
      updateUserLastLogin(foundUser.id);
    } else {
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const updateUserLastLogin = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.id === userId) {
        return { ...u, lastLogin: new Date().toISOString() };
      }
      return u;
    });
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
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
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      orderCount: 0
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

  const getUsers = (): User[] => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    return registeredUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      isAdmin: u.isAdmin || false
    }));
  };

  const getUserDetails = (userId: string): UserDetails | null => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = registeredUsers.find((u: any) => u.id === userId);
    
    if (!user) return null;
    
    // Get order count from localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = orders.filter((order: any) => 
      order.customerEmail === user.email
    );
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: user.lastLogin || new Date().toISOString(),
      orderCount: userOrders.length,
      password: user.password,
      cardInformation: user.cardInformation || {}
    };
  };

  const saveUserCardInformation = (cardInfo: CardInformation) => {
    if (!user) return;
    
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          cardInformation: cardInfo
        };
      }
      return u;
    });
    
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
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
        getUsers,
        getUserDetails,
        saveUserCardInformation
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
