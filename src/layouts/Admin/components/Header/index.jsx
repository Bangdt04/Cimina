import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Badge,
  Box,
  Avatar,
  InputAdornment,
  Button,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  Notifications,
  ExpandMore,
  Settings,
  Clear,
  Send,
} from '@mui/icons-material';
import Flag from 'react-world-flags';
import axios from 'axios';
import { clearToken, isTokenStoraged, getRoles, getInfoAuth } from '../../../../utils/storage';

function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // State for Contacts
  const [contacts, setContacts] = useState([]);
  const [isContactsLoading, setIsContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState(null);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  // State for Snackbar Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  });

  // State to track if the initial notification has been shown
  const [initialNotificationShown, setInitialNotificationShown] = useState(false);

  // State for Respond Dialog
  const [currentRespondContact, setCurrentRespondContact] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [isSending, setIsSending] = useState(false); // New state for sending

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);
  const toggleContactsModal = () => setIsContactsModalOpen(!isContactsModalOpen);
  const toggleRespondDialog = () => setCurrentRespondContact(null);

  // Fetch Contacts Data
  useEffect(() => {
    const fetchContacts = async () => {
      setIsContactsLoading(true);
      try {
        const tokenData = localStorage.getItem('token');
        const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

        const response = await axios.get('http://127.0.0.1:8000/api/contact-details', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setContacts(response.data.data);
        } else {
          setContactsError('Không thể tải dữ liệu liên hệ.');
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setContactsError('Đã xảy ra lỗi khi tải dữ liệu liên hệ.');
      } finally {
        setIsContactsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Handle Click Outside Menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // Calculate Unread Contacts
  const unreadCount = contacts.filter(contact => contact.trang_thai === 'Chưa phản hồi').length;

  const handleRespond = async (contactId, responseContent) => {
    try {
      console.log('Đang gửi phản hồi:', { admin_reply: responseContent }); // Debugging

      const tokenData = localStorage.getItem('token');
      const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

      const response = await axios.post(
        `http://127.0.0.1:8000/api/send-response/${contactId}`,
        { admin_reply: responseContent }, // Sử dụng tên trường chính xác theo API
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Update the contact's status locally
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === contactId ? { ...contact, trang_thai: 'Đã phản hồi' } : contact
          )
        );

        // Show success snackbar
        setSnackbar({
          open: true,
          message: 'Phản hồi đã được gửi thành công.',
          severity: 'success',
        });
      } else {
        throw new Error('Failed to send response.');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      // Kiểm tra phản hồi từ server để hiển thị thông báo lỗi cụ thể
      if (error.response && error.response.data && error.response.data.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Đã xảy ra lỗi khi gửi phản hồi.',
          severity: 'error',
        });
      }
    }
  };

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Open Respond Dialog
  const openRespondDialog = (contact) => {
    setCurrentRespondContact(contact);
    setResponseContent('');
  };

  // Close Respond Dialog
  const closeRespondDialog = () => {
    setCurrentRespondContact(null);
    setResponseContent('');
  };

  // Handle Send Response
  const handleSendResponse = async () => {
    if (currentRespondContact && responseContent.trim()) {
      setIsSending(true);
      await handleRespond(currentRespondContact.id, responseContent.trim());
      setIsSending(false);
      closeRespondDialog();
    } else {
      setSnackbar({
        open: true,
        message: 'Nội dung phản hồi không được để trống.',
        severity: 'warning',
      });
    }
  };

  // Show initial notification if there are unread contacts
  useEffect(() => {
    if (!initialNotificationShown && unreadCount > 0) {
      setSnackbar({
        open: true,
        message: `Có ${unreadCount} phản hồi chưa được phản hồi.`,
        severity: 'info',
      });
      setInitialNotificationShown(true);
    }
  }, [unreadCount, initialNotificationShown]);
  const onLogout = () => {
    clearToken();
    window.location.reload();
};

  return (
    <header style={{ position: 'fixed', width: '100%', zIndex: 1100, top: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px',
          bgcolor: '#ffffff',
          color: '#000000',
          alignItems: 'center',
          height: '80px',
          boxSizing: 'border-box',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: '700', fontSize: '26px', color: '#1976d2' }}>
            ADMIN
          </Link>
        </Box>

        {/* Search and User Menus */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Search */}
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm..."
            sx={{
              width: '400px',
              backgroundColor: '#f0f2f5',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')}>
                      <Clear color="action" />
                    </IconButton>
                  </InputAdornment>
                )
              ),
            }}
          />

          {/* Notification Icon */}
          <Tooltip title="Thông báo">
            <IconButton color="inherit" onClick={toggleContactsModal} aria-label="Thông báo">
              <Badge badgeContent={unreadCount} color="error">
                <Notifications sx={{ fontSize: '28px' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Language Dropdown */}
          <Box ref={languageMenuRef}>
            <Button
              endIcon={<ExpandMore />}
              onClick={toggleLanguageMenu}
              sx={{
                textTransform: 'none',
                padding: '8px 12px',
                bgcolor: '#f0f2f5',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#e0e2e5',
                },
                color: '#000',
              }}
              aria-haspopup="true"
              aria-expanded={isLanguageMenuOpen ? 'true' : undefined}
              aria-label="Chọn ngôn ngữ"
            >
              <Flag code="VN" style={{ width: 20, marginRight: '8px' }} />
              Tiếng Việt
            </Button>
            <Menu
              anchorEl={languageMenuRef.current}
              open={isLanguageMenuOpen}
              onClose={() => setIsLanguageMenuOpen(false)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => setIsLanguageMenuOpen(false)}>
                <Flag code="VN" style={{ width: 20, marginRight: '8px' }} />
                Tiếng Việt
              </MenuItem>
              <MenuItem onClick={() => setIsLanguageMenuOpen(false)}>
                <Flag code="US" style={{ width: 20, marginRight: '8px' }} />
                English
              </MenuItem>
            </Menu>
          </Box>

          {/* Settings Icon */}
          <Tooltip title="Cài đặt">
            <IconButton color="inherit" aria-label="Cài đặt">
              <Settings sx={{ fontSize: '28px' }} />
            </IconButton>
          </Tooltip>

          {/* User Dropdown */}
          <Box ref={userMenuRef}>
            <Button
              endIcon={<ExpandMore />}
              onClick={toggleUserMenu}
              sx={{
                textTransform: 'none',
                padding: '8px 12px',
                bgcolor: '#f0f2f5',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#e0e2e5',
                },
                color: '#000',
              }}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? 'true' : undefined}
              aria-label="Menu người dùng"
            >
              <Avatar
                alt="User Avatar"
                src="https://i.pravatar.cc/300"
                sx={{ width: 36, height: 36, marginRight: '8px' }}
              />
              Quản Trị Viên
            </Button>
            <Menu
              anchorEl={userMenuRef.current}
              open={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => setIsUserMenuOpen(false)}>Hồ sơ</MenuItem>
              <MenuItem onClick={() => setIsUserMenuOpen(false)}>Cài đặt</MenuItem>
              <MenuItem
  onClick={() => {
    onLogout(); // Call the logout function
    setIsUserMenuOpen(false); // Close the user menu
  }}
>
  Đăng xuất
</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Contacts Modal */}
      <Dialog
        open={isContactsModalOpen}
        onClose={toggleContactsModal}
        fullWidth
        maxWidth="sm"
        aria-labelledby="contacts-dialog-title"
      >
        <DialogTitle id="contacts-dialog-title" sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
          Thông Báo Liên Hệ
        </DialogTitle>
        <DialogContent dividers>
          {isContactsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </Box>
          ) : contactsError ? (
            <Typography color="error">{contactsError}</Typography>
          ) : contacts.length === 0 ? (
            <Typography>Không có liên hệ nào.</Typography>
          ) : (
            <List>
              {contacts.map((contact) => (
                <Paper key={contact.id} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f9f9f9' }}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={contact.ho_ten}
                        src={`https://i.pravatar.cc/150?u=${contact.email}`} // Unique avatar based on email
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="#1976d2">
                            {contact.ho_ten}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={contact.trang_thai === 'Chưa phản hồi' ? 'error' : 'success'}
                          >
                            {contact.trang_thai}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            <strong>Nội dung:</strong> {contact.noidung}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {contact.trang_thai === 'Chưa phản hồi' && (
                    <Box sx={{ marginTop: 1, textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<Send />}
                        onClick={() => openRespondDialog(contact)}
                      >
                        Phản hồi
                      </Button>
                    </Box>
                  )}
                </Paper>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleContactsModal} color="primary" variant="outlined" aria-label="Đóng thông báo liên hệ">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog
        open={Boolean(currentRespondContact)}
        onClose={closeRespondDialog}
        fullWidth
        maxWidth="sm"
        aria-labelledby="respond-dialog-title"
      >
        <DialogTitle id="respond-dialog-title" sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
          Phản hồi cho {currentRespondContact?.ho_ten}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            name='admin_reply' // Đổi tên từ 'noidung' sang 'admin_reply'
            autoFocus
            margin="dense"
            label="Nội dung phản hồi"
            type="text"
            fullWidth
            variant="outlined"
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            multiline
            rows={4}
            placeholder="Nhập nội dung phản hồi tại đây..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRespondDialog} color="secondary" variant="outlined" aria-label="Hủy phản hồi">
            Hủy
          </Button>
          <Button
            onClick={handleSendResponse}
            color="primary"
            variant="contained"
            disabled={!responseContent.trim() || isSending}
            endIcon={isSending ? <CircularProgress size={20} /> : <Send />}
            aria-label="Gửi phản hồi"
          >
            Gửi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </header>
  );
}

export default Header;
