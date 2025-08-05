import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { clearUserData, verifyUserDataCleared, getUserDisplayName } from '../utils/localStorage';

const Header = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      handleClose();
      
      // Get user name before logout for logging
      const userName = getUserDisplayName();
      
      // Clear all localStorage data first
      const localStorageCleared = clearUserData();
      
      if (!localStorageCleared) {
        console.warn('Some localStorage data may not have been cleared properly');
      }
      
      // Verify that all data has been cleared
      const verified = verifyUserDataCleared();
      
      if (!verified) {
        console.warn('User data verification failed - some data may still exist');
      }
      
      // Call the logout function from AuthContext
      const logoutSuccess = logout();
      
      if (logoutSuccess) {
        console.log(`User ${userName} logged out successfully. All localStorage data cleared.`);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still try to logout even if there's an error
      logout();
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{width:'100%', display:'flex',alignItems:'center',justifyContent:'center' }}>
          GVC Vending Dashboard
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Welcome, {user.username}
            </Typography>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 