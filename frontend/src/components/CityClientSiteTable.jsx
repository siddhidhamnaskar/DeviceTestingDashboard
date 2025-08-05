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
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  Clear,
  Download
} from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const CityClientSiteTable = () => {
  const [cityClientSites, setCityClientSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Device type options
  const deviceTypeOptions = [
    'Arcade Gaming',
    'Joy-n-Freedom',
    'Sanitary Vending',
    'Snack Vending',
    'Beverage Vending'
  ];
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    city: '',
    client: '',
    site: '',
    deviceType: ''
  });

  // Fetch city client sites
  const fetchCityClientSites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/city-client-sites`);
      if (!response.ok) {
        throw new Error('Failed to fetch city client sites');
      }
      const data = await response.json();
      setCityClientSites(data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching city client sites:', err);
      setError('Failed to load city client sites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityClientSites();
  }, []);

  // Filter and search logic
  const filteredData = cityClientSites.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.city?.toLowerCase().includes(searchLower) ||
      item.client?.toLowerCase().includes(searchLower) ||
      item.site?.toLowerCase().includes(searchLower) ||
      item.deviceType?.toLowerCase().includes(searchLower)
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
      city: '',
      client: '',
      site: '',
      deviceType: ''
    });
    setEditingItem(null);
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({
      city: item.city || '',
      client: item.client || '',
      site: item.site || '',
      deviceType: item.deviceType || ''
    });
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`${API}/city-client-sites/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete record');
        }
        fetchCityClientSites();
      } catch (err) {
        console.error('Error deleting record:', err);
        setError('Failed to delete record');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingItem 
        ? `${API}/city-client-sites/${editingItem.id}`
        : `${API}/city-client-sites`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save record');
      }

      setDialogOpen(false);
      resetForm();
      fetchCityClientSites();
    } catch (err) {
      console.error('Error saving record:', err);
      setError('Failed to save record');
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'City', 'Client', 'Site', 'Device Type', 'Created At', 'Updated At'];
    const csvData = filteredData.map(item => [
      item.id,
      item.city,
      item.client,
      item.site,
      item.deviceType,
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
    a.download = `city-client-sites-${moment().format('YYYY-MM-DD')}.csv`;
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
            <Typography variant="h4" component="h1">
              City Client Site Management
            </Typography>
            <Box>
              <Tooltip title="Export to CSV">
                <IconButton onClick={exportToCSV} color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchCityClientSites} color="primary">
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
                label="Search"
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
                  <TableCell>City</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Device Type</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>{item.site}</TableCell>
                    <TableCell>{item.deviceType}</TableCell>
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
                    <TableCell colSpan={8} align="center">
                      No records found
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Record' : 'Add New Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Client"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site"
                value={formData.site}
                onChange={(e) => handleInputChange('site', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Device Type</InputLabel>
                <Select
                  value={formData.deviceType}
                  label="Device Type"
                  onChange={(e) => handleInputChange('deviceType', e.target.value)}
                  sx={{width:"200px"}}
                >
                  {deviceTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.city || !formData.client || !formData.site || !formData.deviceType}
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

export default CityClientSiteTable; 