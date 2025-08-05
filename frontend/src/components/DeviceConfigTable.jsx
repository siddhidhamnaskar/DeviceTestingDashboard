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
  TablePagination
} from '@mui/material';
import {
  Visibility,
  Refresh,
  Search,
  FilterList,
  Clear,
  Download,
  Info
} from '@mui/icons-material';
import moment from 'moment';

const API = process.env.REACT_APP_API || 'http://localhost:3000';

const DeviceConfigTable = () => {
  const [deviceConfigs, setDeviceConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch device configs
  const fetchDeviceConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/device-config`);
      if (!response.ok) {
        throw new Error('Failed to fetch device configs');
      }
      const data = await response.json();
      setDeviceConfigs(data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching device configs:', err);
      setError('Failed to load device configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceConfigs();
  }, []);

  // Filter and search logic
  const filteredConfigs = deviceConfigs.filter(config => {
    const matchesSearch = 
      config.UserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.EmailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.MacId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.MachineId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.Command?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.Response?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'withResponse' && config.Response) ||
      (filterStatus === 'withoutResponse' && !config.Response);

    // Date range filtering
    let matchesDateRange = true;
    if (startDate || endDate) {
      const configDate = moment(config.date);
      
      if (startDate && endDate) {
        matchesDateRange = configDate.isBetween(moment(startDate), moment(endDate), 'day', '[]');
      } else if (startDate) {
        matchesDateRange = configDate.isSameOrAfter(moment(startDate), 'day');
      } else if (endDate) {
        matchesDateRange = configDate.isSameOrBefore(moment(endDate), 'day');
      }
    }

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  // Pagination
  const paginatedConfigs = filteredConfigs.slice(
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

  // View details
  const handleViewDetails = (config) => {
    setSelectedConfig(config);
    setDetailDialogOpen(true);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  // Get command type for display
  const getCommandType = (command) => {
    if (command?.includes('*FW')) return 'Firmware';
    if (command?.includes('*SSID')) return 'SSID Query';
    if (command?.includes('*SS:')) return 'SSID Set';
    if (command?.includes('*SS1:')) return 'SSID1 Set';
    if (command?.includes('*SS2:')) return 'SSID2 Set';
    if (command?.includes('*PW:')) return 'Password Set';
    if (command?.includes('*PW1:')) return 'Password1 Set';
    if (command?.includes('*PW2:')) return 'Password2 Set';
    if (command?.includes('*URL')) return 'URL';
    if (command?.includes('*RST')) return 'Reset';
    if (command?.includes('*RSSI')) return 'Signal Strength';
    if (command?.includes('*QR')) return 'QR Code';
    if (command?.includes('*FOTA')) return 'Firmware Update';
    if (command?.includes('*HBT')) return 'Heartbeat';
    if (command?.includes('*SIP')) return 'SIP';
    return 'Other';
  };

  // Get status chip color
  const getStatusColor = (config) => {
    if (config.Response) return 'success';
    return 'warning';
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'User Name', 'Email', 'MAC ID', 'Machine ID', 'Command', 'Response', 'Date', 'Created At'];
    const csvData = filteredConfigs.map(config => [
      config.id,
      config.UserName,
      config.EmailId,
      config.MacId,
      config.MachineId,
      config.Command,
      config.Response,
      moment(config.date).format('YYYY-MM-DD HH:mm:ss'),
      moment(config.createdAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device-configs-${moment().format('YYYY-MM-DD')}.csv`;
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
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2">
              Device Configuration History
            </Typography>
            <Box>
              <Tooltip title="Export to CSV">
                <IconButton onClick={exportToCSV} color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchDeviceConfigs} color="primary">
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

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                placeholder="Search by user, device, command, or response..."
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
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="withResponse">With Response</MenuItem>
                  <MenuItem value="withoutResponse">Without Response</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearAllFilters}
                startIcon={<Clear />}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {/* Summary */}
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Chip 
              label={`Total: ${deviceConfigs.length}`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={`Filtered: ${filteredConfigs.length}`} 
              color="info" 
              variant="outlined" 
            />
            <Chip 
              label={`With Response: ${deviceConfigs.filter(c => c.Response).length}`} 
              color="success" 
              variant="outlined" 
            />
            <Chip 
              label={`Pending: ${deviceConfigs.filter(c => !c.Response).length}`} 
              color="warning" 
              variant="outlined" 
            />
            {(startDate || endDate) && (
              <Chip 
                label={`Date Range: ${startDate || 'Start'} to ${endDate || 'End'}`} 
                color="secondary" 
                variant="outlined" 
              />
            )}
          </Box>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Command Type</TableCell>
                  <TableCell>Command</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedConfigs.map((config) => (
                  <TableRow key={config.id} hover>
                    <TableCell>{config.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {config.UserName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.EmailId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {config.MachineId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.MacId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getCommandType(config.Command)} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={config.Command}>
                        <Typography variant="body2" sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {config.Command}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={config.Response ? 'Responded' : 'Pending'} 
                        color={getStatusColor(config)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {moment(config.date).format('MMM DD, YYYY')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {moment(config.date).format('HH:mm:ss')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(config)}
                          color="primary"
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
            count={filteredConfigs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
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
        <DialogTitle>
          Device Configuration Details
          <IconButton
            onClick={() => setDetailDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedConfig && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>User Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">User Name</Typography>
                  <Typography variant="body1">{selectedConfig.UserName}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedConfig.EmailId}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Device Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Machine ID</Typography>
                  <Typography variant="body1">{selectedConfig.MachineId}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">MAC ID</Typography>
                  <Typography variant="body1">{selectedConfig.MacId}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Command Details</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Command Type</Typography>
                  <Chip 
                    label={getCommandType(selectedConfig.Command)} 
                    color="primary" 
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Command</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedConfig.Command}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Response</Typography>
                {selectedConfig.Response ? (
                  <Paper sx={{ p: 2, bgcolor: 'green.50' }}>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedConfig.Response}
                    </Typography>
                  </Paper>
                ) : (
                  <Alert severity="warning">
                    No response received yet
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Timestamps</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Command Date</Typography>
                  <Typography variant="body1">
                    {moment(selectedConfig.date).format('MMMM DD, YYYY HH:mm:ss')}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Created At</Typography>
                  <Typography variant="body1">
                    {moment(selectedConfig.createdAt).format('MMMM DD, YYYY HH:mm:ss')}
                  </Typography>
                </Box>
                {selectedConfig.updatedAt && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Updated At</Typography>
                    <Typography variant="body1">
                      {moment(selectedConfig.updatedAt).format('MMMM DD, YYYY HH:mm:ss')}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceConfigTable; 