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
  Chip,
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
  Divider,
  OutlinedInput,
  Autocomplete,
  Snackbar
} from '@mui/material';
import {
  Search,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Clear,
  Download,
  Upload,
  DeviceHub,
  QrCode,
  Receipt,
  LocalShipping,
  CheckBox,
  CheckBoxOutlineBlank
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const MqttMacMappingTable = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Form states
  const [formData, setFormData] = useState({
    MacID: '',
    SNoutput: '',
    category: '',
    City: '',
    client: '',
    site: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState([]);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Multiple delete states
  const [selectedMappings, setSelectedMappings] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load all mappings on component mount
  useEffect(() => {
    loadAllMappings();
    loadCategories();
    loadCities();
    loadClients();
    loadSites();
  }, []);

  // Load categories from existing mappings
  const loadCategories = async () => {
    try {
      const response = await fetch(`${API}/mqtt-mac-mapping`);
      const data = await response.json();
      
      // Predefined category options
      const predefinedCategories = [
        'Arcade Gaming',
        'Joy-n-Freedom', 
        'Sanitary Vending',
        'Snack Vending',
        'Beverage Vending'
      ];
      
      // Extract unique categories from existing mappings
      const existingCategories = [...new Set(
        (data.data || [])
          .map(mapping => mapping.category)
          .filter(category => category && category.trim())
      )].sort();
      
      // Combine predefined and existing categories, removing duplicates
      const allCategories = [...new Set([...predefinedCategories, ...existingCategories])];
      
      setCategories(allCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      // Set predefined categories as fallback
      setCategories([
        'Arcade Gaming',
        'Joy-n-Freedom', 
        'Sanitary Vending',
        'Snack Vending',
        'Beverage Vending'
      ]);
    }
  };

  // Load cities from cityClientSite table
  const loadCities = async () => {
    try {
      const response = await fetch(`${API}/city-client-sites/cities/unique`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setCities(data.data);
      } else {
        console.error('Failed to load cities:', data.message);
        setCities([]);
      }
    } catch (err) {
      console.error('Error loading cities:', err);
      setCities([]);
    }
  };

  // Load clients from cityClientSite table
  const loadClients = async () => {
    try {
      const response = await fetch(`${API}/city-client-sites/clients/unique`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setClients(data.data);
      } else {
        console.error('Failed to load clients:', data.message);
        setClients([]);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
      setClients([]);
    }
  };

  // Load sites from cityClientSite table
  const loadSites = async () => {
    try {
      const response = await fetch(`${API}/city-client-sites/sites/unique`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSites(data.data);
      } else {
        console.error('Failed to load sites:', data.message);
        setSites([]);
      }
    } catch (err) {
      console.error('Error loading sites:', err);
      setSites([]);
    }
  };

  // Load all mappings
  const loadAllMappings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/mqtt-mac-mapping`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch mappings');
      }

      const result = await response.json();
      setMappings(result.data || []);
    } catch (err) {
      console.error('Error loading mappings:', err);
      setError('Failed to load mappings. Please try again.');
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for mapping by Mac ID
  const searchMapping = async (macId) => {
    if (!macId.trim()) {
      setError('Please enter a Mac ID to search');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/mqtt-mac-mapping?MacID=${encodeURIComponent(macId.trim())}`);

      if (!response.ok) {
        throw new Error('Failed to fetch mapping');
      }

      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        setMappings(result.data);
      } else {
        setMappings([]);
        setError('No mapping found with this Mac ID');
      }
    } catch (err) {
      console.error('Error searching mapping:', err);
      setError('Failed to search mapping. Please try again.');
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    searchMapping(searchTerm);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    loadAllMappings();
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.MacID.trim()) errors.MacID = 'Mac ID is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new mapping
  const handleAddMapping = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${API}/mqtt-mac-mapping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MacID: formData.MacID.trim(),
          SNoutput: formData.SNoutput.trim() || null,
          category: formData.category.trim() || null,
          City: formData.City.trim() || null,
          client: formData.client.trim() || null,
          site: formData.site.trim() || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create mapping');
      }

      const result = await response.json();
      setMappings(prev => [result.data, ...prev]);
      setAddDialogOpen(false);
      setFormData({ MacID: '', SNoutput: '', category: '', City: '', client: '', site: '' });
      setError('');
      setSnackbar({
        open: true,
        message: 'Mapping created successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error creating mapping:', err);
      setError(err.message || 'Failed to create mapping. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View mapping details
  const handleViewDetails = (mapping) => {
    setSelectedMapping(mapping);
    setDetailDialogOpen(true);
  };

  // Edit mapping
  const handleEditMapping = (mapping) => {
    setFormData({
      MacID: mapping.MacID || '',
      SNoutput: mapping.SNoutput || '',
      category: mapping.category || '',
      City: mapping.City || '',
      client: mapping.client || '',
      site: mapping.site || ''
    });
    setSelectedMapping(mapping);
    setEditDialogOpen(true);
  };

  // Update mapping
  const handleUpdateMapping = async () => {
    if (!validateForm() || !selectedMapping) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${API}/mqtt-mac-mapping/${selectedMapping.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MacID: formData.MacID.trim(),
          SNoutput: formData.SNoutput.trim() || null,
          category: formData.category.trim() || null,
          City: formData.City.trim() || null,
          client: formData.client.trim() || null,
          site: formData.site.trim() || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update mapping');
      }

      const result = await response.json();
      setMappings(prev => prev.map(mapping => 
        mapping.id === selectedMapping.id ? result.data : mapping
      ));
      setEditDialogOpen(false);
      setFormData({ MacID: '', SNoutput: '', category: '', City: '', client: '', site: '' });
      setSelectedMapping(null);
      setError('');
      setSnackbar({
        open: true,
        message: 'Mapping updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating mapping:', err);
      setError(err.message || 'Failed to update mapping. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete mapping
  const handleDeleteMapping = async (mapping) => {
    if (!window.confirm(`Are you sure you want to delete mapping with Mac ID ${mapping.MacID}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API}/mqtt-mac-mapping/${mapping.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete mapping');
      }

      setMappings(prev => prev.filter(m => m.id !== mapping.id));
      setError('');
      setSnackbar({
        open: true,
        message: 'Mapping deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting mapping:', err);
      setError(err.message || 'Failed to delete mapping. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Multiple delete functions
  const handleSelectMapping = (mappingId) => {
    setSelectedMappings(prev => 
      prev.includes(mappingId) 
        ? prev.filter(id => id !== mappingId)
        : [...prev, mappingId]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedMappings.map(mapping => mapping.id);
    setSelectedMappings(prev => 
      currentPageIds.every(id => prev.includes(id))
        ? prev.filter(id => !currentPageIds.includes(id))
        : [...new Set([...prev, ...currentPageIds])]
    );
  };

  const handleBulkDelete = () => {
    if (selectedMappings.length === 0) {
      setError('Please select mappings to delete');
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setDeleting(true);
      setError('');
      
      const response = await fetch(`${API}/mqtt-mac-mapping/bulk/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedMappings })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete mappings');
      }

      const result = await response.json();
      
      // Update the mappings list
      setMappings(prev => prev.filter(mapping => !selectedMappings.includes(mapping.id)));
      
      // Clear selection
      setSelectedMappings([]);
      setDeleteDialogOpen(false);

      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error in bulk delete:', err);
      setError(err.message || 'An error occurred during bulk delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (mappings.length === 0) {
      setError('No data to export');
      return;
    }

    const headers = ['ID', 'Mac ID', 'Serial Number', 'Category', 'City', 'Client', 'Site', 'Last Heartbeat', 'Created At', 'Updated At'];
    const csvData = mappings.map(mapping => [
      mapping.id,
      mapping.MacID,
      mapping.SNoutput || '',
      mapping.category || '',
      mapping.City || '',
      mapping.client || '',
      mapping.site || '',
      mapping.lastHeartBeatTime ? moment(mapping.lastHeartBeatTime).format('YYYY-MM-DD HH:mm:ss') : '',
      moment(mapping.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      moment(mapping.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mqtt-mac-mappings-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const paginatedMappings = mappings.slice(
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

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
           
              <DeviceHub color="primary" />
              <Typography variant="h5" component="h1" fontWeight="bold">
                MQTT Mac Mappings
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToCSV}
                disabled={mappings.length === 0}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                disabled={selectedMappings.length === 0}
              >
                Delete Selected ({selectedMappings.length})
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddDialogOpen(true)}
              >
                Add Mapping
              </Button>
            </Box>
          </Box>

          {/* Search Section */}
          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search by Mac ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter Mac ID..."
                  InputProps={{
                    endAdornment: (
                      <Box display="flex" gap={1}>
                        <IconButton onClick={handleSearch} disabled={loading}>
                          <Search />
                        </IconButton>
                        <IconButton onClick={clearSearch}>
                          <Clear />
                        </IconButton>
                      </Box>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadAllMappings}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}

          {/* Mappings Table */}
          {!loading && (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell padding="checkbox">
                        <IconButton
                          size="small"
                          onClick={handleSelectAll}
                          disabled={paginatedMappings.length === 0}
                        >
                          {paginatedMappings.length > 0 && paginatedMappings.every(mapping => selectedMappings.includes(mapping.id)) ? (
                            <CheckBox color="primary" />
                          ) : (
                            <CheckBoxOutlineBlank />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell><strong>Mac ID</strong></TableCell>
                      <TableCell><strong>Serial Number</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>City</strong></TableCell>
                      <TableCell><strong>Client</strong></TableCell>
                      <TableCell><strong>Site</strong></TableCell>
                      <TableCell><strong>Last Heartbeat</strong></TableCell>
                      <TableCell><strong>Created At</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedMappings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            {mappings.length === 0 ? 'No mappings found. Add a mapping to get started.' : 'No mappings match your search criteria'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedMappings.map((mapping) => (
                        <TableRow key={mapping.id} hover>
                          <TableCell padding="checkbox">
                            <IconButton
                              size="small"
                              onClick={() => handleSelectMapping(mapping.id)}
                            >
                              {selectedMappings.includes(mapping.id) ? (
                                <CheckBox color="primary" />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {mapping.MacID}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {mapping.SNoutput || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {mapping.category ? (
                              <Chip 
                                label={mapping.category} 
                                size="small" 
                                color="secondary" 
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {mapping.City ? (
                              <Chip 
                                label={mapping.City} 
                                size="small" 
                                color="info" 
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {mapping.client ? (
                              <Chip 
                                label={mapping.client} 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {mapping.site ? (
                              <Chip 
                                label={mapping.site} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {mapping.lastHeartBeatTime ? (
                              moment(mapping.lastHeartBeatTime).format('YYYY-MM-DD HH:mm')
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Never
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {moment(mapping.createdAt).format('YYYY-MM-DD HH:mm')}
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewDetails(mapping)}
                                  color="primary"
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Mapping">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditMapping(mapping)}
                                  color="secondary"
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Mapping">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteMapping(mapping)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {mappings.length > 0 && (
                <TablePagination
                  component="div"
                  count={mappings.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Mapping Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Mapping</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mac ID"
                  value={formData.MacID}
                  onChange={(e) => handleInputChange('MacID', e.target.value)}
                  error={!!formErrors.MacID}
                  helperText={formErrors.MacID}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.SNoutput}
                  onChange={(e) => handleInputChange('SNoutput', e.target.value)}
                  placeholder="Enter serial number (optional)"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={formData.category}
                  onChange={(event, newValue) => handleInputChange('category', newValue)}
                  options={['', ...categories]}
                  getOptionLabel={(option) => option || 'Select a category'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      placeholder="Select from predefined options or enter custom category"
                      sx={{width: '300px'}}
                    />
                  )}
                  renderOption={(props, option) => {
                    const isPredefined = [
                      'Arcade Gaming',
                      'Joy-n-Freedom', 
                      'Sanitary Vending',
                      'Snack Vending',
                      'Beverage Vending'
                    ].includes(option);
                    return (
                      <li {...props} style={{ 
                        fontWeight: isPredefined ? 'bold' : 'normal',
                        color: isPredefined ? '#1976d2' : 'inherit'
                      }}>
                        {option}
                        {isPredefined && <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#666' }}>(Predefined)</span>}
                      </li>
                    );
                  }}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={formData.City}
                    label="City"
                    onChange={(e) => handleInputChange('City', e.target.value)}
                    displayEmpty
                    sx={{width: '200px'}}
                  >
                    <MenuItem value="">
                      {/* <em>Select a city (optional)</em> */}
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={formData.client}
                    label="Client"
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    displayEmpty
                    sx={{width: '200px'}}
                  >
                    <MenuItem value="">
                      {/* <em>Select a client (optional)</em> */}
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client} value={client}>
                        {client}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Site</InputLabel>
                  <Select
                    value={formData.site}
                    label="Site"
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    displayEmpty
                      sx={{width: '200px'}}
                  >
                    <MenuItem value="">
                      {/* <em>Select a site (optional)</em> */}
                    </MenuItem>
                    {sites.map((site) => (
                      <MenuItem key={site} value={site}>
                        {site}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddMapping} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Mapping'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Mapping Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Mapping</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mac ID"
                  value={formData.MacID}
                  onChange={(e) => handleInputChange('MacID', e.target.value)}
                  error={!!formErrors.MacID}
                  helperText={formErrors.MacID}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.SNoutput}
                  onChange={(e) => handleInputChange('SNoutput', e.target.value)}
                  placeholder="Enter serial number (optional)"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={formData.category}
                  onChange={(event, newValue) => handleInputChange('category', newValue)}
                  options={['', ...categories]}
                  getOptionLabel={(option) => option || 'Select a category'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      placeholder="Select from predefined options or enter custom category"
                      sx={{width: '300px'}}
                    />
                  )}
                  renderOption={(props, option) => {
                    const isPredefined = [
                      'Arcade Gaming',
                      'Joy-n-Freedom', 
                      'Sanitary Vending',
                      'Snack Vending',
                      'Beverage Vending'
                    ].includes(option);
                    return (
                      <li {...props} style={{ 
                        fontWeight: isPredefined ? 'bold' : 'normal',
                        color: isPredefined ? '#1976d2' : 'inherit'
                      }}>
                        {option}
                        {isPredefined && <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#666' }}>(Predefined)</span>}
                      </li>
                    );
                  }}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={formData.City}
                    label="City"
                    onChange={(e) => handleInputChange('City', e.target.value)}
                    displayEmpty
                    sx={{width: '200px'}}
                  >
                    <MenuItem value="">
                      {/* <em>Select a city (optional)</em> */}
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={formData.client}
                    label="Client"
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    displayEmpty
                    sx={{width: '200px'}}
                  >
                    <MenuItem value="">
                      {/* <em>Select a client (optional)</em> */}
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client} value={client}>
                        {client}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Site</InputLabel>
                  <Select
                    value={formData.site}
                    label="Site"
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    displayEmpty
                    sx={{width: '200px'}}
                  >
                    <MenuItem value="">
                      {/* <em>Select a site (optional)</em> */}
                    </MenuItem>
                    {sites.map((site) => (
                      <MenuItem key={site} value={site}>
                        {site}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateMapping} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Mapping'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mapping Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DeviceHub color="primary" />
            Mapping Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMapping && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Mac ID</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.MacID}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Serial Number</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.SNoutput || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.category || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">City</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.City || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Client</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.client || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Site</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.site || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Heartbeat</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedMapping.lastHeartBeatTime ? 
                      moment(selectedMapping.lastHeartBeatTime).format('YYYY-MM-DD HH:mm:ss') : 
                      'Never'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {moment(selectedMapping.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {moment(selectedMapping.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Mapping ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedMapping.id}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedMappings.length} selected mapping(s)? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={confirmBulkDelete} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MqttMacMappingTable; 