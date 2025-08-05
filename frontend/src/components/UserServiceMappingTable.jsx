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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  Clear,
  Download,
  Person,
  LocationOn,
  Category,
  Visibility,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AdminPanelSettings,
  SupervisedUserCircle
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const UserServiceMappingTable = () => {
  const [userServiceMappings, setUserServiceMappings] = useState([]);
  const [dashboardUsers, setDashboardUsers] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    cities: [],
    sites: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    city: '',
    site: '',
    category: '',
    canView: true,
    canEdit: false,
    canDelete: false,
    canCreate: false
  });

  // Fetch user service mappings
  const fetchUserServiceMappings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/user-service-mappings`);
      if (!response.ok) {
        throw new Error('Failed to fetch user service mappings');
      }
      const data = await response.json();
      setUserServiceMappings(data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching user service mappings:', err);
      setError('Failed to load user service mappings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard users
  const fetchDashboardUsers = async () => {
    try {
      const response = await fetch(`${API}/dashboard-users`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard users');
      }
      const data = await response.json();
      setDashboardUsers(data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard users:', err);
    }
  };

  // Fetch available filters
  const fetchAvailableFilters = async () => {
    try {
      const response = await fetch(`${API}/user-service-mappings/filters`);
      if (!response.ok) {
        throw new Error('Failed to fetch available filters');
      }
      const data = await response.json();
      setAvailableFilters(data.data || { cities: [], sites: [], categories: [] });
    } catch (err) {
      console.error('Error fetching available filters:', err);
    }
  };

  useEffect(() => {
    fetchUserServiceMappings();
    fetchDashboardUsers();
    fetchAvailableFilters();
  }, []);

  // Filter and search logic
  const filteredData = userServiceMappings.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.user?.email?.toLowerCase().includes(searchLower) ||
      item.city?.toLowerCase().includes(searchLower) ||
      item.site?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower) ||
      item.id?.toString().includes(searchLower)
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

  const resetForm = () => {
    setFormData({
      userId: '',
      city: '',
      site: '',
      category: '',
      canView: true,
      canEdit: false,
      canDelete: false,
      canCreate: false
    });
    setEditingItem(null);
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({
      userId: item.userId || '',
      city: item.city || '',
      site: item.site || '',
      category: item.category || '',
      canView: item.canView || false,
      canEdit: item.canEdit || false,
      canDelete: item.canDelete || false,
      canCreate: item.canCreate || false
    });
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service mapping?')) {
      try {
        const response = await fetch(`${API}/user-service-mappings/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete service mapping');
        }
        fetchUserServiceMappings();
      } catch (err) {
        console.error('Error deleting service mapping:', err);
        setError('Failed to delete service mapping');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingItem 
        ? `${API}/user-service-mappings/${editingItem.id}`
        : `${API}/user-service-mappings`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save service mapping');
      }

      setDialogOpen(false);
      resetForm();
      fetchUserServiceMappings();
    } catch (err) {
      console.error('Error saving service mapping:', err);
      setError(err.message || 'Failed to save service mapping');
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'User Email', 'City', 'Site', 'Category', 'Can View', 'Can Edit', 'Can Delete', 'Can Create', 'Created At', 'Updated At'];
    const csvData = filteredData.map(item => [
      item.id,
      item.user?.email || '',
      item.city || 'All Cities',
      item.site || 'All Sites',
      item.category || 'All Categories',
      item.canView ? 'Yes' : 'No',
      item.canEdit ? 'Yes' : 'No',
      item.canDelete ? 'Yes' : 'No',
      item.canCreate ? 'Yes' : 'No',
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
    a.download = `user-service-mappings-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <Box display="flex" alignItems="center" gap={2}>
              <Person color="primary" />
              <Typography variant="h4" component="h1">
                User Service Mappings
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Export to CSV">
                <IconButton onClick={exportToCSV} color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchUserServiceMappings} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Search and Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by User, City, Site, or Category"
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
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
                fullWidth
              >
                Add Service Mapping
              </Button>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Permissions</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {item.user?.email}
                          </Typography>
                          <Box display="flex" gap={0.5}>
                            {item.user?.isAdmin && (
                              <AdminPanelSettings fontSize="small" color="primary" />
                            )}
                            {item.user?.isSuperAdmin && (
                              <SupervisedUserCircle fontSize="small" color="secondary" />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {item.city ? (
                        <Chip 
                          label={item.city} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          icon={<LocationOn />}
                        />
                      ) : (
                        <Chip 
                          label="All Cities" 
                          size="small" 
                          color="default" 
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.site ? (
                        <Chip 
                          label={item.site} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      ) : (
                        <Chip 
                          label="All Sites" 
                          size="small" 
                          color="default" 
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.category ? (
                        <Chip 
                          label={item.category} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          icon={<Category />}
                        />
                      ) : (
                        <Chip 
                          label="All Categories" 
                          size="small" 
                          color="default" 
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {item.canView && (
                          <Tooltip title="Can View">
                            <Visibility color="primary" fontSize="small" />
                          </Tooltip>
                        )}
                        {item.canEdit && (
                          <Tooltip title="Can Edit">
                            <EditIcon color="secondary" fontSize="small" />
                          </Tooltip>
                        )}
                        {item.canDelete && (
                          <Tooltip title="Can Delete">
                            <DeleteIcon color="error" fontSize="small" />
                          </Tooltip>
                        )}
                        {item.canCreate && (
                          <Tooltip title="Can Create">
                            <AddIcon color="success" fontSize="small" />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
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
                    <TableCell colSpan={8} align="center">
                      No service mappings found
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
          {editingItem ? 'Edit Service Mapping' : 'Add New Service Mapping'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>User</InputLabel>
                <Select
                  value={formData.userId}
                  label="User"
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  disabled={!!editingItem}
                >
                  {dashboardUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" />
                        {user.email}
                        {user.isAdmin && <AdminPanelSettings fontSize="small" color="primary" />}
                        {user.isSuperAdmin && <SupervisedUserCircle fontSize="small" color="secondary" />}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  value={formData.city}
                  label="City"
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Cities</em>
                  </MenuItem>
                  {availableFilters.cities.map((city) => (
                    <MenuItem key={city} value={city}>
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
                  value={formData.site}
                  label="Site"
                  onChange={(e) => handleInputChange('site', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Sites</em>
                  </MenuItem>
                  {availableFilters.sites.map((site) => (
                    <MenuItem key={site} value={site}>
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
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {availableFilters.categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Permissions
              </Typography>
              <Box display="flex" gap={3} flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canView}
                      onChange={(e) => handleInputChange('canView', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Visibility fontSize="small" color="primary" />
                      Can View
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canEdit}
                      onChange={(e) => handleInputChange('canEdit', e.target.checked)}
                      color="secondary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <EditIcon fontSize="small" color="secondary" />
                      Can Edit
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canDelete}
                      onChange={(e) => handleInputChange('canDelete', e.target.checked)}
                      color="error"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <DeleteIcon fontSize="small" color="error" />
                      Can Delete
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.canCreate}
                      onChange={(e) => handleInputChange('canCreate', e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AddIcon fontSize="small" color="success" />
                      Can Create
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
            disabled={!formData.userId}
          >
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserServiceMappingTable; 