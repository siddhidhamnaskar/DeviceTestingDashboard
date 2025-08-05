// LocalStorage utility for managing user information

const USER_STORAGE_KEY = 'user';
const AUTH_TOKEN_KEY = 'authToken';
const USER_PREFERENCES_KEY = 'userPreferences';
const SESSION_DATA_KEY = 'sessionData';

// User data management
export const saveUserInfo = (userData) => {
  try {
    if (!userData) {
      throw new Error('User data is required');
    }

    // Validate user data structure
    const requiredFields = ['username', 'email'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Store user data
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    
    // Store additional user info for easy access
    const userInfo = {
      id: userData.id || null,
      username: userData.username,
      email: userData.email,
      name: userData.name || userData.username,
      role: userData.role || 'user',
      provider: userData.provider || 'local',
      lastLogin: new Date().toISOString(),
      isActive: true
    };
    
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    return true;
  } catch (error) {
    console.error('Error saving user info:', error);
    return false;
  }
};

export const getUserInfo = () => {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (!userData) {
      return null;
    }
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting user info:', error);
    // Clear corrupted data
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const updateUserInfo = (updates) => {
  try {
    const currentUser = getUserInfo();
    if (!currentUser) {
      throw new Error('No user data found');
    }

    const updatedUser = { ...currentUser, ...updates };
    return saveUserInfo(updatedUser);
  } catch (error) {
    console.error('Error updating user info:', error);
    return false;
  }
};

// Authentication token management
export const saveAuthToken = (token) => {
  try {
    if (!token) {
      throw new Error('Auth token is required');
    }
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    return false;
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// User preferences management
export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

export const getUserPreferences = () => {
  try {
    const preferences = localStorage.getItem(USER_PREFERENCES_KEY);
    return preferences ? JSON.parse(preferences) : {};
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
};

// Session data management
export const saveSessionData = (data) => {
  try {
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving session data:', error);
    return false;
  }
};

export const getSessionData = () => {
  try {
    const data = localStorage.getItem(SESSION_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session data:', error);
    return null;
  }
};

// Complete user logout
export const clearUserData = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PREFERENCES_KEY);
    localStorage.removeItem(SESSION_DATA_KEY);
    localStorage.removeItem('userInfo');
    // Also clear sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};

// Verify that all user data has been cleared
export const verifyUserDataCleared = () => {
  try {
    const remainingKeys = [];
    
    // Check for any remaining user-related data
    const keysToCheck = [
      USER_STORAGE_KEY,
      AUTH_TOKEN_KEY,
      USER_PREFERENCES_KEY,
      SESSION_DATA_KEY,
      'userInfo'
    ];
    
    keysToCheck.forEach(key => {
      if (localStorage.getItem(key)) {
        remainingKeys.push(key);
      }
    });
    
    if (remainingKeys.length > 0) {
      console.warn('Some user data still exists in localStorage:', remainingKeys);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying user data clearance:', error);
    return false;
  }
};

// Force clear all user data (use with caution)
export const forceClearAllUserData = () => {
  try {
    // Clear all known user-related keys
    const keysToClear = [
      USER_STORAGE_KEY,
      AUTH_TOKEN_KEY,
      USER_PREFERENCES_KEY,
      SESSION_DATA_KEY,
      'userInfo'
    ];
    
    keysToClear.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear any other keys that might contain user data
    const allKeys = Object.keys(localStorage);
    const userRelatedKeys = allKeys.filter(key => 
      key.toLowerCase().includes('user') ||
      key.toLowerCase().includes('auth') ||
      key.toLowerCase().includes('session') ||
      key.toLowerCase().includes('token')
    );
    
    userRelatedKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    return verifyUserDataCleared();
  } catch (error) {
    console.error('Error force clearing user data:', error);
    return false;
  }
};

// Check if user is logged in
export const isUserLoggedIn = () => {
  try {
    const userData = getUserInfo();
    const authToken = getAuthToken();
    return !!(userData && authToken);
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Get user display name
export const getUserDisplayName = () => {
  try {
    const userInfo = getUserInfo();
    if (!userInfo) return null;
    
    return userInfo.name || userInfo.username || 'Unknown User';
  } catch (error) {
    console.error('Error getting user display name:', error);
    return 'Unknown User';
  }
};

// Get user email
export const getUserEmail = () => {
  try {
    const userInfo = getUserInfo();
    if (!userInfo) return null;
    
    return userInfo.email || userInfo.username;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

// Get user role
export const getUserRole = () => {
  try {
    const userInfo = getUserInfo();
    if (!userInfo) return null;
    
    return userInfo.role || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

// Check if user has specific role
export const hasUserRole = (requiredRole) => {
  try {
    const userRole = getUserRole();
    return userRole === requiredRole || userRole === 'admin';
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

// Save complete login data
export const saveLoginData = (userData, token) => {
  try {
    const userSaved = saveUserInfo(userData);
    const tokenSaved = saveAuthToken(token);
    
    if (userSaved && tokenSaved) {
      // Save session data
      const sessionData = {
        loginTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        lastActivity: new Date().toISOString()
      };
      saveSessionData(sessionData);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving login data:', error);
    return false;
  }
};

// Update last activity
export const updateLastActivity = () => {
  try {
    const sessionData = getSessionData() || {};
    sessionData.lastActivity = new Date().toISOString();
    saveSessionData(sessionData);
    return true;
  } catch (error) {
    console.error('Error updating last activity:', error);
    return false;
  }
}; 