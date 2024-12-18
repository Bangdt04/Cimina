import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
  TablePagination,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: {
      main: '#1976d2', // Màu xanh chủ đạo
    },
    secondary: {
      main: '#dc004e', // Màu đỏ cho các trạng thái
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: 14,
    },
  },
});

const SeatPriceData = () => {
  const [seatPrices, setSeatPrices] = useState([]);
  const [filteredSeatPrices, setFilteredSeatPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [seatTypeFilter, setSeatTypeFilter] = useState('');
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState('');

  // States for sorting
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  // States for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch data from the API
  useEffect(() => {
    const fetchSeatPrices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/seat-price-all');
        if (response.data && response.data.data) {
          setSeatPrices(response.data.data);
          setFilteredSeatPrices(response.data.data);
        } else {
          setError('Định dạng dữ liệu nhận từ API không hợp lệ.');
          setSnackbarMessage('Định dạng dữ liệu nhận từ API không hợp lệ.');
          setOpenSnackbar(true);
        }
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu. Vui lòng kiểm tra API đang chạy và có thể truy cập.');
        setSnackbarMessage('Lỗi khi lấy dữ liệu. Vui lòng kiểm tra API đang chạy và có thể truy cập.');
        setOpenSnackbar(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatPrices();
  }, []);

  // Handle Search and Filters
  useEffect(() => {
    let filtered = seatPrices;

    if (searchTerm) {
      filtered = filtered.filter((seat) =>
        seat.loai_ghe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seat.ten_ngay_le && seat.ten_ngay_le.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (seatTypeFilter) {
      filtered = filtered.filter((seat) => seat.loai_ghe === seatTypeFilter);
    }

    if (dayOfWeekFilter) {
      filtered = filtered.filter((seat) => seat.thu_trong_tuan === dayOfWeekFilter);
    }

    setFilteredSeatPrices(filtered);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, seatTypeFilter, dayOfWeekFilter, seatPrices]);

  // Handle Sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedSeatPrices = React.useMemo(() => {
    const comparator = (a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    };
    return [...filteredSeatPrices].sort(comparator);
  }, [filteredSeatPrices, order, orderBy]);

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Helper function to format time
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const [hour, minute] = timeStr.split(':');
    return `${hour}:${minute}`;
  };

  // Get unique seat types and days for filters
  const uniqueSeatTypes = [...new Set(seatPrices.map((seat) => seat.loai_ghe))];
  const uniqueDays = [...new Set(seatPrices.map((seat) => seat.thu_trong_tuan).filter(Boolean))];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>

        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dữ liệu Giá Ghế
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {/* Filters */}
              <Card sx={{ mb: 3, padding: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Tìm kiếm theo loại ghế hoặc ngày lễ"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="seat-type-label">Loại Ghế</InputLabel>
                        <Select
                          labelId="seat-type-label"
                          label="Loại Ghế"
                          value={seatTypeFilter}
                          onChange={(e) => setSeatTypeFilter(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Tất cả</em>
                          </MenuItem>
                          {uniqueSeatTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="day-of-week-label">Thứ trong tuần</InputLabel>
                        <Select
                          labelId="day-of-week-label"
                          label="Thứ trong tuần"
                          value={dayOfWeekFilter}
                          onChange={(e) => setDayOfWeekFilter(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Tất cả</em>
                          </MenuItem>
                          {uniqueDays.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1 }} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Data Table */}
              <Paper elevation={3}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'id'}
                            direction={orderBy === 'id' ? order : 'asc'}
                            onClick={() => handleRequestSort('id')}
                          >
                            ID
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'loai_ghe'}
                            direction={orderBy === 'loai_ghe' ? order : 'asc'}
                            onClick={() => handleRequestSort('loai_ghe')}
                          >
                            Loại Ghế
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'thu_trong_tuan'}
                            direction={orderBy === 'thu_trong_tuan' ? order : 'asc'}
                            onClick={() => handleRequestSort('thu_trong_tuan')}
                          >
                            Thứ trong tuần
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Ngày cụ thể</TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'gio_bat_dau'}
                            direction={orderBy === 'gio_bat_dau' ? order : 'asc'}
                            onClick={() => handleRequestSort('gio_bat_dau')}
                          >
                            Giờ bắt đầu
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'gio_ket_thuc'}
                            direction={orderBy === 'gio_ket_thuc' ? order : 'asc'}
                            onClick={() => handleRequestSort('gio_ket_thuc')}
                          >
                            Giờ kết thúc
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'gia_ghe'}
                            direction={orderBy === 'gia_ghe' ? order : 'asc'}
                            onClick={() => handleRequestSort('gia_ghe')}
                          >
                            Giá Ghế (VND)
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Tên Ngày Lễ</TableCell>
                        <TableCell>Ngày Lễ</TableCell>
                        <TableCell>Trạng Thái</TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderBy === 'created_at'}
                            direction={orderBy === 'created_at' ? order : 'asc'}
                            onClick={() => handleRequestSort('created_at')}
                          >
                            Tạo Lúc
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Cập Nhật Lúc</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedSeatPrices
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((seat) => (
                          <TableRow key={seat.id} hover>
                            <TableCell>{seat.id}</TableCell>
                            <TableCell>{seat.loai_ghe}</TableCell>
                            <TableCell>
                              {seat.thu_trong_tuan ||
                                (seat.ngay_cu_the ? 'Ngày cụ thể' : 'Không áp dụng')}
                            </TableCell>
                            <TableCell>{seat.ngay_cu_the || 'N/A'}</TableCell>
                            <TableCell>{formatTime(seat.gio_bat_dau)}</TableCell>
                            <TableCell>{formatTime(seat.gio_ket_thuc)}</TableCell>
                            <TableCell>
                              {Number(seat.gia_ghe).toLocaleString()} VND
                            </TableCell>
                            <TableCell>{seat.ten_ngay_le || 'N/A'}</TableCell>
                            <TableCell>{seat.la_ngay_le ? 'Có' : 'Không'}</TableCell>
                            <TableCell>
                              {seat.trang_thai === 1 ? (
                                <Typography color="success.main">Kích hoạt</Typography>
                              ) : (
                                <Typography color="error.main">Vô hiệu hóa</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(seat.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {seat.updated_at
                                ? new Date(seat.updated_at).toLocaleString()
                                : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                  component="div"
                  count={filteredSeatPrices.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </Paper>
            </>
          )}

          {!loading && !error && filteredSeatPrices.length === 0 && (
            <Alert severity="info">Không có dữ liệu hiển thị.</Alert>
          )}
        </Box>

        {/* Snackbar thông báo */}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </ThemeProvider>
  );
};

export default SeatPriceData;
