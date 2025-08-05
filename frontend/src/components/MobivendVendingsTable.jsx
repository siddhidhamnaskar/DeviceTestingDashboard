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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  TablePagination,
  Fab,
  Snackbar
} from '@mui/material';
import {
  Visibility,
  Refresh,
  Search,
  Clear,
  Download,
  Add
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const MobivendVendingsTable = () => {
  const [vendings, setVendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVending, setSelectedVending] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [newVending, setNewVending] = useState({
    serial: '',
    txnId: '',
    SID: '',
    price: '',
    spiralNumber: ''
  });

  // Fetch vendings
  const fetchVendings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: rowsPerPage,
        offset: page * rowsPerPage
      });

      if (searchTerm) {
        // Search across multiple fields
        params.append('serial', searchTerm);
      }

      const response = await fetch(`${API}/mobivend/vendings?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendings');
      }
      const data = await response.json();
      setVendings(data.data || []);
      setTotalCount(data.pagination?.total || 0);
      setError('');
    } catch (err) {
      console.error('Error fetching vendings:', err);
      setError('Failed to load vendings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendings();
  }, [page, rowsPerPage, searchTerm]);

  // Create new vending
  const createVending = async () => {
    try {
      const response = await fetch(`${API}/mobivend/vendings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVending),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create vending record');
      }

      setSnackbar({
        open: true,
        message: 'Vending record created successfully',
        severity: 'success'
      });
      setCreateDialogOpen(false);
      setNewVending({
        serial: '',
        txnId: '',
        SID: '',
        price: '',
        spiralNumber: ''
      });
      fetchVendings();
    } catch (err) {
      console.error('Error creating vending:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    }
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // View details
  const handleViewDetails = (vending) => {
    setSelectedVending(vending);
    setDetailDialogOpen(true);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Get price display
  const getPriceDisplay = (price) => {
    if (!price) return '-';
    return `${parseFloat(price).toFixed(2)/100}`;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Serial', 'Transaction ID', 'SID', 'Price', 'Spiral Number', 'Created At'];
    const csvData = vendings.map(vending => [
      vending.id,
      vending.serial,
      vending.txnId,
      vending.SID,
      vending.price,
      vending.spiralNumber,
      moment(vending.createdAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobivend-vendings-${moment().format('YYYY-MM-DD')}.csv`;
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
            <Typography variant="h5" component="h2">
              MobiVend Vendings
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToCSV}
                sx={{ mr: 1 }}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchVendings}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Serial/Transaction ID/SID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearAllFilters}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Transaction ID</TableCell>
                
                  <TableCell>Price</TableCell>
                  <TableCell>Spiral Number</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendings.map((vending) => (
                  <TableRow key={vending.id}>
                    <TableCell>{vending.id}</TableCell>
                    <TableCell>{vending.serial || '-'}</TableCell>
                    <TableCell>{vending.txnId}</TableCell>
                   
                    <TableCell>
                      <Chip
                        label={getPriceDisplay(vending.price)}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{vending.spiralNumber || '-'}</TableCell>
                    <TableCell>
                      {moment(vending.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(vending)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Vending Details</DialogTitle>
        <DialogContent>
          {selectedVending && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                <Typography variant="body1">{selectedVending.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Serial</Typography>
                <Typography variant="body1">{selectedVending.serial || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Transaction ID</Typography>
                <Typography variant="body1">{selectedVending.txnId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">SID</Typography>
                <Typography variant="body1">{selectedVending.SID || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                <Chip
                  label={getPriceDisplay(selectedVending.price)}
                  color="primary"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Spiral Number</Typography>
                <Typography variant="body1">{selectedVending.spiralNumber || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                <Typography variant="body1">
                  {moment(selectedVending.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Updated At</Typography>
                <Typography variant="body1">
                  {moment(selectedVending.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Vending Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Vending Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Serial"
                value={newVending.serial}
                onChange={(e) => setNewVending({...newVending, serial: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID *"
                value={newVending.txnId}
                onChange={(e) => setNewVending({...newVending, txnId: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SID"
                value={newVending.SID}
                onChange={(e) => setNewVending({...newVending, SID: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                step="0.01"
                value={newVending.price}
                onChange={(e) => setNewVending({...newVending, price: e.target.value})}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Spiral Number"
                value={newVending.spiralNumber}
                onChange={(e) => setNewVending({...newVending, spiralNumber: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createVending}
            variant="contained"
            disabled={!newVending.txnId}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Snackbar */}
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

export default MobivendVendingsTable; 