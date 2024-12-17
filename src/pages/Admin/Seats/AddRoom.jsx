import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Grid, Tooltip, AppBar, Toolbar, Typography, Snackbar, 
  Alert, IconButton, Card, Divider, Select, MenuItem, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { Clear, EventSeat, Weekend, Star, EventSeatOutlined } from '@mui/icons-material';

const rows = ['A','B','C','D','E','F','G','H','I','J','K'];
const cols = [1,2,3,4,5,6,7,8,9,10];

const AddRoom = () => {
  const [seats, setSeats] = useState(
    rows.flatMap(r => cols.map(c => ({
      id: r + c,
      type: '',
      price: '',
    })))
  );
  const containerRef = useRef(null);
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({x:0,y:0});
  const [currentPoint, setCurrentPoint] = useState({x:0,y:0});
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [open, setOpen] = useState(false);
  const [seatType, setSeatType] = useState('');
  const [seatPrice, setSeatPrice] = useState('');

  const [showSnackbar, setShowSnackbar] = useState(false);

  const seatRefs = useRef({});
  
  const [roomName, setRoomName] = useState('');
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(true);

  const [tempSeats, setTempSeats] = useState([...seats]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const [roomId, setRoomId] = useState(null); // State để lưu room_id
  const [isLoading, setIsLoading] = useState(false); // State để quản lý loading
  const [error, setError] = useState(null); // State để quản lý lỗi

  useEffect(() => {
    Object.keys(seatRefs.current).forEach(key => {
      const rect = seatRefs.current[key].getBoundingClientRect();
      seatRefs.current[key].dataRect = rect;
    });
  }, [seats]);

  const handleMouseDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCurrentPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsSelecting(true);
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCurrentPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    const minX = Math.min(startPoint.x, currentPoint.x);
    const minY = Math.min(startPoint.y, currentPoint.y);
    const maxX = Math.max(startPoint.x, currentPoint.x);
    const maxY = Math.max(startPoint.y, currentPoint.y);
    
    const selected = tempSeats.filter(seat => {
      const seatEl = seatRefs.current[seat.id];
      const rect = seatEl?.dataRect;
      if (!rect) return false;
      const containerRect = containerRef.current.getBoundingClientRect();
      const seatX1 = rect.left - containerRect.left;
      const seatY1 = rect.top - containerRect.top;
      const seatX2 = seatX1 + rect.width;
      const seatY2 = seatY1 + rect.height;
      
      return !(seatX2 < minX || seatX1 > maxX || seatY2 < minY || seatY1 > maxY);
    });
    
    if (selected.length > 0) {
      setSelectedSeats(selected.map(s => s.id));
      setOpen(true);
    } else {
      setSelectedSeats([]);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSeatType('');
    setSeatPrice('');
  };

  const handleSave = async () => {
    // Kiểm tra xem room đã được tạo chưa
    if (!roomId) {
      setError('Phòng chưa được tạo. Vui lòng nhập tên phòng trước.');
      return;
    }

    const updatedSeats = tempSeats.map(s => {
      if (selectedSeats.includes(s.id)) {
        return { ...s, type: seatType, price: seatPrice };
      }
      return s;
    });
    
    setTempSeats(updatedSeats);
    handleClose();
    setShowSnackbar(true);

    // console.log thông tin cập nhật
    const updatedInfo = updatedSeats.filter(s => selectedSeats.includes(s.id));
    console.log("Ghế đã cập nhật:", updatedInfo);
  };

  const handleConfirmSave = async () => {
    if (!roomId) {
      setError('Phòng chưa được tạo. Vui lòng nhập tên phòng trước.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        room_id: roomId,
        seats: tempSeats.map(s => ({
          so_ghe_ngoi: s.id,
          loai_ghe_ngoi: s.type,
          gia_ghe: parseInt(s.price, 10) || 0,
        })).filter(s => s.loai_ghe_ngoi !== ''), // Chỉ gửi những ghế đã được cập nhật
      };

      const response = await fetch('http://127.0.0.1:8000/api/storeSeatsArray', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Lưu ghế không thành công.');
      }

      const data = await response.json();
      console.log("Dữ liệu đã được lưu:", data);
      setShowSnackbar(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setIsLoading(false);
      setIsSaveDialogOpen(false);
    }
  };

  const getSeatColor = (seat) => {
    if (selectedSeats.includes(seat.id)) return '#ff9800'; 
    switch (seat.type) {
      case 'Ghế Thường':
        return '#9e9e9e'; 
      case 'Ghế Đôi':
        return '#4caf50'; 
      case 'Ghế VIP':
        return '#ffeb3b'; 
      default:
        return '#e0e0e0'; 
    }
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
  };

  const selectionBoxStyles = {
    display: isSelecting ? 'block' : 'none',
    position: 'absolute',
    border: '2px dashed #2196f3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    left: Math.min(startPoint.x, currentPoint.x),
    top: Math.min(startPoint.y, currentPoint.y),
    width: Math.abs(currentPoint.x - startPoint.x),
    height: Math.abs(currentPoint.y - startPoint.y),
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out'
  };

  const handleRoomSave = async () => {
    if (roomName.trim() === '') {
      setError('Tên phòng không được để trống.');
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API storeRoom để tạo phòng mới
      const payload = {
        ten_phong_chieu: roomName.trim(),
      };

      const response = await fetch('http://127.0.0.1:8000/api/storeRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đã xảy ra lỗi.');
      }

      // Giả sử API storeRoom không trả về room_id, chúng ta sẽ gọi API rooms để lấy danh sách phòng
      // và lấy room mới tạo dựa trên thời gian tạo (created_at)
      const roomsResponse = await fetch('http://127.0.0.1:8000/api/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!roomsResponse.ok) {
        throw new Error('Lấy danh sách phòng không thành công.');
      }

      const roomsData = await roomsResponse.json();
      const rooms = roomsData.data;

      if (!Array.isArray(rooms) || rooms.length === 0) {
        throw new Error('Không tìm thấy phòng nào.');
      }

      // Giả sử phòng mới tạo là phòng có created_at mới nhất
      const sortedRooms = rooms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const latestRoom = sortedRooms[0];

      setRoomId(latestRoom.id);
      setIsRoomDialogOpen(false);
      setShowSnackbar(true);
      console.log("Phòng đã được tạo:", latestRoom);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to right, #ece9e6, #ffffff)',
        paddingBottom: '80px' // Đảm bảo không bị chồng nút lưu
      }}
    >
      {/* Dialog nhập tên phòng */}
      <Dialog open={isRoomDialogOpen} disableEscapeKeyDown>
        <DialogTitle>Nhập Tên Phòng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên Phòng"
            type="text"
            fullWidth
            variant="outlined"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isLoading}
          />
          {error && (
            <Alert severity="error" sx={{ mt:2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleRoomSave} 
            variant="contained" 
            disabled={roomName.trim() === '' || isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? 'Đang lưu...' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>

      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow:1}}>
            Sơ đồ ghế - {roomName || 'Rạp Chiếu Phim '}
          </Typography>
          {selectedSeats.length > 0 && (
            <Tooltip title="Bỏ chọn tất cả">
              <IconButton color="inherit" onClick={handleClearSelection}>
                <Clear />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      
      <Grid container spacing={3} sx={{ p:3 }}>
        {/* Cột Trái: Tiêu đề, Hướng dẫn, Sơ đồ ghế */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Chọn Nhiều Ghế
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Kéo chuột để khoanh vùng nhiều ghế. Khi nhả chuột, một cửa sổ sẽ mở ra cho phép nhập loại ghế và giá cho các ghế được chọn.
          </Typography>
          
          <Card elevation={3} sx={{ p:2, display:'inline-block', position:'relative', mt:2, borderRadius: '8px' }}>
            <Box 
              ref={containerRef}
              sx={{
                position: 'relative', 
                userSelect: 'none', 
                border: '1px solid #ccc', 
                p:2,
                backgroundColor: '#fafafa',
                borderRadius: '8px'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <Box sx={{ position: 'relative' }}>
                <Grid container spacing={1}>
                  {rows.map(row => (
                    <Grid item xs={12} container spacing={1} key={row} justifyContent="center">
                      {cols.map(col => {
                        const seatId = row + col;
                        const seatData = tempSeats.find(s => s.id === seatId);
                        return (
                          <Grid item key={col}>
                            <Tooltip title={seatData.type ? `${seatData.type} - ${seatData.price}đ` : 'Chưa có thông tin'}>
                              <Button
                                data-seat={seatId}
                                variant="contained"
                                ref={el => seatRefs.current[seatId] = el}
                                sx={{
                                  width: '50px',
                                  height: '50px',
                                  backgroundColor: getSeatColor(seatData),
                                  '&:hover': { 
                                    backgroundColor: getSeatColor(seatData),
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                                  },
                                  color: '#000',
                                  fontSize: '0.8rem',
                                  transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                                  borderRadius: '6px',
                                  minWidth: '50px',
                                  minHeight: '50px'
                                }}
                              >
                                {seatId}
                              </Button>
                            </Tooltip>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ))}
                </Grid>
                
                {/* Khung chọn */}
                <Box style={selectionBoxStyles} />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Cột Phải: Chú thích */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p:3, borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Chú thích ghế
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Màu sắc và biểu tượng thể hiện loại ghế.
            </Typography>
            <Divider sx={{ mb:2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap:1, mb:2 }}>
              <EventSeat sx={{ color: '#9e9e9e' }} />
              <Typography variant="body1">Ghế Thường (Xám)</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap:1, mb:2 }}>
              <Weekend sx={{ color: '#4caf50' }} />
              <Typography variant="body1">Ghế Đôi (Xanh)</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap:1, mb:2 }}>
              <Star sx={{ color: '#ffeb3b' }} />
              <Typography variant="body1">Ghế VIP (Vàng)</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap:1, mb:2 }}>
              <EventSeatOutlined sx={{ color: '#e0e0e0' }} />
              <Typography variant="body1">Chưa có thông tin</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap:1 }}>
              <EventSeat sx={{ color: '#ff9800' }} />
              <Typography variant="body1">Đang chọn</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Modal nhập thông tin cho nhóm ghế */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cập nhật thông tin cho {selectedSeats.length} ghế</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="seat-type-label">Loại Ghế</InputLabel>
            <Select
              labelId="seat-type-label"
              label="Loại Ghế"
              value={seatType}
              onChange={e => setSeatType(e.target.value)}
            >
              <MenuItem value="Ghế Thường">Ghế Thường</MenuItem>
              <MenuItem value="Ghế Đôi">Ghế Đôi</MenuItem>
              <MenuItem value="Ghế VIP">Ghế VIP</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Giá Ghế (VNĐ)"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={seatPrice}
            onChange={e => setSeatPrice(e.target.value)}
            InputProps={{
              startAdornment: <Typography sx={{ mr:1 }}>₫</Typography>,
              inputProps: { min: 0 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSave} disabled={!seatType || !seatPrice}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận lưu thay đổi */}
      <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)}>
        <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn lưu tất cả các thay đổi không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSaveDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmSave} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút lưu tất cả thay đổi */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setIsSaveDialogOpen(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24, padding: '12px 24px', borderRadius: '50px', boxShadow: 3 }}
        disabled={!roomId} // Chỉ kích hoạt khi room đã được tạo
      >
        Lưu Thay Đổi
      </Button>

      {/* Snackbar thông báo */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Cập nhật thông tin ghế thành công!
        </Alert>
      </Snackbar>

      {/* Snackbar lỗi */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddRoom;
