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
  FilterList,
  Clear,
  Download,
  Info,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const MobiVendTxnsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTxnType, setFilterTxnType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state for creating new transaction
  const [newTransaction, setNewTransaction] = useState({
    qrCodeId: '',
    serial: '',
    txnId: '',
    txnType: '',
    status: '',
    amount: '',
    VendingStatus: ''
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: rowsPerPage,
        offset: page * rowsPerPage
      });

      if (searchTerm) params.append('serial', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterTxnType !== 'all') params.append('txnType', filterTxnType);

      const response = await fetch(`${API}/mobivend/transactions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.data || []);
      setTotalCount(data.pagination?.total || 0);
      setError('');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, searchTerm, filterStatus, filterTxnType]);

  // Create new transaction
  const createTransaction = async () => {
    try {
      const response = await fetch(`${API}/mobivend/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: 'Transaction created successfully',
        severity: 'success'
      });
      setCreateDialogOpen(false);
      setNewTransaction({
        qrCodeId: '',
        serial: '',
        txnId: '',
        txnType: '',
        status: '',
        amount: '',
        VendingStatus: ''
      });
      fetchTransactions();
    } catch (err) {
      console.error('Error creating transaction:', err);
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
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailDialogOpen(true);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterTxnType('all');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'failed':
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get transaction type chip color
  const getTxnTypeColor = (txnType) => {
    switch (txnType?.toLowerCase()) {
      case 'payment':
        return 'primary';
      case 'refund':
        return 'secondary';
      case 'reversal':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get vending status chip color
  const getVendingStatusColor = (vendingStatus) => {
    switch (vendingStatus?.toLowerCase()) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'error':
      case 'failed_to_vend':
        return 'error';
      case 'out_of_stock':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Get vending status display text
  const getVendingStatusDisplay = (vendingStatus) => {
    if (!vendingStatus) return 'PENDING';
    
    switch (vendingStatus.toLowerCase()) {
      case 'success':
        return 'SUCCESS';
      case 'pending':
      case 'processing':
        return 'PENDING';
      case 'failed':
      case 'error':
      case 'failed_to_vend':
        return 'FAILED';
      case 'out_of_stock':
        return 'OUT OF STOCK';
      case 'completed':
        return 'COMPLETED';
      default:
        return 'PENDING';
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'QR Code ID', 'Serial', 'Transaction ID', 'Type', 'Status', 'Amount', 'Vending Status', 'Created At'];
    const csvData = transactions.map(txn => [
      txn.id,
      txn.qrCodeId,
      txn.serial,
      txn.txnId,
      txn.txnType,
      txn.status,
      txn.amount,
      getVendingStatusDisplay(txn.VendingStatus),
      moment(txn.createdAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobivend-transactions-${moment().format('YYYY-MM-DD')}.csv`;
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
              MobiVend Transactions
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
                onClick={fetchTransactions}
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

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Serial/QR Code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterTxnType}
                  label="Type"
                  onChange={(e) => setFilterTxnType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="reversal">Reversal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
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
                  <TableCell>QR Code ID</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Vending Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.id}</TableCell>
                    <TableCell>{txn.qrCodeId || '-'}</TableCell>
                    <TableCell>{txn.serial || '-'}</TableCell>
                    <TableCell>{txn.txnId}</TableCell>
                    <TableCell>
                      <Chip
                        label={txn.txnType || 'Unknown'}
                        color={getTxnTypeColor(txn.txnType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={txn.status || 'Unknown'}
                        color={getStatusColor(txn.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{parseFloat(txn.amount)/100 || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getVendingStatusDisplay(txn.VendingStatus)}
                        color={getVendingStatusColor(txn.VendingStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {moment(txn.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(txn)}
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

          {/* Pagination */}
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
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                <Typography variant="body1">{selectedTransaction.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">QR Code ID</Typography>
                <Typography variant="body1">{selectedTransaction.qrCodeId || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Serial</Typography>
                <Typography variant="body1">{selectedTransaction.serial || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Transaction ID</Typography>
                <Typography variant="body1">{selectedTransaction.txnId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Type</Typography>
                <Chip
                  label={selectedTransaction.txnType || 'Unknown'}
                  color={getTxnTypeColor(selectedTransaction.txnType)}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip
                  label={selectedTransaction.status || 'Unknown'}
                  color={getStatusColor(selectedTransaction.status)}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Amount</Typography>
                <Typography variant="body1">{selectedTransaction.amount || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Vending Status</Typography>
                <Chip
                  label={getVendingStatusDisplay(selectedTransaction.VendingStatus)}
                  color={getVendingStatusColor(selectedTransaction.VendingStatus)}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                <Typography variant="body1">
                  {moment(selectedTransaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Updated At</Typography>
                <Typography variant="body1">
                  {moment(selectedTransaction.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Transaction Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="QR Code ID"
                value={newTransaction.qrCodeId}
                onChange={(e) => setNewTransaction({...newTransaction, qrCodeId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Serial"
                value={newTransaction.serial}
                onChange={(e) => setNewTransaction({...newTransaction, serial: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID *"
                value={newTransaction.txnId}
                onChange={(e) => setNewTransaction({...newTransaction, txnId: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newTransaction.txnType}
                  label="Type"
                  onChange={(e) => setNewTransaction({...newTransaction, txnType: e.target.value})}
                >
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="reversal">Reversal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTransaction.status}
                  label="Status"
                  onChange={(e) => setNewTransaction({...newTransaction, status: e.target.value})}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vending Status</InputLabel>
                <Select
                  value={newTransaction.VendingStatus}
                  label="Vending Status"
                  onChange={(e) => setNewTransaction({...newTransaction, VendingStatus: e.target.value})}
                >
                  <MenuItem value="pending">PENDING</MenuItem>
                  <MenuItem value="success">SUCCESS</MenuItem>
                  <MenuItem value="failed">FAILED</MenuItem>
                  <MenuItem value="processing">PROCESSING</MenuItem>
                  <MenuItem value="out_of_stock">OUT OF STOCK</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createTransaction}
            variant="contained"
            disabled={!newTransaction.txnId}
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

export default MobiVendTxnsTable; 