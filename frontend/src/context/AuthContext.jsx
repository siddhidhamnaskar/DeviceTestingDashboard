import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveLoginData, 
  getUserInfo, 
  clearUserData, 
  isUserLoggedIn,
  updateLastActivity 
} from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuthStatus = () => {
      try {
        if (isUserLoggedIn()) {
          const userData = getUserInfo();
          if (userData) {
            setUser(userData);
            // Update last activity
            updateLastActivity();
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        clearUserData();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Set up activity tracking
  useEffect(() => {
    const handleUserActivity = () => {
      if (user) {
        updateLastActivity();
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [user]);

  const login = (userData, token = null) => {
    try {
      // Use the new localStorage utility
      const success = saveLoginData(userData, token || 'demo-token');
      
      if (success) {
        setUser(userData);
        return true;
      } else {
        console.error('Failed to save login data');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      clearUserData();
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const updateUser = (updates) => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...updates };
      const success = saveLoginData(updatedUser, user.accessToken || 'demo-token');
      
      if (success) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 