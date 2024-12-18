import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Tạo theme tùy chỉnh nếu cần
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Màu xanh chủ đạo
    },
    secondary: {
      main: '#dc004e', // Màu đỏ
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
  },
});

const SeatPriceForm = () => {
  const [seatTypes, setSeatTypes] = useState([]);
  const [loadingSeatTypes, setLoadingSeatTypes] = useState(true);
  const [formData, setFormData] = useState({
    loai_ghe: '',
    thu_trong_tuan: '',
    ngay_cu_the: '',
    gio_bat_dau: '',
    gio_ket_thuc: '',
    gia_ghe: '',
    ten_ngay_le: '',
    la_ngay_le: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch loại ghế từ API
  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/list-type-seat');
        if (response.data && response.data.data) {
          setSeatTypes(response.data.data);
        } else {
          throw new Error('Định dạng dữ liệu không hợp lệ từ API.');
        }
      } catch (error) {
        console.error(error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Lỗi khi lấy danh sách loại ghế.');
        setOpenSnackbar(true);
      } finally {
        setLoadingSeatTypes(false);
      }
    };

    fetchSeatTypes();
  }, []);

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu thay đổi giá trị của 'la_ngay_le', chuyển đổi giá trị boolean
    if (name === 'la_ngay_le') {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
        // Nếu là ngày lễ, thì xóa giá trị của 'thu_trong_tuan'
        ...(e.target.checked ? { thu_trong_tuan: '' } : {}),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Xóa lỗi của trường đang thay đổi
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Xác thực dữ liệu form
  const validate = () => {
    const newErrors = {};

    if (!formData.loai_ghe) newErrors.loai_ghe = 'Vui lòng chọn loại ghế.';
    if (!formData.la_ngay_le && !formData.thu_trong_tuan)
      newErrors.thu_trong_tuan = 'Vui lòng chọn thứ trong tuần.';
    if (formData.la_ngay_le && !formData.ngay_cu_the)
      newErrors.ngay_cu_the = 'Vui lòng nhập ngày lễ cụ thể.';
    if (!formData.gio_bat_dau) newErrors.gio_bat_dau = 'Vui lòng nhập giờ bắt đầu.';
    if (!formData.gio_ket_thuc) newErrors.gio_ket_thuc = 'Vui lòng nhập giờ kết thúc.';
    if (!formData.gia_ghe) {
      newErrors.gia_ghe = 'Vui lòng nhập giá ghế.';
    } else if (isNaN(formData.gia_ghe) || Number(formData.gia_ghe) <= 0) {
      newErrors.gia_ghe = 'Giá ghế phải là số dương.';
    }
    if (formData.la_ngay_le && !formData.ten_ngay_le)
      newErrors.ten_ngay_le = 'Vui lòng nhập tên ngày lễ.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      loai_ghe: formData.loai_ghe,
      thu_trong_tuan: formData.la_ngay_le ? '' : formData.thu_trong_tuan,
      ngay_cu_the: formData.la_ngay_le ? formData.ngay_cu_the : '',
      gio_bat_dau: formData.gio_bat_dau,
      gio_ket_thuc: formData.gio_ket_thuc,
      gia_ghe: Number(formData.gia_ghe),
      ten_ngay_le: formData.la_ngay_le ? formData.ten_ngay_le : '',
      la_ngay_le: formData.la_ngay_le ? 1 : 0,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/store-seat-price', payload);
      if (response.data) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Thêm mới giá ghế thành công!');
        setOpenSnackbar(true);
        // Reset form
        setFormData({
          loai_ghe: '',
          thu_trong_tuan: '',
          ngay_cu_the: '',
          gio_bat_dau: '',
          gio_ket_thuc: '',
          gia_ghe: '',
          ten_ngay_le: '',
          la_ngay_le: false,
        });
      } else {
        throw new Error('Không nhận được phản hồi từ server.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
            const backendErrors = error.response.data.errors;
            Object.keys(backendErrors).forEach((field) => {
                form.setFields([
                    {
                        name: field,
                        errors: backendErrors[field],
                    },
                ]);
            });
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng kiểm tra lại các trường đã nhập.',
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            });
        } else if (error.response.data.message) {
            // Hiển thị thông báo lỗi từ trường message
            notification.error({
                message: 'Lỗi',
                description: error.response.data.message,
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            });
        } else {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi lưu thành viên.',
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            });
        }
    } 

      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý đóng Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // Danh sách các thứ trong tuần
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: 4 }}>
        <Typography variant="h5" gutterBottom color='black'>
          Thêm Mới Giá Ghế
        </Typography>

        <Paper sx={{ padding: 4, maxWidth: 1600, margin: '0 auto' }} elevation={3}>
          {loadingSeatTypes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Loại Ghế */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={Boolean(errors.loai_ghe)}>
                    <InputLabel id="loai_ghe-label">Loại Ghế</InputLabel>
                    <Select
                      labelId="loai_ghe-label"
                      label="Loại Ghế"
                      name="loai_ghe"
                      value={formData.loai_ghe}
                      onChange={handleChange}
                    >
                      {seatTypes.map((type, index) => (
                        <MenuItem key={index} value={type.loai_ghe_ngoi}>
                          {type.loai_ghe_ngoi}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.loai_ghe && (
                      <Typography variant="caption" color="error">
                        {errors.loai_ghe}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Là Ngày Lễ */}
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControl>
                    <input
                      type="checkbox"
                      id="la_ngay_le"
                      name="la_ngay_le"
                      checked={formData.la_ngay_le}
                      onChange={handleChange}
                      style={{ marginRight: 8 }}
                    />
                    <label htmlFor="la_ngay_le">Là Ngày Lễ</label>
                  </FormControl>
                </Grid>

                {/* Thứ Trong Tuần */}
                {!formData.la_ngay_le && (
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.thu_trong_tuan)}
                    >
                      <InputLabel id="thu_trong_tuan-label">Thứ Trong Tuần</InputLabel>
                      <Select
                        labelId="thu_trong_tuan-label"
                        label="Thứ Trong Tuần"
                        name="thu_trong_tuan"
                        value={formData.thu_trong_tuan}
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>Chọn Thứ</em>
                        </MenuItem>
                        {daysOfWeek.map((day, index) => (
                          <MenuItem key={index} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.thu_trong_tuan && (
                        <Typography variant="caption" color="error">
                          {errors.thu_trong_tuan}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                )}

                {/* Ngày Cụ Thể */}
                {formData.la_ngay_le && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ngày Cụ Thể"
                      type="date"
                      name="ngay_cu_the"
                      value={formData.ngay_cu_the}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={Boolean(errors.ngay_cu_the)}
                      helperText={errors.ngay_cu_the}
                    />
                  </Grid>
                )}

                {/* Tên Ngày Lễ */}
                {formData.la_ngay_le && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tên Ngày Lễ"
                      name="ten_ngay_le"
                      value={formData.ten_ngay_le}
                      onChange={handleChange}
                      fullWidth
                      error={Boolean(errors.ten_ngay_le)}
                      helperText={errors.ten_ngay_le}
                    />
                  </Grid>
                )}

                {/* Giờ Bắt Đầu */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Giờ Bắt Đầu"
                    type="time"
                    name="gio_bat_dau"
                    value={formData.gio_bat_dau}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 phút
                    }}
                    fullWidth
                    error={Boolean(errors.gio_bat_dau)}
                    helperText={errors.gio_bat_dau}
                  />
                </Grid>

                {/* Giờ Kết Thúc */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Giờ Kết Thúc"
                    type="time"
                    name="gio_ket_thuc"
                    value={formData.gio_ket_thuc}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 phút
                    }}
                    fullWidth
                    error={Boolean(errors.gio_ket_thuc)}
                    helperText={errors.gio_ket_thuc}
                  />
                </Grid>

                {/* Giá Ghế */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Giá Ghế (VND)"
                    type="number"
                    name="gia_ghe"
                    value={formData.gia_ghe}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(errors.gia_ghe)}
                    helperText={errors.gia_ghe}
                  />
                </Grid>
              </Grid>

              {/* Nút Submit */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                  startIcon={submitting && <CircularProgress size={20} />}
                >
                  {submitting ? 'Đang gửi...' : 'Thêm Mới'}
                </Button>
              </Box>
            </form>
          )}
        </Paper>

        {/* Snackbar thông báo */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
            action={
              <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                <CloseIcon fontSize="small" />
              </Button>
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default SeatPriceForm;
