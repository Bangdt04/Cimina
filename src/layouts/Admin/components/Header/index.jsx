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
import { Search, Notifications, ExpandMore, Settings, DarkMode, LightMode, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags'; // Import thư viện flag

function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

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
          padding: '0 30px', // Increased padding for better spacing
          bgcolor: isDarkMode ? '#333' : '#2C2C2C', // Darker background for contrast
          color: '#fff',
          alignItems: 'center',
          height: '80px', // Increased height for a spacious header
          boxSizing: 'border-box',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // More prominent shadow for depth
          borderBottom: '2px solid #444', // Subtle separation from content
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '24px', color: '#fff' }}>
            ADMIN
          </Link>
        </Box>

        {/* Search and user menu */}
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
              backgroundColor: theme.palette.background.paper,
              borderRadius: 6,
              '& .MuiOutlinedInput-root': {
                borderRadius: 6,
              },
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
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

          {/* Notification Icon */}
          <Tooltip title="Notifications">
            <IconButton color="primary">
              <Badge badgeContent={3} color="error">
                <Notifications />
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
                padding: '8px 16px',
                bgcolor: theme.palette.background.paper,
                borderRadius: 6,
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                },
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

          {/* Settings Icon */}
          <Tooltip title="Settings">
            <IconButton color="primary">
              <Settings />
            </IconButton>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleDarkMode} color="primary">
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* User Dropdown */}
          <Box ref={userMenuRef}>
            <Button
              endIcon={<ExpandMore />}
              onClick={toggleUserMenu}
              sx={{
                textTransform: 'none',
                padding: '8px 16px',
                bgcolor: theme.palette.background.paper,
                borderRadius: 6,
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                },
              }}
            >
              <Avatar alt="User Avatar" src="https://i.pravatar.cc/300" sx={{ width: 36, height: 36, marginRight: 1 }} />
              Đỗ Trọng Bằng
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
  