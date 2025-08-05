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

const MobivendDeviceTable = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Form states
  const [formData, setFormData] = useState({
    serial: '',
    merchantId: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [merchantIds, setMerchantIds] = useState([]);
  const [loadingMerchantIds, setLoadingMerchantIds] = useState(false);
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
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load all devices on component mount
  useEffect(() => {
    loadAllDevices();
    loadMerchantIds();
  }, []);

  // Load merchant IDs from existing devices and QR codes
  const loadMerchantIds = async () => {
    try {
      setLoadingMerchantIds(true);
      
      // Get merchant IDs from devices
      const devicesResponse = await fetch(`${API}/mobivend/devices`);
      const devicesData = await devicesResponse.json();
      
      // Get merchant IDs from QR codes
      const qrCodesResponse = await fetch(`${API}/mobivend/qrcodes`);
      const qrCodesData = await qrCodesResponse.json();
      
      // Extract unique merchant IDs
      const deviceMerchantIds = (devicesData.data || []).map(device => device.merchantId);
      const qrCodeMerchantIds = (qrCodesData.data || []).map(qrCode => qrCode.merchantId);
      
      // Combine and deduplicate
      const allMerchantIds = [...deviceMerchantIds, ...qrCodeMerchantIds];
      const uniqueMerchantIds = [...new Set(allMerchantIds)].filter(id => id).sort();
      
      // Add some common merchant IDs if none exist
      const commonMerchantIds = [];
      const allIds = [...uniqueMerchantIds, ...commonMerchantIds];
      const finalMerchantIds = [...new Set(allIds)].sort();
      
      setMerchantIds(finalMerchantIds);
    } catch (err) {
      console.error('Error loading merchant IDs:', err);
      // Fallback to common merchant IDs if API fails
      setMerchantIds(['MERCH001', 'MERCH002', 'MERCH003', 'MERCH004', 'MERCH005']);
    } finally {
      setLoadingMerchantIds(false);
    }
  };

  // Load all devices
  const loadAllDevices = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/mobivend/devices`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }

      const result = await response.json();
      setDevices(result.data || []);
    } catch (err) {
      console.error('Error loading devices:', err);
      setError('Failed to load devices. Please try again.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for device by serial number
  const searchDevice = async (serial) => {
    if (!serial.trim()) {
      setError('Please enter a serial number to search');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/mobivend/devices/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serial: serial.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch device');
      }

      const result = await response.json();
      
      if (result.data) {
        setDevices([result.data]);
      } else {
        setDevices([]);
        setError('No device found with this serial number');
      }
    } catch (err) {
      console.error('Error searching device:', err);
      setError('Failed to search device. Please try again.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    searchDevice(searchTerm);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    loadAllDevices();
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
    if (!formData.serial.trim()) errors.serial = 'Serial number is required';
    
    if (formData.merchantId === 'custom') {
      if (!formData.customMerchantId?.trim()) {
        errors.merchantId = 'Custom merchant ID is required';
      }
    } else if (!formData.merchantId.trim()) {
      errors.merchantId = 'Merchant ID is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new device
  const handleAddDevice = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Prepare the data to send
      const deviceData = {
        serial: formData.serial.trim(),
        merchantId: formData.merchantId === 'custom' ? formData.customMerchantId.trim() : formData.merchantId,
        category: formData.category.trim() || null
      };
      
      const response = await fetch(`${API}/mobivend/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add device');
      }

      const result = await response.json();
      setDevices(prev => [result.data, ...prev]);
      setAddDialogOpen(false);
      setFormData({ serial: '', merchantId: '', customMerchantId: '' });
      setError('');
    } catch (err) {
      console.error('Error adding device:', err);
      setError(err.message || 'Failed to add device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View device details
  const handleViewDetails = (device) => {
    setSelectedDevice(device);
    setDetailDialogOpen(true);
  };

  // Edit device
  const handleEditDevice = (device) => {
    setFormData({
      serial: device.serial || '',
      merchantId: device.merchantId || '',
      category: device.category || '',
      customMerchantId: ''
    });
    setSelectedDevice(device);
    setEditDialogOpen(true);
  };

  // Update device
  const handleUpdateDevice = async () => {
    if (!validateForm() || !selectedDevice) return;

    try {
      setLoading(true);
      
      // Prepare the data to send
      const deviceData = {
        serial: formData.serial.trim(),
        merchantId: formData.merchantId === 'custom' ? formData.customMerchantId.trim() : formData.merchantId,
        category: formData.category.trim() || null
      };
      
      const response = await fetch(`${API}/mobivend/devices/${selectedDevice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update device');
      }

      const result = await response.json();
      setDevices(prev => prev.map(device => 
        device.id === selectedDevice.id ? result.data : device
      ));
      setEditDialogOpen(false);
      setFormData({ serial: '', merchantId: '', category: '', customMerchantId: '' });
      setSelectedDevice(null);
      setError('');
    } catch (err) {
      console.error('Error updating device:', err);
      setError(err.message || 'Failed to update device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete device
  const handleDeleteDevice = async (device) => {
    if (!window.confirm(`Are you sure you want to delete device with serial ${device.serial}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API}/mobivend/devices/${device.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete device');
      }

      setDevices(prev => prev.filter(d => d.id !== device.id));
      setError('');
    } catch (err) {
      console.error('Error deleting device:', err);
      setError(err.message || 'Failed to delete device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Multiple delete functions
  const handleSelectDevice = (deviceId) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedDevices.map(device => device.id);
    setSelectedDevices(prev => 
      currentPageIds.every(id => prev.includes(id))
        ? prev.filter(id => !currentPageIds.includes(id))
        : [...new Set([...prev, ...currentPageIds])]
    );
  };

  const handleBulkDelete = () => {
    if (selectedDevices.length === 0) {
      setError('Please select devices to delete');
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setDeleting(true);
      setError('');
      
      const results = [];
      const errors = [];

      for (const deviceId of selectedDevices) {
        try {
          const response = await fetch(`${API}/mobivend/devices/${deviceId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            results.push(deviceId);
          } else {
            const errorData = await response.json();
            errors.push({ 
              id: deviceId, 
              error: errorData.error || 'Failed to delete device'
            });
          }
        } catch (err) {
          errors.push({ 
            id: deviceId, 
            error: 'Network error'
          });
        }
      }

      // Update the devices list
      setDevices(prev => prev.filter(device => !selectedDevices.includes(device.id)));
      
      // Clear selection
      setSelectedDevices([]);
      setDeleteDialogOpen(false);

      // Show results
      if (results.length > 0) {
        setError(`Successfully deleted ${results.length} device(s).`);
        setTimeout(() => setError(''), 3000);
      }
      
      if (errors.length > 0) {
        console.error('Some devices could not be deleted:', errors);
        setError(`Failed to delete ${errors.length} device(s). Check console for details.`);
      }
    } catch (err) {
      console.error('Error in bulk delete:', err);
      setError('An error occurred during bulk delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (devices.length === 0) {
      setError('No data to export');
      return;
    }

    const headers = ['ID', 'Serial Number', 'Merchant ID', 'Category', 'Created At', 'Updated At'];
    const csvData = devices.map(device => [
      device.id,
      device.serial,
      device.merchantId,
      device.category || '',
      moment(device.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      moment(device.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobivend-devices-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const paginatedDevices = devices.slice(
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

  // Import CSV functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      parseCSV(csv);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const data = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      // Validate required fields
      const rowErrors = [];
      if (!row.serial || !row.serial.trim()) {
        rowErrors.push('Serial number is required');
      }
      if (!row.merchantId || !row.merchantId.trim()) {
        rowErrors.push('Merchant ID is required');
      }
      
      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors });
      }
      
      data.push(row);
    }
    
    setImportData(data);
    setImportPreview(data.slice(0, 5)); // Show first 5 rows as preview
    setImportErrors(errors);
  };

  const handleImportDevices = async () => {
    if (importData.length === 0) return;
    
    try {
      setImportLoading(true);
      const results = [];
      
      for (const device of importData) {
        try {
          const response = await fetch(`${API}/mobivend/devices`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serial: device.serial.trim(),
              merchantId: device.merchantId.trim(),
              category: device.category?.trim() || null
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            results.push({ success: true, data: result.data });
          } else {
            const errorData = await response.json();
            results.push({ success: false, error: errorData.error || 'Failed to import device' });
          }
        } catch (err) {
          results.push({ success: false, error: err.message || 'Network error' });
        }
      }
      
      // Count successes and failures
      const successes = results.filter(r => r.success).length;
      const failures = results.filter(r => !r.success).length;
      
      if (failures === 0) {
        setError('');
        setSnackbar({
          open: true,
          message: `Successfully imported ${successes} devices`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: `Imported ${successes} devices, ${failures} failed`,
          severity: 'warning'
        });
      }
      
      setImportDialogOpen(false);
      setImportData([]);
      setImportPreview([]);
      setImportErrors([]);
      loadAllDevices(); // Refresh the devices list
      
    } catch (err) {
      console.error('Error importing devices:', err);
      setError('Failed to import devices. Please try again.');
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <DeviceHub color="primary" />
              <Typography variant="h5" component="h1" fontWeight="bold">
                QR Code Devices
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => setImportDialogOpen(true)}
              >
                Import CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToCSV}
                disabled={devices.length === 0}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                disabled={selectedDevices.length === 0}
              >
                Delete Selected ({selectedDevices.length})
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddDialogOpen(true)}
              >
                Add Device
              </Button>
            </Box>
          </Box>

          {/* Search Section */}
          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search by Serial Number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter device serial number..."
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
                    onClick={loadAllDevices}
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

          {/* Devices Table */}
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
                          disabled={paginatedDevices.length === 0}
                        >
                          {paginatedDevices.length > 0 && paginatedDevices.every(device => selectedDevices.includes(device.id)) ? (
                            <CheckBox color="primary" />
                          ) : (
                            <CheckBoxOutlineBlank />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell><strong>Serial Number</strong></TableCell>
                      <TableCell><strong>Merchant ID</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Created At</strong></TableCell>
                      <TableCell><strong>Updated At</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            {devices.length === 0 ? 'No devices found. Add a device to get started.' : 'No devices match your search criteria'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedDevices.map((device) => (
                        <TableRow key={device.id} hover>
                          <TableCell padding="checkbox">
                            <IconButton
                              size="small"
                              onClick={() => handleSelectDevice(device.id)}
                            >
                              {selectedDevices.includes(device.id) ? (
                                <CheckBox color="primary" />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {device.serial}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={device.merchantId} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {device.category ? (
                              <Chip 
                                label={device.category} 
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
                            {moment(device.createdAt).format('YYYY-MM-DD HH:mm')}
                          </TableCell>
                          <TableCell>
                            {moment(device.updatedAt).format('YYYY-MM-DD HH:mm')}
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewDetails(device)}
                                  color="primary"
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Device">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditDevice(device)}
                                  color="secondary"
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Device">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteDevice(device)}
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
              {devices.length > 0 && (
                <TablePagination
                  component="div"
                  count={devices.length}
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

      {/* Add Device Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.serial}
                  onChange={(e) => handleInputChange('serial', e.target.value)}
                  error={!!formErrors.serial}
                  helperText={formErrors.serial}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={formData.merchantId}
                  onChange={(event, newValue) => handleInputChange('merchantId', newValue)}
                  options={['', ...merchantIds, 'custom']}
                  getOptionLabel={(option) => {
                    if (option === '') return 'Select a merchant ID';
                    if (option === 'custom') return '+ Add Custom Merchant ID';
                    return option;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Merchant ID"
                      required
                      error={!!formErrors.merchantId}
                      helperText={formErrors.merchantId}
                      disabled={loadingMerchantIds}
                      sx={{width: '300px'}}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option === '' ? (
                        <em>Select a merchant ID</em>
                      ) : option === 'custom' ? (
                        <em>+ Add Custom Merchant ID</em>
                      ) : (
                        option
                      )}
                    </li>
                  )}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                />
              </Grid>
              {formData.merchantId === 'custom' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Custom Merchant ID"
                    value={formData.customMerchantId || ''}
                    onChange={(e) => handleInputChange('customMerchantId', e.target.value)}
                    placeholder="Enter custom merchant ID"
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter device category (optional)"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddDevice} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Device'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.serial}
                  onChange={(e) => handleInputChange('serial', e.target.value)}
                  error={!!formErrors.serial}
                  helperText={formErrors.serial}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={formData.merchantId}
                  onChange={(event, newValue) => handleInputChange('merchantId', newValue)}
                  options={['', ...merchantIds, 'custom']}
                  getOptionLabel={(option) => {
                    if (option === '') return 'Select a merchant ID';
                    if (option === 'custom') return '+ Add Custom Merchant ID';
                    return option;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Merchant ID"
                      required
                      error={!!formErrors.merchantId}
                      helperText={formErrors.merchantId}
                      disabled={loadingMerchantIds}
                      sx={{width: '300px'}}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option === '' ? (
                        <em>Select a merchant ID</em>
                      ) : option === 'custom' ? (
                        <em>+ Add Custom Merchant ID</em>
                      ) : (
                        option
                      )}
                    </li>
                  )}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                />
              </Grid>
              {formData.merchantId === 'custom' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Custom Merchant ID"
                    value={formData.customMerchantId || ''}
                    onChange={(e) => handleInputChange('customMerchantId', e.target.value)}
                    placeholder="Enter custom merchant ID"
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter device category (optional)"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateDevice} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Device'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DeviceHub color="primary" />
            Device Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDevice && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Serial Number</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedDevice.serial}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Merchant ID</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedDevice.merchantId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedDevice.category || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {moment(selectedDevice.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {moment(selectedDevice.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Device ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedDevice.id}
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

      {/* Import CSV Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Upload color="primary" />
            Import Devices from CSV
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload a CSV file with the following columns: <strong>serial, merchantId, category</strong> (category is optional)
                </Typography>
                <input
                  accept=".csv"
                  style={{ display: 'none' }}
                  id="csv-file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="csv-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                    fullWidth
                  >
                    Choose CSV File
                  </Button>
                </label>
              </Grid>

              {importData.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Preview ({importData.length} devices to import)
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'grey.50' }}>
                            <TableCell><strong>Serial Number</strong></TableCell>
                            <TableCell><strong>Merchant ID</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {importPreview.map((device, index) => (
                            <TableRow key={index} hover>
                              <TableCell>{device.serial}</TableCell>
                              <TableCell>{device.merchantId}</TableCell>
                              <TableCell>{device.category || '-'}</TableCell>
                            </TableRow>
                          ))}
                          {importData.length > 5 && (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  ... and {importData.length - 5} more devices
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {importErrors.length > 0 && (
                    <Grid item xs={12}>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Validation Errors ({importErrors.length} rows have issues):
                        </Typography>
                        {importErrors.slice(0, 5).map((error, index) => (
                          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                            Row {error.row}: {error.errors.join(', ')}
                          </Typography>
                        ))}
                        {importErrors.length > 5 && (
                          <Typography variant="body2">
                            ... and {importErrors.length - 5} more errors
                          </Typography>
                        )}
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end">
                      <Button
                        onClick={() => {
                          setImportDialogOpen(false);
                          setImportData([]);
                          setImportPreview([]);
                          setImportErrors([]);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleImportDevices}
                        variant="contained"
                        disabled={importLoading || importErrors.length > 0}
                        startIcon={importLoading ? <CircularProgress size={20} /> : <Upload />}
                      >
                        {importLoading ? 'Importing...' : `Import ${importData.length} Devices`}
                      </Button>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" />
            Confirm Bulk Delete
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete <strong>{selectedDevices.length}</strong> selected device(s)?
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action cannot be undone. The selected devices will be permanently removed from the system.
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Selected Devices: {selectedDevices.length}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={confirmBulkDelete} 
            variant="contained" 
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : `Delete ${selectedDevices.length} Device(s)`}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobivendDeviceTable; 