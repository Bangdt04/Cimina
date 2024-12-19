  // src/pages/Admin/Dashboard/index.jsx
  import React, { useState, useEffect } from 'react';
  import {
    Grid,
    Card,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Divider,
  } from '@mui/material';
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
  } from 'recharts';
  import { createTheme, ThemeProvider } from '@mui/material/styles';
  import axios from 'axios';
  import MovieIcon from '@mui/icons-material/Movie';
  import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
  import TheatersIcon from '@mui/icons-material/Theaters';
  import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

  const getColor = (index) => {
    const colors = ['#43a047', '#1e88e5', '#e57373', '#fbc02d', '#9c27b0'];
    return colors[index % colors.length];
  };

  const theme = createTheme({
    palette: {
      primary: { main: '#1e88e5' },
      secondary: { main: '#43a047' },
      background: { default: '#f4f6f8' },
      text: { primary: '#333' },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, fontSize: '2.2rem' },
      h6: { fontWeight: 500, fontSize: '1.1rem' },
      body1: { fontSize: '1rem' },
    },
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const DashBoardPage = () => {
    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topTicketBuyers, setTopTicketBuyers] = useState([]);
    const [topMoviesByTickets, setTopMoviesByTickets] = useState([]);
    const [foodRevenue, setFoodRevenue] = useState(0);
  const [ticketRevenue, setTicketRevenue] = useState(0);
  const [dailyMovieRevenue, setDailyMovieRevenue] = useState([]);

    // Current Stats
    const [totalMovies, setTotalMovies] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalShowings, setTotalShowings] = useState(0);
    const [totalTicketsSold, setTotalTicketsSold] = useState(0);

    // Order Status Data
    const [orderStatusData, setOrderStatusData] = useState([]);

    // Payment Method Data
    const [paymentMethodData, setPaymentMethodData] = useState([]);

    useEffect(() => {
      const fetchTotalMovies = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getCountMovie');
          setTotalMovies(response.data.data.data);
        } catch (error) {
          console.error('Error fetching total movies:', error);
        }
      };

      const fetchOrderStatus = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getPhanLoaiVe');
          const result = response.data;
          const formattedData = Object.entries(result.data).map(([key, value]) => {
            let name = '';
            switch (key) {
              case 'dangXuLy':
                name = 'Đang Xử Lý';
                break;
              case 'thanhCong':
                name = 'Thành Công';
                break;
              case 'khongthanhcong':
                name = 'Không Thành Công';
                break;
              case 'hoanlai':
                name = 'Hoàn Lại';
                break;
              case 'huy':
                name = 'Hủy';
                break;
              default:
                name = key;
            }
            return { name, value };
          });
          setOrderStatusData(formattedData);
        } catch (error) {
          console.error('Error fetching order status:', error);
        }
      };

      const fetchMonthlyRevenue = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getDoanhThuThang');
          const result = response.data;
          if (response.status === 200) {
            const formattedData = result.data.map((item) => ({
              month: `Tháng ${item.month}`,
              revenue: Number(item.total),
            }));
            setMonthlyRevenueData(formattedData);
          } else {
            console.error('Error:', result.message);
          }
        } catch (error) {
          console.error('Error fetching monthly revenue:', error);
        }
      };

      const fetchTopTicketBuyers = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getTopDatVe');
          if (response.status === 200) {
            setTopTicketBuyers(response.data.data);
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching top ticket buyers:', error);
        }
      };

      const fetchDoanhThuVe = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getDoanhThuVe');
          if (response.status === 200) {
            // Assuming the API returns data as a string, convert it to a number
            const revenue = Number(response.data.data);
            setTotalRevenue(revenue);
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching doanh thu ve:', error);
        }
      };

      const fetchTopMoviesByTickets = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getTopVePhim');
          if (response.status === 200) {
            const sortedData = response.data.data.sort((a, b) => b.total_tickets - a.total_tickets);
            setTopMoviesByTickets(sortedData);
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching top movies by tickets:', error);
        }
      };

      const fetchPaymentMethodData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getHinhThucThanhToan');
          if (response.status === 200) {
            const data = response.data.data;
            const formattedData = [
              { name: 'Tiền Mặt', value: data.tienMat },
              { name: 'Thanh Toán Online', value: data.thanhToanOnline },
            ];
            setPaymentMethodData(formattedData);
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching payment method data:', error);
        }
      };
      const fetchFoodRevenue = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getDoanhDoAn');
          if (response.data.success) {
            setFoodRevenue(response.data.data);
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching food revenue:', error);
        }
      };
    
      const fetchTicketRevenue = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/getDoanhThuVe', {
            params: { start_date: '2024-05-01', end_date: '2024-12-14' },
          });
          if (response.data.success) {
            setTicketRevenue(Number(response.data.data));
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching ticket revenue:', error);
        }
      };
    
      const fetchDailyMovieRevenue = async () => {
        try {
          const response = await axios.get(
            'http://127.0.0.1:8000/api/getDoanhThuTPhimTrongNgay',
            { params: { start_date: '2024-01-05', end_date: '2024-12-17' } }
          );
          if (response.data.success) {
            setDailyMovieRevenue(response.data.data);
          } else {
            console.error('Error:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching daily movie revenue:', error);
        }
      };
    
      // Fetch all new data
      fetchFoodRevenue();
      fetchTicketRevenue();
      fetchDailyMovieRevenue();
      // Call all fetch functions
      fetchTotalMovies();
      fetchOrderStatus();
      fetchMonthlyRevenue();
      fetchTopTicketBuyers();
      fetchDoanhThuVe();
      fetchTopMoviesByTickets();
      fetchPaymentMethodData();

      // Static Data for Top Customers (You might want to fetch this from an API similarly)
      setTopCustomers([
        { name: 'Nguyễn Văn A', totalSpend: 2000000 },
        { name: 'Trần Thị B', totalSpend: 1500000 },
        { name: 'Lê Văn C', totalSpend: 1200000 },
        { name: 'Phạm Thị D', totalSpend: 1000000 },
        { name: 'Hoàng Văn E', totalSpend: 900000 },
      ]);

      // Static Assignments for other stats
      setTotalShowings(50);
      setTotalTicketsSold(50);
    }, []);

    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, backgroundColor: 'background.default' }}>
          <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
            Tổng Quan
          </Typography>
          <Grid container spacing={3}>
            {/* Tổng Số Phim */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  p: 3,
                  background: 'linear-gradient(145deg, #ff6f61, #ff3d00)',
                  color: 'white',
                  boxShadow: 5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                    transition: 'all 0.3s ease-in-out',
                    background: 'linear-gradient(145deg, #ff3d00, #ff6f61)',
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" color="inherit">
                    Tổng Số Phim
                  </Typography>
                  <Typography variant="h5" color="inherit">
                    {totalMovies}
                  </Typography>
                </Box>
                <MovieIcon sx={{ fontSize: 50 }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
    <Card
      sx={{
        p: 3,
        backgroundColor: '#ffb74d',
        color: 'white',
        boxShadow: 5,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 10,
          transition: 'all 0.3s ease-in-out',
          backgroundColor: '#ffa726',
        },
      }}
    >
      <Box>
        <Typography variant="h6" color="inherit">
          Doanh Thu Đồ Ăn
        </Typography>
        <Typography variant="h5" color="inherit">
          {foodRevenue.toLocaleString()} VND
        </Typography>
      </Box>
      <AttachMoneyIcon sx={{ fontSize: 50 }} />
    </Card>
  </Grid>

            {/* Tổng Doanh Thu */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: '#ff9800',
                  color: 'white',
                  boxShadow: 5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: '#fb8c00',
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" color="inherit">
                    Tổng Doanh Thu
                  </Typography>
                  <Typography variant="h5" color="inherit">
                    {totalRevenue.toLocaleString()} VND
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 50 }} />
              </Card>
            </Grid>

            {/* Tổng Số Xuất Chiếu */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: '#4caf50',
                  color: 'white',
                  boxShadow: 5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: '#388e3c',
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" color="inherit">
                    Tổng Số Xuất Chiếu
                  </Typography>
                  <Typography variant="h5" color="inherit">
                    {totalShowings}
                  </Typography>
                </Box>
                <TheatersIcon sx={{ fontSize: 50 }} />
              </Card>
            </Grid>

            {/* Tổng Vé Bán Ra */}
            {/* <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: '#9c27b0',
                  color: 'white',
                  boxShadow: 5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: '#7b1fa2',
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" color="inherit">
                    Tổng Vé Bán Ra
                  </Typography>
                  <Typography variant="h5" color="inherit">
                    {totalTicketsSold}
                  </Typography>
                </Box>
                <ConfirmationNumberIcon sx={{ fontSize: 50 }} />
              </Card>
            </Grid> */}
          </Grid>

          <Grid container spacing={3} mt={2}>
            {/* Biểu đồ Doanh Thu Theo Tháng */}
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: 'white',
                  boxShadow: 5,
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 10 },
                  height: '500px',
                }}
              >
                <Typography variant="h6" gutterBottom color="text.primary">
                  Doanh Thu Theo Tháng
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e88e5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1e88e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="url(#colorRevenue)"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Biểu đồ Tỷ Lệ Đặt Hàng và Thanh Toán */}
            <Grid item xs={12} lg={4}>
              <Grid container spacing={1} direction="column" sx={{ height: '510px' }}>
                {/* Tỷ Lệ Đặt Hàng */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      boxShadow: 5,
                      borderRadius: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 10 },
                      height: '240px',
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Tỷ Lệ Đặt Hàng
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          // Remove labels
                          animationBegin={0}
                          animationDuration={1500}
                          isAnimationActive={true}
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(index)} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name) => [`${value} Vé`, name]} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                {/* Tỷ Lệ Thanh Toán */}
                <Grid item xs={6}>
                  <Card
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      boxShadow: 5,
                      borderRadius: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 10 },
                      height: '240px',
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Tỷ Lệ Thanh Toán
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          // Remove labels
                          animationBegin={0}
                          animationDuration={1500}
                          isAnimationActive={true}
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(index)} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name) => [`${value} Vé`, name]} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Top 5 Người Mua Vé Nhiều Nhất */}
            <Grid item xs={12} sm={6} md={6}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: '#f5f5f5',
                  boxShadow: 5,
                  borderRadius: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 10 },
                }}
              >
                <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Top 5 Người Mua Vé Nhiều Nhất
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Họ Tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Tổng Vé</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topTicketBuyers.map((buyer, index) => (
                      <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                        <TableCell>
                          <Avatar sx={{ bgcolor: '#1e88e5' }}>
                            {buyer.ho_ten.charAt(0).toUpperCase()}
                          </Avatar>
                        </TableCell>
                        <TableCell>{buyer.ho_ten}</TableCell>
                        <TableCell align="right">{buyer.total_tickets}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>

            {/* Top 5 Phim Có Vé Đặt Cao Nhất */}
            <Grid item xs={12} sm={6} md={6}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: '#f5f5f5',
                  boxShadow: 5,
                  borderRadius: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 10 },
                }}
              >
                <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Top 5 Phim Có Vé Đặt Cao Nhất
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ảnh Phim</TableCell>
                      <TableCell>Tên Phim</TableCell>
                      <TableCell align="right">Tổng Vé</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topMoviesByTickets.map((movie, index) => (
                      <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
                        <TableCell>
                          <Avatar
                            variant="square"
                            src={`http://127.0.0.1:8000${movie.anh_phim}`}
                            alt={movie.ten_phim}
                            sx={{ width: 56, height: 56 }}
                          />
                        </TableCell>
                        <TableCell>{movie.ten_phim}</TableCell>
                        <TableCell align="right">{movie.total_tickets}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <Grid item xs={12}>
    <Card sx={{ p: 3, backgroundColor: 'white', boxShadow: 5, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom color="text.primary">
        Doanh Thu Phim Theo Ngày
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên Phim</TableCell>
            <TableCell align="right">Tổng Doanh Thu</TableCell>
            <TableCell align="right">Tổng Vé Bán Ra</TableCell>
            <TableCell align="right">Số Xuất Chiếu</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dailyMovieRevenue.map((movie, index) => (
            <TableRow key={index}>
              <TableCell>{movie.ten_phim}</TableCell>
              <TableCell align="right">{movie.tong_doanh_thu.toLocaleString()} VND</TableCell>
              <TableCell align="right">{movie.so_ve_ban_ra}</TableCell>
              <TableCell align="right">{movie.so_xuat_chieu}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </Grid>

            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    );
  };

  export default DashBoardPage;
