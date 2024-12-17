import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

const Membership = () => {
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [duration, setDuration] = useState('');
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/membersa/types');
        if (response.data && response.data.data) {
          setMembershipTypes(response.data.data);
        } else {
          setError('Dữ liệu không hợp lệ từ API.');
        }
      } catch (err) {
        console.error('Error fetching membership types:', err);
        setError('Không thể kết nối đến API.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipTypes();
  }, []);

  // Loading and error states
  if (loading) {
    return (
      <Box sx={{ padding: '80px 20px', backgroundColor: '#121212', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress color="secondary" />
        <Typography variant="h6" sx={{ color: '#fff', ml: 2 }}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '80px 20px', backgroundColor: '#121212', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Handle opening the dialog
  const handleOpenDialog = (type) => {
    setSelectedType(type);
    setDuration('');
    setRegistrationError(null);
    setRegistrationSuccess(null);
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const durationInt = parseInt(duration, 10);
    if (isNaN(durationInt) || durationInt <= 0) {
      setRegistrationError('Vui lòng nhập số tháng hợp lệ.');
      return;
    }

    setSubmitting(true);
    setRegistrationError(null);
    setRegistrationSuccess(null);

    const token = JSON.parse(localStorage.getItem('token'))?.['access-token'];
    if (!token) {
      setRegistrationError('Bạn chưa đăng nhập.');
      setSubmitting(false);
      return;
    }

    const payload = { thoi_gian: durationInt };

    try {
      const response = await axios.post(`http://localhost:8000/api/auth/register-members/${selectedType.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRegistrationSuccess('Đăng ký thành công! , vui lòng thanh toán');
      const newMemberId = response.data?.data?.id;
      setTimeout(async () => {
        try {
          const paymentResponse = await axios.post(`http://localhost:8000/api/auth/register-members/${newMemberId}/ncb`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (paymentResponse.data && paymentResponse.data.url) {
            window.location.href = paymentResponse.data.url;
          } else {
            setRegistrationError('Không thể chuyển hướng đến trang thanh toán.');
          }
        } catch (err) {
          console.error('Error with NCB payment API:', err);
          setRegistrationError('Đã xảy ra lỗi khi lấy thông tin thanh toán.');
        }
      }, 2000);
    } catch (err) {
      console.error('Error registering membership:', err);
      setRegistrationError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ padding: '80px 20px', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#fff', mb: 4 }}>
        Chọn Gói Thành Viên
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {membershipTypes.map((type) => {
          const isVip = type.loai_hoi_vien.toLowerCase() === 'vip';
          const features = isVip
            ? ['Giảm giá 3%', 'Truy cập không giới hạn', 'Nhận thông báo khi có phim mới']
            : ['Giảm giá 10%', 'Xem nội dung giới hạn', 'Nhận thông báo khi có phim mới'];

          return (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card sx={{
                maxWidth: 345,
                margin: 'auto',
                backgroundColor: isVip ? '#2c2c2c' : '#1e1e1e',
                borderRadius: '15px',
                border: isVip ? '2px solid #ffd700' : 'none',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
                },
              }}>
                {isVip && (
                  <Box sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    backgroundColor: '#ffd700',
                    borderRadius: '50%',
                    padding: '15px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}>
                    <StarIcon fontSize="large" color="primary" />
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h5" component="div" sx={{ color: isVip ? '#ffd700' : '#ff9800', mb: 1 }}>
                    {type.loai_hoi_vien}
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', mb: 2 }}>
                    {isVip ? formatPrice(type.gia) + '/tháng' : formatPrice(type.gia)}
                  </Typography>
                  <Divider sx={{ bgcolor: '#424242', mb: 2 }} />
                  <List>
                    {features.map((feature, index) => (
                      <ListItem key={index} sx={{ color: '#bdbdbd' }}>
                        <ListItemIcon>
                          <CheckIcon sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Tooltip title="Chọn số tháng bạn muốn đăng ký" placement="top">
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: isVip ? '#ffd700' : '#ff9800',
                        color: isVip ? '#000' : '#fff',
                        '&:hover': {
                          backgroundColor: isVip ? '#ffea00' : '#fb8c00',
                        },
                      }}
                      onClick={() => handleOpenDialog(type)}
                    >
                      Đăng ký
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Registration Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Đăng ký {selectedType && selectedType.loai_hoi_vien}</DialogTitle>
        <DialogContent>
          {registrationError && <Alert severity="error" sx={{ mb: 2 }}>{registrationError}</Alert>}
          {registrationSuccess && <Alert severity="success" sx={{ mb: 2 }}>{registrationSuccess}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Thời gian (tháng)"
            type="number"
            fullWidth
            variant="outlined"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={submitting || registrationSuccess}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" disabled={submitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting || !duration || isNaN(parseInt(duration, 10)) || parseInt(duration, 10) <= 0}
          >
            {submitting ? <CircularProgress size={24} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Membership;
