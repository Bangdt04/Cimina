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
    setMonthlyRevenue([
      { month: 'Tháng 9', revenue: 400000 },
      { month: 'Tháng 10', revenue: 450000 },
      { month: 'Tháng 11', revenue: 300000 },
      
    ]);
    setTopMovies([
      { name: 'Movie 1', revenue: 800000, releaseYear: 2023, posterUrl: 'https://via.placeholder.com/50' },
      { name: 'Movie 2', revenue: 750000, releaseYear: 2023, posterUrl: 'https://via.placeholder.com/50' },
      { name: 'Movie 3', revenue: 700000, releaseYear: 2023, posterUrl: 'https://via.placeholder.com/50' },
      { name: 'Movie 4', revenue: 650000, releaseYear: 2023, posterUrl: 'https://via.placeholder.com/50' },
      { name: 'Movie 5', revenue: 600000, releaseYear: 2023, posterUrl: 'https://via.placeholder.com/50' },
    ]);
    setTopCustomers([
      { name: 'Nguyễn Văn A', totalSpend: 2000000 },
      { name: 'Trần Thị B', totalSpend: 1500000 },
      { name: 'Lê Văn C', totalSpend: 1200000 },
      { name: 'Phạm Thị D', totalSpend: 1000000 },
      { name: 'Hoàng Văn E', totalSpend: 900000 },
    ]);
    
    // Set values for new state variables
    setTotalMovies(15);
    setTotalRevenue(950000);
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

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
              p: 3,
              backgroundColor: '#4caf50', // Changed color
              color: 'white',
              boxShadow: 5,
              borderRadius: 3,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 10,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: '#388e3c', // Hover effect change color
              },
            }}>
              <Typography variant="h6" color="inherit">
                Tổng Số Xuất Chiếu
              </Typography>
              <Typography variant="h5" color="inherit">
                {totalShowings}
              </Typography>
            </Card>
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