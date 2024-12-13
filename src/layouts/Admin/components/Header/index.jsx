import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import { Search, Notifications, ExpandMore, Settings, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags'; // Import thư viện flag

function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

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

  return (
    <header style={{ position: 'fixed', width: '100%', zIndex: 1100, top: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 30px', // Tăng padding cho khoảng cách tốt hơn
          bgcolor: '#ffffff', // Đặt nền màu trắng
          color: '#000000', // Đặt màu chữ màu đen
          alignItems: 'center',
          height: '80px', // Tăng chiều cao cho header rộng rãi hơn
          boxSizing: 'border-box',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ để tạo chiều sâu
          borderBottom: '1px solid #e0e0e0', // Tách biệt nhẹ với nội dung
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '24px', color: '#000' }}>
            ADMIN
          </Link>
        </Box>

        {/* Search và menu người dùng */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Search */}
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            sx={{
              width: '400px',
              backgroundColor: '#f5f5f5', // Nền nhẹ cho ô tìm kiếm
              borderRadius: 6,
              '& .MuiOutlinedInput-root': {
                borderRadius: 6,
              },
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              ),
            }}
          />

          {/* Icon Thông báo */}
          <Tooltip title="Thông báo">
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Dropdown Ngôn ngữ */}
          <Box ref={languageMenuRef}>
            <Button
              endIcon={<ExpandMore />}
              onClick={toggleLanguageMenu}
              sx={{
                textTransform: 'none',
                padding: '8px 16px',
                bgcolor: '#f5f5f5',
                borderRadius: 6,
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                color: '#000',
              }}
            >
              <Flag code="VN" style={{ width: 20, marginRight: 8 }} />
              Vietnamese
            </Button>
            <Menu
              anchorEl={languageMenuRef.current}
              open={isLanguageMenuOpen}
              onClose={() => setIsLanguageMenuOpen(false)}
            >
              <MenuItem onClick={() => setIsLanguageMenuOpen(false)}>
                <Flag code="VN" style={{ width: 20, marginRight: 8 }} />
                Tiếng Việt
              </MenuItem>
              <MenuItem onClick={() => setIsLanguageMenuOpen(false)}>
                <Flag code="US" style={{ width: 20, marginRight: 8 }} />
                English
              </MenuItem>
            </Menu>
          </Box>

          {/* Icon Cài đặt */}
          <Tooltip title="Cài đặt">
            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </Tooltip>

          {/* Dropdown Người dùng */}
          <Box ref={userMenuRef}>
            <Button
              endIcon={<ExpandMore />}
              onClick={toggleUserMenu}
              sx={{
                textTransform: 'none',
                padding: '8px 16px',
                bgcolor: '#f5f5f5',
                borderRadius: 6,
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                color: '#000',
              }}
            >
              <Avatar alt="User Avatar" src="https://i.pravatar.cc/300" sx={{ width: 36, height: 36, marginRight: 1 }} />
              Quản Trị Viên
            </Button>
            <Menu
              anchorEl={userMenuRef.current}
              open={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
            >
              <MenuItem onClick={() => setIsUserMenuOpen(false)}>Profile</MenuItem>
              <MenuItem onClick={() => setIsUserMenuOpen(false)}>Settings</MenuItem>
              <MenuItem onClick={() => setIsUserMenuOpen(false)}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </header>
  );
}

export default Header;
