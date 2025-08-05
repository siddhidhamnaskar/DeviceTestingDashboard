import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Chip,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Devices as DevicesIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  QrCode as QrCodeIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { getUserInfo } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />, 
    value: 'dashboard',
    description: 'Overview and analytics'
  },
  { 
    text: 'Device Configuration', 
    icon: <SettingsIcon />, 
    value: 'mqtt',
    description: 'Configure MQTT devices'
  },
  { 
    text: 'Device Reports', 
    icon: <DevicesIcon />, 
    value: 'device-config',
    description: 'View device configuration reports'
  },
  { 
    text: 'MQTT Mac Mappings', 
    icon: <DevicesIcon />, 
    value: 'mqtt-mac-mapping',
    description: 'Manage MQTT device mappings'
  },
  { 
    text: 'Transactions', 
    icon: <ReceiptIcon />, 
    value: 'mobivend-txns',
    description: 'MobiVend transaction history'
  },
  { 
    text: 'Vendings', 
    icon: <ShoppingCartIcon />, 
    value: 'mobivend-vendings',
    description: 'Vending machine operations'
  },
  { 
    text: 'Devices', 
    icon: <DevicesIcon />, 
    value: 'mobivend-devices',
    description: 'Manage MobiVend devices'
  },
  { 
    text: 'QR Codes', 
    icon: <QrCodeIcon />, 
    value: 'mobivend-qrcodes',
    description: 'QR code management'
  },
  { 
    text: 'City Client Sites', 
    icon: <DevicesIcon />, 
    value: 'city-client-sites',
    description: 'Manage city, client, and site information'
  },
  { 
    text: 'Dashboard Users', 
    icon: <AccountCircleIcon />, 
    value: 'dashboard-users',
    description: 'Manage dashboard user accounts'
  }
];

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const userInfo = getUserInfo();
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: theme.palette.primary.main, 
        color: 'white',
        alignItems: 'center',
        gap: 2
      }}>
        <img 
          src="/GVC.png" 
          alt="GVC Logo" 
          style={{ 
            height: '60px', 
            width: 'auto',
            objectFit: 'contain',
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '4px'
          }} 
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            GVC Vending Dashboard
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Device Management System
          </Typography>
        </Box>
      </Box>
     


      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton
                onClick={() => onTabChange(item.value)}
                selected={activeTab === item.value}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.value === activeTab)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
                <AccountCircleIcon />
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                  {userInfo?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {userInfo?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Box>
            
            <Chip 
              label="Online" 
              color="success" 
              size="small" 
              sx={{ fontSize: '0.7rem', display: { xs: 'none', sm: 'block' } }}
            />
            
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={open && isMobile}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'background.default'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="persistent"
          open={open && !isMobile}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'background.default',
              borderRight: `1px solid ${theme.palette.divider}`
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 