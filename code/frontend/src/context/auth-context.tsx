import React, { createContext, useState, ReactNode } from 'react';
import AuthService from '../services/auth-service';

// Define the AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;  // Return a promise
  logout: () => void;
}

// Create AuthContext with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Update login to use AuthService's login method
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const success = await AuthService.login(username, password); // Call AuthService
      if (success) {
        setIsAuthenticated(true);
      }
      return success;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
