// src/pages/Admin/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Tạo theme tùy chỉnh
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
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  
  // Add new state variables
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalShowings, setTotalShowings] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);

  const successOrderData = [
    { name: 'Đặt hàng thành công', value: 75 },
    { name: 'Đặt hàng thất bại', value: 25 },
  ];

  const paymentMethodData = [
    { name: 'Thanh toán online', value: 60 },
    { name: 'Thanh toán tại quầy', value: 40 },
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        setLoading(true);
  
        const [
          doanhThuThangResponse,
          soLuongPhimResponse,
          doanhThuVeResponse,
          doanhThuDoAnResponse,
          soLuongVoucherResponse,
          phanLoaiVeResponse,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/getDoanhThuThang"),
          axios.get("http://127.0.0.1:8000/api/getCountMovie"),
          axios.get("http://127.0.0.1:8000/api/getDoanhThuVe"),
          axios.get("http://127.0.0.1:8000/api/getDoanhDoAn"),
          axios.get("http://127.0.0.1:8000/api/getSoLuongVoucher"),
          axios.get("http://127.0.0.1:8000/api/getPhanLoaiVe"),
        ]);
  
        let doanhThuThangData = doanhThuThangResponse.data.data.sort(
          (a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year)
        );
  
        // // Kiểm tra và thêm dữ liệu giả cho tháng 9 và tháng 10 nếu chưa có
        // const monthsAvailable = doanhThuThangData.map(item => item.month);
        // if (!monthsAvailable.includes(9)) {
        //   doanhThuThangData.push({ month: 9, year: 2024, total: 35000000 });
        // }
        // if (!monthsAvailable.includes(10)) {
        //   doanhThuThangData.push({ month: 10, year: 2024, total: 42000000 });
        // }
  
        // // Sắp xếp lại sau khi thêm dữ liệu giả
        // doanhThuThangData = doanhThuThangData.sort(
        //   (a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year)
        // );
  
        setDoanhThuThang(doanhThuThangData);
        setSoLuongPhim(soLuongPhimResponse.data.data);
        setDoanhThuVe(doanhThuVeResponse.data.data);
        setDoanhThuDoAn(doanhThuDoAnResponse.data.data);
        setVoucherData(soLuongVoucherResponse.data.data);
        setPhanLoaiVeData(phanLoaiVeResponse.data.data);
  
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: 'background.default' }}>
        <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
          Tổng Quan
        </Typography>
        <Grid container spacing={3}>
          {/* Card Tổng quan */}
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(145deg, #ff6f61, #ff3d00)', // gradient background
              color: 'white',
              boxShadow: 5,
              borderRadius: 3,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 10,
                transition: 'all 0.3s ease-in-out',
                background: 'linear-gradient(145deg, #ff3d00, #ff6f61)', // Hover effect change color
              },
            }}>
              <Typography variant="h6" color="inherit">
                Tổng Số Phim
              </Typography>
              <Typography variant="h5" color="inherit">
                {totalMovies}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
              p: 3,
              backgroundColor: '#ff9800', // Changed color
              color: 'white',
              boxShadow: 5,
              borderRadius: 3,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 10,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: '#fb8c00', // Hover effect change color
              },
            }}>
              <Typography variant="h6" color="inherit">
                Tổng Doanh Thu
              </Typography>
              <Typography variant="h5" color="inherit">
                {totalRevenue.toLocaleString()} VND
              </Typography>
            </Card>
          </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2, boxShadow: 2 }}>
            <FaFilm size={40} color="#1e88e5" />
            <Typography variant="h6" sx={{ marginBottom: 2, color: "#555" }}>
              Số Lượng Phim
            </Typography>
            <Typography variant="h5" color="primary">
              {soLuongPhim} Phim
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2, boxShadow: 2 }}>
            <FaTicketAlt size={40} color="#1e88e5" />
            <Typography variant="h6" sx={{ marginBottom: 2, color: "#555" }}>
              Doanh Thu Bán Vé
            </Typography>
            <Typography variant="h5" color="secondary">
            {formatCurrency(doanhThuVe)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2, boxShadow: 2 }}>
            <FaHamburger size={40} color="#1e88e5" />
            <Typography variant="h6" sx={{ marginBottom: 2, color: "#555" }}>
              Doanh Thu Đồ Ăn
            </Typography>
            <Typography variant="h5" color="warning">
            {formatCurrency(doanhThuDoAn)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
              p: 3,
              backgroundColor: '#9c27b0', // Changed color
              color: 'white',
              boxShadow: 5,
              borderRadius: 3,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 10,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: '#7b1fa2', // Hover effect change color
              },
            }}>
              <Typography variant="h6" color="inherit">
                Tổng Vé Bán Ra
              </Typography>
              <Typography variant="h5" color="inherit">
                {totalTicketsSold}
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} mt={2}>
          {/* Biểu đồ đường */}
          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ p: 3, backgroundColor: 'white', boxShadow: 5, borderRadius: 3, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 10 } }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Doanh Thu Theo Tháng
              </Typography>
              <ResponsiveContainer width="100%" height={430}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#1e88e5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Biểu đồ tròn */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 3, backgroundColor: 'white', boxShadow: 5, borderRadius: 3, transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 10 } }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Tỷ Lệ Đặt Hàng Thành Công
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={successOrderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {successOrderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#43a047' : '#e57373'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="h6" gutterBottom color="text.primary">
                Tỷ Lệ Thanh Toán
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#1e88e5' : '#fbc02d'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
  <Card sx={{ 
    p: 3, 
    backgroundColor: '#f5f5f5', // Lighter background for better contrast
    boxShadow: 5, 
    borderRadius: 3, 
    height: '100%', 
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
    '&:hover': { 
      transform: 'scale(1.03)', 
      boxShadow: 10 
    } 
  }}>
    <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
      Top 5 Phim Có Doanh Thu Cao Nhất
    </Typography>
    <List>
      {topMovies.map((movie, index) => (
        <React.Fragment key={index}>
          <ListItem sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}> {/* Hover effect */}
            <ListItemAvatar>
              <Avatar alt={movie.name} src={movie.posterUrl} />
            </ListItemAvatar>
            <ListItemText primary={movie.name} secondary={`Doanh thu: ${movie.revenue.toLocaleString()} VND`} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  </Card>
</Grid>

<Grid item xs={12} sm={6} md={6}>
  <Card sx={{ 
    p: 3, 
    backgroundColor: '#f5f5f5', // Lighter background for better contrast
    boxShadow: 5, 
    borderRadius: 3, 
    height: '100%', 
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
    '&:hover': { 
      transform: 'scale(1.03)', 
      boxShadow: 10 
    } 
  }}>
    <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
      Top 5 Người Tiêu Nhiều Nhất
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Tên Khách Hàng</TableCell>
          <TableCell align="right">Tổng Tiêu</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {topCustomers.map((customer, index) => (
          <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}> {/* Hover effect */}
            <TableCell>{customer.name}</TableCell>
            <TableCell align="right">{customer.totalSpend.toLocaleString()} VND</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
</Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default DashBoardPage;