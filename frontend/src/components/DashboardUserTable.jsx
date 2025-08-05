import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Tooltip,
  TablePagination,
  Fab,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  Clear,
  Download,
  Email,
  AdminPanelSettings,
  SupervisedUserCircle
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const DashboardUserTable = () => {
  const [dashboardUsers, setDashboardUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    isAdmin: false,
    isSuperAdmin: false,
    city: [],
    site: [],
    category: [],
    devices: []
  });

  // Additional states for form options
  const [availableCities, setAvailableCities] = useState([]);
  const [availableSites, setAvailableSites] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);

  // Fetch dashboard users
  const fetchDashboardUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/dashboard-users`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard users');
      }
      const data = await response.json();
      setDashboardUsers(data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard users:', err);
      setError('Failed to load dashboard users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardUsers();
    fetchAvailableOptions();
  }, []);

  // Filter and search logic
  const filteredData = dashboardUsers.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.email?.toLowerCase().includes(searchLower) ||
      item.id?.toString().includes(searchLower) ||
      (Array.isArray(item.city) ? item.city.some(city => city.toLowerCase().includes(searchLower)) : item.city?.toLowerCase().includes(searchLower)) ||
      (Array.isArray(item.site) ? item.site.some(site => site.toLowerCase().includes(searchLower)) : item.site?.toLowerCase().includes(searchLower)) ||
      (Array.isArray(item.category) ? item.category.some(category => category.toLowerCase().includes(searchLower)) : item.category?.toLowerCase().includes(searchLower))
    );
  });

  // Pagination
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Form handling
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Select all and clear all handlers
  const handleSelectAll = (field, options) => {
    setFormData(prev => ({
      ...prev,
      [field]: options
    }));
  };

  const handleClearAll = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: []
    }));
  };

  // Custom onChange handler to handle select all/clear all
  const handleSelectChange = (field, value) => {
    // Check if select all or clear all was clicked
    if (value.includes('__select_all__')) {
      // Remove the special value and add all options
      const cleanValue = value.filter(v => v !== '__select_all__');
      if (field === 'city') {
        handleSelectAll(field, availableCities);
      } else if (field === 'site') {
        handleSelectAll(field, availableSites);
      } else if (field === 'category') {
        handleSelectAll(field, availableCategories);
      } else if (field === 'devices') {
        handleSelectAll(field, availableDevices.map(d => d.id));
      }
    } else if (value.includes('__clear_all__')) {
      // Remove the special value and clear all
      const cleanValue = value.filter(v => v !== '__clear_all__');
      handleClearAll(field);
    } else {
      // Normal selection
      handleInputChange(field, value);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      isAdmin: false,
      isSuperAdmin: false,
      city: [],
      site: [],
      category: [],
      devices: []
    });
    setEditingItem(null);
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({
      email: item.email || '',
      isAdmin: item.isAdmin || false,
      isSuperAdmin: item.isSuperAdmin || false,
      city: item.city ? (Array.isArray(item.city) ? item.city : [item.city]) : [],
      site: item.site ? (Array.isArray(item.site) ? item.site : [item.site]) : [],
      category: item.category ? (Array.isArray(item.category) ? item.category : [item.category]) : [],
      devices: item.devices || []
    });
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API}/dashboard-users/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        fetchDashboardUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingItem 
        ? `${API}/dashboard-users/${editingItem.id}`
        : `${API}/dashboard-users`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      setDialogOpen(false);
      resetForm();
      fetchDashboardUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user');
    }
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fetch available options for form
  const fetchAvailableOptions = async () => {
    try {
      // Fetch cities from cityClientSite
      const citiesResponse = await fetch(`${API}/city-client-sites/cities/unique`);
      if (citiesResponse.ok) {
        const citiesData = await citiesResponse.json();
        setAvailableCities(citiesData.data || []);
      }

      // Fetch sites from cityClientSite
      const sitesResponse = await fetch(`${API}/city-client-sites/sites/unique`);
      if (sitesResponse.ok) {
        const sitesData = await sitesResponse.json();
        setAvailableSites(sitesData.data || []);
      }

      // Fetch categories from MqttMacMapping by getting all data and extracting unique categories
      const categoriesResponse = await fetch(`${API}/mqtt-mac-mapping?limit=1000`);
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        const allCategories = categoriesData.data || [];
        const uniqueCategories = [...new Set(allCategories.map(item => item.category).filter(cat => cat))];
        setAvailableCategories(uniqueCategories);
      }

      // Fetch available devices from MqttMacMapping using SNoutput
      const devicesResponse = await fetch(`${API}/mqtt-mac-mapping?limit=1000`);
      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();
        const allDevices = devicesData.data || [];
        // Filter devices that have SNoutput and map to the expected format
        const formattedDevices = allDevices
          .filter(device => device.SNoutput)
          .map(device => ({
            id: device.id,
            MacID: device.MacID,
            SNoutput: device.SNoutput,
            Location: device.Location || '',
            City: device.City || ''
          }));
        setAvailableDevices(formattedDevices);
      }
    } catch (err) {
      console.error('Error fetching available options:', err);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'City', 'Site', 'Category', 'Devices', 'Is Admin', 'Is Super Admin', 'Created At', 'Updated At'];
    const csvData = filteredData.map(item => [
      item.id,
      item.email,
      Array.isArray(item.city) ? item.city.join(', ') : (item.city || ''),
      Array.isArray(item.site) ? item.site.join(', ') : (item.site || ''),
      Array.isArray(item.category) ? item.category.join(', ') : (item.category || ''),
      item.devices ? item.devices.join(', ') : '',
      item.isAdmin ? 'Yes' : 'No',
      item.isSuperAdmin ? 'Yes' : 'No',
      moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-users-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Helper function for multiple select display
  const getSelectedDeviceNames = () => {
    return formData.devices.map(deviceId => {
      const device = availableDevices.find(d => d.id === deviceId);
      return device ? `${device.SNoutput} - ${device.MacID}` : deviceId;
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Dashboard User Management
            </Typography>
            <Box>
              <Tooltip title="Export to CSV">
                <IconButton onClick={exportToCSV} color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchDashboardUsers} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Search and Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by Email, ID, City, Site, or Category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: searchTerm && (
                    <IconButton size="small" onClick={clearSearch}>
                      <Clear />
                    </IconButton>
                  )
                }}
              />
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Admin</TableCell>
                  <TableCell align="center">Super Admin</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Email fontSize="small" color="action" />
                        {item.email}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {item.isAdmin ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <AdminPanelSettings color="primary" fontSize="small" />
                        </Box>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {item.isSuperAdmin ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <SupervisedUserCircle color="secondary" fontSize="small" />
                        </Box>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell>
                      {moment(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(item)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(item.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                error={formData.email && !isValidEmail(formData.email)}
                helperText={formData.email && !isValidEmail(formData.email) ? 'Please enter a valid email address' : ''}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  multiple
                  value={formData.city}
                  label="City"
                  onChange={(e) => handleSelectChange('city', e.target.value)}
                  input={<OutlinedInput label="City" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((city) => (
                        <Chip key={city} label={city} size="small" />
                      ))}
                    </Box>
                  )}
                  sx={{width: '200px'}}
                >
                  <MenuItem value="__select_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>✅</span>
                      Select All Cities
                    </Box>
                  </MenuItem>
                  <MenuItem value="__clear_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>❌</span>
                      Clear All Cities
                    </Box>
                  </MenuItem>
                  <Box sx={{ borderTop: '1px solid #e0e0e0', my: 1 }} />
                  {availableCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      <Checkbox checked={formData.city.indexOf(city) > -1} />
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Site</InputLabel>
                <Select
                  multiple
                  value={formData.site}
                  label="Site"
                  onChange={(e) => handleSelectChange('site', e.target.value)}
                  input={<OutlinedInput label="Site" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((site) => (
                        <Chip key={site} label={site} size="small" />
                      ))}
                    </Box>
                  )}
                  sx={{width: '200px'}}
                >
                  <MenuItem value="__select_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>✅</span>
                      Select All Sites
                    </Box>
                  </MenuItem>
                  <MenuItem value="__clear_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>❌</span>
                      Clear All Sites
                    </Box>
                  </MenuItem>
                  <Box sx={{ borderTop: '1px solid #e0e0e0', my: 1 }} />
                  {availableSites.map((site) => (
                    <MenuItem key={site} value={site}>
                      <Checkbox checked={formData.site.indexOf(site) > -1} />
                      {site}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  multiple
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleSelectChange('category', e.target.value)}
                  input={<OutlinedInput label="Category" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((category) => (
                        <Chip key={category} label={category} size="small" />
                      ))}
                    </Box>
                  )}
                  sx={{width: '200px'}}
                >
                  <MenuItem value="__select_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>✅</span>
                      Select All Categories
                    </Box>
                  </MenuItem>
                  <MenuItem value="__clear_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>❌</span>
                      Clear All Categories
                    </Box>
                  </MenuItem>
                  <Box sx={{ borderTop: '1px solid #e0e0e0', my: 1 }} />
                  {availableCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      <Checkbox checked={formData.category.indexOf(category) > -1} />
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Devices</InputLabel>
                <Select
                  multiple
                  value={formData.devices}
                  onChange={(e) => handleSelectChange('devices', e.target.value)}
                  input={<OutlinedInput label="Devices" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length <= 2 ? (
                        selected.map((deviceId) => {
                          const device = availableDevices.find(d => d.id === deviceId);
                          return (
                            <Chip 
                              key={deviceId} 
                              label={device ? `${device.SNoutput} - ${device.MacID}` : deviceId}
                              size="small"
                            />
                          );
                        })
                      ) : (
                        <Chip 
                          label={`${selected.length} devices selected`}
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                  )}
                  sx={{width: '200px'}}
                >
                  <MenuItem value="__select_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>✅</span>
                      Select All Devices
                    </Box>
                  </MenuItem>
                  <MenuItem value="__clear_all__">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>❌</span>
                      Clear All Devices
                    </Box>
                  </MenuItem>
                  <Box sx={{ borderTop: '1px solid #e0e0e0', my: 1 }} />
                  {availableDevices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      <Checkbox checked={formData.devices.indexOf(device.id) > -1} />
                      {device.SNoutput} - {device.MacID}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isAdmin}
                      onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AdminPanelSettings fontSize="small" color="primary" />
                      Admin User
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isSuperAdmin}
                      onChange={(e) => handleInputChange('isSuperAdmin', e.target.checked)}
                      color="secondary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <SupervisedUserCircle fontSize="small" color="secondary" />
                      Super Admin User
                    </Box>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.email || !isValidEmail(formData.email)}
          >
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddNew}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default DashboardUserTable; 