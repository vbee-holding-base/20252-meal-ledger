/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosClient, { setAccessToken } from "../api/axiosClient";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: (_token: string) => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Attempt silent refresh on initial load
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await axiosClient.post("/auth/refresh");
        setAccessToken(response.data.access_token);
        setIsAuthenticated(true);
      } catch (error) {
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();
  }, []);

  const login = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
