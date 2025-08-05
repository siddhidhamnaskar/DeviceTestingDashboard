import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  Devices as DevicesIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { AllMacAddress } from '../_mock/sendToMqtt';
import moment from 'moment';

const DashboardOverview = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDevices = async () => {
    try {
      const res = await AllMacAddress();
      if (res) {
        setDevices(res);
      }
      setLoading(false);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching devices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const online = (device) => {
    if (!device?.lastHeartBeatTime) return false;
    return moment().diff(moment.utc(device.lastHeartBeatTime), 'minute') < 10;
  };

  const onlineDevices = devices.filter(device => online(device));
  const offlineDevices = devices.filter(device => !online(device));
  const totalDevices = devices.length;
  const onlinePercentage = totalDevices > 0 ? (onlineDevices.length / totalDevices) * 100 : 0;

  const recentDevices = devices
    .sort((a, b) => moment(b.lastHeartBeatTime).diff(moment(a.lastHeartBeatTime)))
    .slice(0, 5);

  const getStatusColor = (device) => {
    if (online(device)) return 'success';
    return 'error';
  };

  const getStatusIcon = (device) => {
    if (online(device)) return <WifiIcon />;
    return <WifiOffIcon />;
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
          {trend && (
            <Chip
              label={trend}
              size="small"
              color={trend.includes('+') ? 'success' : 'error'}
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, mx: 'auto', mb: 2, width: 56, height: 56 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {moment(lastUpdated).format('MMM DD, YYYY HH:mm:ss')}
          </Typography>
          <IconButton size="small" onClick={fetchDevices} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Devices"
            value={totalDevices}
            subtitle="Registered devices"
            icon={<DevicesIcon />}
            color="primary"
            trend={totalDevices > 0 ? `+${totalDevices}` : '0'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Online Devices"
            value={onlineDevices.length}
            subtitle={`${onlinePercentage.toFixed(1)}% online`}
            icon={<WifiIcon />}
            color="success"
            trend={onlineDevices.length > 0 ? `+${onlineDevices.length}` : '0'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Offline Devices"
            value={offlineDevices.length}
            subtitle="Requires attention"
            icon={<WifiOffIcon />}
            color="error"
            trend={offlineDevices.length > 0 ? `-${offlineDevices.length}` : '0'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Health"
            value={onlinePercentage.toFixed(0) + '%'}
            subtitle="Overall uptime"
            icon={<CheckCircleIcon />}
            color={onlinePercentage > 80 ? 'success' : onlinePercentage > 50 ? 'warning' : 'error'}
          />
        </Grid>
      </Grid>

      {/* Online Status Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="div">
              Device Online Status
            </Typography>
            <Chip 
              label={`${onlineDevices.length}/${totalDevices} Online`}
              color={onlinePercentage > 80 ? 'success' : onlinePercentage > 50 ? 'warning' : 'error'}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={onlinePercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Quick Actions and Recent Devices */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 3, fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Add Device"
                    description="Register new device"
                    icon={<AddIcon />}
                    color="primary"
                    onClick={() => console.log('Add device clicked')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Configure"
                    description="Device settings"
                    icon={<SettingsIcon />}
                    color="secondary"
                    onClick={() => console.log('Configure clicked')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Reports"
                    description="View analytics"
                    icon={<TrendingUpIcon />}
                    color="info"
                    onClick={() => console.log('Reports clicked')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Alerts"
                    description="System notifications"
                    icon={<WarningIcon />}
                    color="warning"
                    onClick={() => console.log('Alerts clicked')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Device Activity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 3, fontWeight: 'bold' }}>
                Recent Device Activity
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <LinearProgress sx={{ width: '50%' }} />
                </Box>
              ) : recentDevices.length > 0 ? (
                <List>
                  {recentDevices.map((device, index) => (
                    <React.Fragment key={device.MacID || index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${getStatusColor(device)}.light` }}>
                            {getStatusIcon(device)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {device.MacID || 'Unknown Device'}
                              </Typography>
                              <Chip
                                label={online(device) ? 'Online' : 'Offline'}
                                size="small"
                                color={getStatusColor(device)}
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                SN: {device.SNoutput || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Last seen: {device.lastHeartBeatTime ? 
                                  moment.utc(device.lastHeartBeatTime).fromNow() : 
                                  'Never'
                                }
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentDevices.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No devices found. Add your first device to get started.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Alerts */}
      {offlineDevices.length > 0 && (
        <Card sx={{ mt: 4, border: '1px solid', borderColor: 'warning.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ErrorIcon color="warning" />
              <Typography variant="h6" component="div" color="warning.main">
                System Alerts
              </Typography>
            </Box>
            <Alert severity="warning">
              {offlineDevices.length} device(s) are currently offline and may require attention.
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardOverview; 