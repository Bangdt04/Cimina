import React, { useEffect, useState } from "react";
import { Box, Grid, Card, Typography, CircularProgress, Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";
import { FaTicketAlt, FaFilm, FaHamburger } from "react-icons/fa"; // Import icons for better visualization

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const DashBoardPage = () => {
  const [doanhThuThang, setDoanhThuThang] = useState([]);
  const [soLuongPhim, setSoLuongPhim] = useState(null);
  const [doanhThuVe, setDoanhThuVe] = useState(null);
  const [doanhThuDoAn, setDoanhThuDoAn] = useState(null);
  const [voucherData, setVoucherData] = useState([]);
  const [phanLoaiVeData, setPhanLoaiVeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


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
  

  const chartDoanhThuThang = {
    labels: doanhThuThang.map((item) => `Tháng ${item.month} ${item.year}`),
    datasets: [
      {
        label: "Doanh Thu Theo Tháng",
        data: doanhThuThang.map((item) => parseInt(item.total)),
        backgroundColor: "rgba(66, 165, 245, 0.6)",
        borderColor: "#1e88e5",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f9f9f9",
        }}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
        background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          textTransform: "uppercase",
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        Tổng Quan
      </Typography>

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

      <Grid container spacing={6} sx={{ marginTop: 5 }}>
        <Grid item xs={12}>
          <Card sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 3, color: "#555" }}>
              Doanh Thu Theo Tháng
            </Typography>
            <Line data={chartDoanhThuThang} options={{ responsive: true }} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashBoardPage;