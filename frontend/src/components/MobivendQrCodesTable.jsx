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
  Divider
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
  QrCode,
  ContentCopy,
  Info,
  Upload,
  CloudUpload,
  CheckBox,
  CheckBoxOutlineBlank
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const MobivendQrCodesTable = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Multiple delete states
  const [selectedQrCodes, setSelectedQrCodes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    QrString: '',
    merchantId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Load all QR codes on component mount
  useEffect(() => {
    loadAllQrCodes();
  }, []);

  // Load all QR codes
  const loadAllQrCodes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/mobivend/qrcodes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch QR codes');
      }

      const result = await response.json();
      setQrCodes(result.data || []);
    } catch (err) {
      console.error('Error loading QR codes:', err);
      setError('Failed to load QR codes. Please try again.');
      setQrCodes([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for QR code by merchant ID
  const searchQrCode = async (merchantId) => {
    if (!merchantId.trim()) {
      setError('Please enter a merchant ID to search');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/mobivend/qrcodes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ merchant_id: merchantId.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const result = await response.json();
      
      if (result.data) {
        setQrCodes([result.data]);
      } else {
        setQrCodes([]);
        setError('No QR code found with this merchant ID');
      }
    } catch (err) {
      console.error('Error searching QR code:', err);
      setError('Failed to search QR code. Please try again.');
      setQrCodes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    searchQrCode(searchTerm);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    loadAllQrCodes();
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
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.QrString.trim()) errors.QrString = 'QR String is required';
    if (!formData.merchantId.trim()) errors.merchantId = 'Merchant ID is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new QR code
  const handleAddQrCode = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API}/mobivend/qrcodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add QR code');
      }

      const result = await response.json();
      setQrCodes(prev => [result.data, ...prev]);
      setAddDialogOpen(false);
      setFormData({ name: '', QrString: '', merchantId: '' });
      setError('');
    } catch (err) {
      console.error('Error adding QR code:', err);
      setError(err.message || 'Failed to add QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View QR code details
  const handleViewDetails = (qrCode) => {
    setSelectedQrCode(qrCode);
    setDetailDialogOpen(true);
  };

  // Edit QR code
  const handleEditQrCode = (qrCode) => {
    setFormData({
      name: qrCode.name || '',
      QrString: qrCode.QrString || '',
      merchantId: qrCode.merchantId || ''
    });
    setSelectedQrCode(qrCode);
    setEditDialogOpen(true);
  };

  // Update QR code
  const handleUpdateQrCode = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API}/mobivend/qrcodes/${selectedQrCode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update QR code');
      }

      const result = await response.json();
      setQrCodes(prev => prev.map(qrCode => 
        qrCode.id === selectedQrCode.id ? result.data : qrCode
      ));
      setEditDialogOpen(false);
      setFormData({ name: '', QrString: '', merchantId: '' });
      setSelectedQrCode(null);
      setError('');
    } catch (err) {
      console.error('Error updating QR code:', err);
      setError(err.message || 'Failed to update QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete QR code
  const handleDeleteQrCode = async (qrCode) => {
    if (!window.confirm(`Are you sure you want to delete QR code "${qrCode.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API}/mobivend/qrcodes/${qrCode.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete QR code');
      }

      setQrCodes(prev => prev.filter(q => q.id !== qrCode.id));
      setError('');
    } catch (err) {
      console.error('Error deleting QR code:', err);
      setError(err.message || 'Failed to delete QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Multiple delete functions
  const handleSelectQrCode = (qrCodeId) => {
    setSelectedQrCodes(prev => 
      prev.includes(qrCodeId) 
        ? prev.filter(id => id !== qrCodeId)
        : [...prev, qrCodeId]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedQrCodes.map(qrCode => qrCode.id);
    setSelectedQrCodes(prev => 
      currentPageIds.every(id => prev.includes(id))
        ? prev.filter(id => !currentPageIds.includes(id))
        : [...new Set([...prev, ...currentPageIds])]
    );
  };

  const handleBulkDelete = () => {
    if (selectedQrCodes.length === 0) {
      setError('Please select QR codes to delete');
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

      for (const qrCodeId of selectedQrCodes) {
        try {
          const response = await fetch(`${API}/mobivend/qrcodes/${qrCodeId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            results.push(qrCodeId);
          } else {
            const errorData = await response.json();
            errors.push({ 
              id: qrCodeId, 
              error: errorData.error || 'Failed to delete QR code'
            });
          }
        } catch (err) {
          errors.push({ 
            id: qrCodeId, 
            error: 'Network error'
          });
        }
      }

      // Update the QR codes list
      setQrCodes(prev => prev.filter(qrCode => !selectedQrCodes.includes(qrCode.id)));
      
      // Clear selection
      setSelectedQrCodes([]);
      setDeleteDialogOpen(false);

      // Show results
      if (results.length > 0) {
        setError(`Successfully deleted ${results.length} QR code(s).`);
        setTimeout(() => setError(''), 3000);
      }
      
      if (errors.length > 0) {
        console.error('Some QR codes could not be deleted:', errors);
        setError(`Failed to delete ${errors.length} QR code(s). Check console for details.`);
      }
    } catch (err) {
      console.error('Error in bulk delete:', err);
      setError('An error occurred during bulk delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Copy QR string to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('QR String copied to clipboard');
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    if (qrCodes.length === 0) {
      setError('No data to export');
      return;
    }

    const headers = ['ID', 'Name', 'QR String', 'Merchant ID', 'Created At', 'Updated At'];
    const csvData = qrCodes.map(qrCode => [
      qrCode.id,
      qrCode.name,
      qrCode.QrString,
      qrCode.merchantId,
      moment(qrCode.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      moment(qrCode.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobivend-qrcodes-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Validate required fields
      const rowErrors = [];
      if (!row.Name || row.Name.trim() === '') {
        rowErrors.push('Name is required');
      }
      if (!row['QR String'] || row['QR String'].trim() === '') {
        rowErrors.push('QR String is required');
      }
      if (!row['Merchant ID'] || row['Merchant ID'].trim() === '') {
        rowErrors.push('Merchant ID is required');
      }

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors, data: row });
      } else {
        data.push({
          name: row.Name.trim(),
          QrString: row['QR String'].trim(),
          merchantId: row['Merchant ID'].trim()
        });
      }
    }

    return { data, errors };
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { data, errors } = parseCSV(e.target.result);
        
        if (errors.length > 0) {
          setImportErrors(errors);
          setError(`CSV file has ${errors.length} validation errors. Please fix them and try again.`);
          return;
        }

        if (data.length === 0) {
          setError('No valid data found in CSV file');
          return;
        }

        setImportData(data);
        setImportErrors([]);
        setError('');
        setImportDialogOpen(true);
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setError('Error parsing CSV file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Import QR codes
  const handleImportQrCodes = async () => {
    if (importData.length === 0) {
      setError('No data to import');
      return;
    }

    try {
      setImporting(true);
      setError('');
      
      const results = [];
      const errors = [];

      for (let i = 0; i < importData.length; i++) {
        const qrCode = importData[i];
        
        try {
          const response = await fetch(`${API}/mobivend/qrcodes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(qrCode)
          });

          if (response.ok) {
            const result = await response.json();
            results.push({ row: i + 1, success: true, data: result.data });
          } else {
            const errorData = await response.json();
            errors.push({ 
              row: i + 1, 
              error: errorData.error || 'Failed to create QR code',
              data: qrCode 
            });
          }
        } catch (err) {
          errors.push({ 
            row: i + 1, 
            error: 'Network error', 
            data: qrCode 
          });
        }
      }

      // Show results
      if (results.length > 0) {
        // Reload QR codes to show new ones
        await loadAllQrCodes();
        setError('');
      }

      if (errors.length > 0) {
        setImportErrors(errors);
        setError(`Import completed with ${errors.length} errors. ${results.length} QR codes imported successfully.`);
      } else {
        setError(`Successfully imported ${results.length} QR codes!`);
      }

      setImportDialogOpen(false);
      setImportData([]);
      setImportErrors([]);
    } catch (err) {
      console.error('Error importing QR codes:', err);
      setError('Error during import. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  // Pagination
  const paginatedQrCodes = qrCodes.slice(
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
            <Box display="flex" alignItems="center" gap={1}>
              <QrCode color="primary" />
              <Typography variant="h5" component="h1" fontWeight="bold">
                QR Codes
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToCSV}
                disabled={qrCodes.length === 0}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                component="label"
                disabled={importing}
              >
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                disabled={selectedQrCodes.length === 0}
              >
                Delete Selected ({selectedQrCodes.length})
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddDialogOpen(true)}
              >
                Add QR Code
              </Button>
            </Box>
          </Box>

          {/* Search Section */}
          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search by Merchant ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter merchant ID..."
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
                    onClick={loadAllQrCodes}
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

          {/* QR Codes Table */}
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
                          disabled={paginatedQrCodes.length === 0}
                        >
                          {paginatedQrCodes.length > 0 && paginatedQrCodes.every(qrCode => selectedQrCodes.includes(qrCode.id)) ? (
                            <CheckBox color="primary" />
                          ) : (
                            <CheckBoxOutlineBlank />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>QR String</strong></TableCell>
                      <TableCell><strong>Merchant ID</strong></TableCell>
                      <TableCell><strong>Created At</strong></TableCell>
                      <TableCell><strong>Updated At</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedQrCodes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            {qrCodes.length === 0 ? 'No QR codes found. Add a QR code to get started.' : 'No QR codes match your search criteria'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedQrCodes.map((qrCode) => (
                        <TableRow key={qrCode.id} hover>
                          <TableCell padding="checkbox">
                            <IconButton
                              size="small"
                              onClick={() => handleSelectQrCode(qrCode.id)}
                            >
                              {selectedQrCodes.includes(qrCode.id) ? (
                                <CheckBox color="primary" />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {qrCode.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontFamily: 'monospace', 
                                  fontSize: '0.75rem',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {qrCode.QrString}
                              </Typography>
                              <Tooltip title="Copy QR String">
                                <IconButton 
                                  size="small" 
                                  onClick={() => copyToClipboard(qrCode.QrString)}
                                  color="primary"
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={qrCode.merchantId} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {moment(qrCode.createdAt).format('YYYY-MM-DD HH:mm')}
                          </TableCell>
                          <TableCell>
                            {moment(qrCode.updatedAt).format('YYYY-MM-DD HH:mm')}
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewDetails(qrCode)}
                                  color="primary"
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit QR Code">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditQrCode(qrCode)}
                                  color="secondary"
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete QR Code">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteQrCode(qrCode)}
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
              {qrCodes.length > 0 && (
                <TablePagination
                  component="div"
                  count={qrCodes.length}
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

      {/* Add QR Code Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="QR String"
                  value={formData.QrString}
                  onChange={(e) => handleInputChange('QrString', e.target.value)}
                  error={!!formErrors.QrString}
                  helperText={formErrors.QrString}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Merchant ID"
                  value={formData.merchantId}
                  onChange={(e) => handleInputChange('merchantId', e.target.value)}
                  error={!!formErrors.merchantId}
                  helperText={formErrors.merchantId}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddQrCode} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add QR Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit QR Code Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="QR String"
                  value={formData.QrString}
                  onChange={(e) => handleInputChange('QrString', e.target.value)}
                  error={!!formErrors.QrString}
                  helperText={formErrors.QrString}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Merchant ID"
                  value={formData.merchantId}
                  onChange={(e) => handleInputChange('merchantId', e.target.value)}
                  error={!!formErrors.merchantId}
                  helperText={formErrors.merchantId}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateQrCode} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update QR Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <QrCode color="primary" />
            QR Code Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedQrCode && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedQrCode.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Merchant ID</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {selectedQrCode.merchantId}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">QR String</Typography>
                  <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        backgroundColor: 'grey.100',
                        p: 1,
                        borderRadius: 1,
                        flex: 1,
                        wordBreak: 'break-all'
                      }}
                    >
                      {selectedQrCode.QrString}
                    </Typography>
                    <Tooltip title="Copy QR String">
                      <IconButton 
                        onClick={() => copyToClipboard(selectedQrCode.QrString)}
                        color="primary"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {moment(selectedQrCode.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {moment(selectedQrCode.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">QR Code ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedQrCode.id}
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
            <CloudUpload color="primary" />
            Import QR Codes from CSV
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              CSV Format: Name, QR String, Merchant ID
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Preview ({importData.length} QR codes to import)
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>QR String</strong></TableCell>
                    <TableCell><strong>Merchant ID</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importData.map((qrCode, index) => (
                    <TableRow key={index}>
                      <TableCell>{qrCode.name}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {qrCode.QrString}
                        </Typography>
                      </TableCell>
                      <TableCell>{qrCode.merchantId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {importErrors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                  Import Errors ({importErrors.length})
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {importErrors.map((error, index) => (
                    <Alert key={index} severity="error" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Row {error.row}:</strong> {error.error}
                      </Typography>
                      {error.data && (
                        <Typography variant="caption" display="block">
                          Data: {error.data.name}, {error.data.QrString}, {error.data.merchantId}
                        </Typography>
                      )}
                    </Alert>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)} disabled={importing}>
            Cancel
          </Button>
          <Button 
            onClick={handleImportQrCodes} 
            variant="contained" 
            disabled={importing || importData.length === 0}
            startIcon={importing ? <CircularProgress size={20} /> : <CloudUpload />}
          >
            {importing ? 'Importing...' : `Import ${importData.length} QR Codes`}
          </Button>
        </DialogActions>
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
              Are you sure you want to delete <strong>{selectedQrCodes.length}</strong> selected QR code(s)?
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action cannot be undone. The selected QR codes will be permanently removed from the system.
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Selected QR Codes: {selectedQrCodes.length}
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
            {deleting ? 'Deleting...' : `Delete ${selectedQrCodes.length} QR Code(s)`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobivendQrCodesTable; 