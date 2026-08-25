import React, { createContext, useState, useContext, useEffect } from 'react';
import { localDb } from '@/lib/localDb';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: any;
  authChecked: boolean;
  appPublicSettings: any;
  navigateToLogin: () => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authError: null,
  authChecked: true,
  appPublicSettings: {},
  navigateToLogin: () => {},
  refreshUser: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const refreshUser = async () => {
    try {
      const me = await localDb.auth.me();
      if (me) {
        setUser(me);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    refreshUser();
    const handleStorage = () => refreshUser();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    localDb.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
  };

  const navigateToLogin = () => {
    localDb.auth.redirectToLogin(window.location.pathname);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        authChecked,
        appPublicSettings: {},
        navigateToLogin,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
