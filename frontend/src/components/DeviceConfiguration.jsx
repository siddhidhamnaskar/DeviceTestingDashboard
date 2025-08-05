import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import BoardTable from '../table';

const DeviceConfiguration = () => {
 


  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
        Device Configuration
      </Typography>

    <BoardTable/>
    </Box>
  );
};

export default DeviceConfiguration; 