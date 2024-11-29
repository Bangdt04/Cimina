import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";

const DashBoardPage = () => {
  const [soLuongPhim, setSoLuongPhim] = useState(0);
  const [doanhThuVe, setDoanhThuVe] = useState(0);
  const [doanhThuDoAn, setDoanhThuDoAn] = useState(0);
  const [voucherData, setVoucherData] = useState([]);
  const [phanLoaiVe, setPhanLoaiVe] = useState({});
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(
          "http://127.0.0.1:8000/api/getCountMovie"
        );
        setSoLuongPhim(movieResponse.data.data);

        const doanhThuVeResponse = await axios.get(
          "http://127.0.0.1:8000/api/getDoanhThuVe"
        );
        setDoanhThuVe(doanhThuVeResponse.data.data);

        const doanhThuDoAnResponse = await axios.get(
          "http://127.0.0.1:8000/api/getDoanhDoAn"
        );
        setDoanhThuDoAn(doanhThuDoAnResponse.data.data);

        const voucherResponse = await axios.get(
          "http://127.0.0.1:8000/api/getSoLuongVoucher"
        );
        setVoucherData(voucherResponse.data.data);

        const phanLoaiVeResponse = await axios.get(
          "http://127.0.0.1:8000/api/getPhanLoaiVe"
        );
        setPhanLoaiVe(phanLoaiVeResponse.data.data);

        const hinhThucThanhToanResponse = await axios.get(
          "http://127.0.0.1:8000/api/getHinhThucThanhToan"
        );
        setHinhThucThanhToan(hinhThucThanhToanResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartVoucher = {
    labels: voucherData.map((v) => `Giảm ${v.muc_giam_gia}%`),
    datasets: [
      {
        label: "Voucher còn lại",
        data: voucherData.map((v) => v.so_luong_con_lai),
        backgroundColor: ["#00c853", "#6200ea", "#ff9100", "#d50000", "#2962ff"],
      },
    ],
  };

  const chartPhanLoaiVe = {
    labels: ["Đang Xử Lý", "Thành Công", "Không Thành Công", "Hoàn Lại", "Hủy"],
    datasets: [
      {
        data: [
          phanLoaiVe.dangXuLy || 0,
          phanLoaiVe.thanhCong || 0,
          phanLoaiVe.khongthanhcong || 0,
          phanLoaiVe.hoanlai || 0,
          phanLoaiVe.huy || 0,
        ],
        backgroundColor: ["#00bcd4", "#76ff03", "#f44336", "#ffeb3b", "#9c27b0"],
      },
    ],
  };

  const chartHinhThucThanhToan = {
    labels: ["Tiền Mặt", "Thanh Toán Online"],
    datasets: [
      {
        data: [
          hinhThucThanhToan.tienMat || 0,
          hinhThucThanhToan.thanhToanOnline || 0,
        ],
        backgroundColor: ["#8bc34a", "#ff5722"],
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
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#1a202c" }}>

      </AppBar>
      <Box
        sx={{
          padding: 4,
          background: "linear-gradient(135deg, #f0f4f7, #ffffff)",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#1a202c",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Tổng Quan
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Tổng Phim",
              value: soLuongPhim,
              color: "#42a5f5",
              icon: "🎬",
            },
            {
              title: "Doanh Thu Vé",
              value: `${doanhThuVe.toLocaleString()} VNĐ`,
              color: "#66bb6a",
              icon: "💰",
            },
            {
              title: "Doanh Thu Đồ Ăn",
              value: `${doanhThuDoAn.toLocaleString()} VNĐ`,
              color: "#f44336",
              icon: "🍔",
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color} 30%, #ffffff 90%)`,
                  boxShadow: "0px 6px 18px rgba(0,0,0,0.2)",
                  borderRadius: "20px",
                  textAlign: "center",
                  padding: 4,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: stat.color,
                    width: 60,
                    height: 60,
                    margin: "auto",
                    marginBottom: 2,
                    fontSize: "2rem",
                    color: "#ffffff",
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#333333",
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#1a202c",
                    marginTop: 1,
                  }}
                >
                  {stat.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={6} sx={{ marginTop: 6 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, color: "#333", textAlign: "center" }}
            >
              Voucher Sử Dụng
            </Typography>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
                borderRadius: "20px",
                padding: 4,
              }}
            >
              <Doughnut
                data={chartVoucher}
                options={{
                  responsive: true,
                  animation: {
                    duration: 1000,
                    easing: "easeInOutCubic",
                  },
                }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, color: "#333", textAlign: "center" }}
            >
              Hình Thức Thanh Toán
            </Typography>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
                borderRadius: "20px",
                padding: 4,
              }}
            >
              <Doughnut
                data={chartHinhThucThanhToan}
                options={{
                  responsive: true,
                  animation: {
                    duration: 1000,
                    easing: "easeInOutCubic",
                  },
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashBoardPage;
