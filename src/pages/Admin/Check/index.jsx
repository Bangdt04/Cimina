import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const Checkin = () => {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!barcode.trim()) {
      setMessage({ type: 'error', content: 'Vui lòng nhập mã barcode.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // Gửi request GET với query param 'barcode'
      const response = await axios.get('http://127.0.0.1:8000/api/checkBarcode-exportTicket', {
        params: { barcode },
        responseType: 'blob' // nhận PDF dưới dạng blob
      });

      const contentType = response.headers['content-type'];
      if (contentType === 'application/pdf') {
        const fileURL = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        // Mở PDF trong tab mới
        window.open(fileURL);
        setMessage({ type: 'success', content: 'Đã mở vé xem phim trong tab mới!' });
      } else {
        // Nếu không phải PDF, có thể là JSON báo lỗi
        const reader = new FileReader();
        reader.onload = function () {
          const json = JSON.parse(reader.result);
          setMessage({ type: 'error', content: json.message || 'Đã có lỗi xảy ra.' });
        };
        reader.readAsText(response.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const json = JSON.parse(reader.result);
            setMessage({ type: 'error', content: json.message || 'Đã có lỗi xảy ra.' });
          } catch {
            setMessage({ type: 'error', content: 'Đã có lỗi xảy ra.' });
          }
        };
        reader.readAsText(error.response.data);
      } else {
        setMessage({ type: 'error', content: 'Không thể kết nối tới server.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fafafa',
        }}
      >
        <ConfirmationNumberIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography component="h1" variant="h5" gutterBottom>
          Kiểm Tra Vé
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Mã Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2, height: '56px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Kiểm Tra'}
          </Button>
        </Box>
        {message.content && (
          <Alert severity={message.type} sx={{ width: '100%', mt: 2 }}>
            {message.content}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Checkin;
