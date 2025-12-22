import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userInfoString = sessionStorage.getItem('userInfo');
      // If userInfoString is "undefined" (the string), null, or empty, treat as null
      if (!userInfoString || userInfoString === 'undefined' || userInfoString === 'null') {
        return null;
      }
      return JSON.parse(userInfoString);
    } catch (error) {
      console.error("Failed to parse userInfo from sessionStorage", error);
      return null;
    }
  });
  const navigate = useNavigate();

  // Wrapper function to update currentUser state and sessionStorage
  const updateCurrentUser = (userData) => {
    console.log('Updating currentUser with:', userData);
    setCurrentUser(userData);
    if (userData === undefined || userData === null) {
      sessionStorage.setItem('userInfo', 'null');
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(userData));
    }
  };

  const login = (newToken, userInfo) => {
    setToken(newToken);
    setCurrentUser(userInfo);
    sessionStorage.setItem('token', newToken);
    if (userInfo === undefined || userInfo === null) {
      sessionStorage.setItem('userInfo', 'null');
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    sessionStorage.removeItem('token'); // Explicitly remove from sessionStorage
    sessionStorage.removeItem('userInfo'); // Explicitly remove from sessionStorage
    navigate('/login');
  };

  const value = {
    token,
    currentUser,
    updateCurrentUser, // Expose the new wrapper function
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
