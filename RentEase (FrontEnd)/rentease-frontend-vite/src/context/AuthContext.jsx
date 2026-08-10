import React, { createContext, useContext, useState } from 'react';
import { saveAuth, clearAuth, getToken, getRole, getId, getName } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: getToken(),
    role:  getRole(),
    id:    getId(),
    name:  getName(),
  });

  const login = (token, role, id, name) => {
    saveAuth(token, role, id, name);
    setUser({ token, role, id: String(id), name });
  };

  const logout = () => {
    clearAuth();
    setUser({ token: null, role: null, id: null, name: null });
  };

  const isLoggedIn = () => !!user.token;
  const isOwner    = () => user.role === 'OWNER';
  const isRenter   = () => user.role === 'RENTER';
  const isAdmin    = () => user.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isOwner, isRenter, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
