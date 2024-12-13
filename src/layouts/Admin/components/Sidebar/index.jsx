import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Import MUI Icons thay thế
import DashboardIcon from '@mui/icons-material/Dashboard';
import MovieIcon from '@mui/icons-material/Movie';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ArticleIcon from '@mui/icons-material/Article';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CasinoIcon from '@mui/icons-material/Casino';

const menuItems = [
  { name: 'Dashboard', icon: DashboardIcon, path: '/admin/dashboard' },
  { name: 'Movies', icon: MovieIcon, path: '/admin/movies' },
  { name: 'Movie Genre', icon: CategoryIcon, path: '/admin/genres' },
  { name: 'Showtime', icon: EventNoteIcon, path: '/admin/showtime' },
  { name: 'Room', icon: MeetingRoomIcon, path: '/admin/room' },
  { name: 'Users', icon: PeopleIcon, path: '/admin/users' },
  { name: 'Bookings', icon: BookOnlineIcon, path: '/admin/bookings' },
  { name: 'Food', icon: FastfoodIcon, path: '/admin/food' },
  { name: 'Member', icon: CardMembershipIcon, path: '/admin/member' },
  { name: 'Voucher', icon: ConfirmationNumberIcon, path: '/admin/voucher' },
  { name: 'Check', icon: CheckCircleIcon, path: '/admin/checkin' },
  { name: 'Contact', icon: ContactMailIcon, path: '/admin/contact' },
  { name: 'Blog', icon: ArticleIcon, path: '/admin/blog' },
  { name: 'Feedback', icon: FeedbackIcon, path: '/admin/feedback' },
  { name: 'Lucky Wheel', icon: CasinoIcon, path: '/admin/lucky-wheel' },
];

function Sidebar({ toggleNavbar, isCollapsed }) {
  const location = useLocation();

  return (
    <nav className="sidebar fixed">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: isCollapsed ? 60 : 240,
          height: '100vh',
          bgcolor: '#ffffff', // Nền trắng
          color: '#000', // Chữ đen
          boxShadow: 2,
          marginTop: '80px', // Giả sử header cao 80px
          transition: 'width 0.3s ease',
          overflowY: 'auto', // Cho phép cuộn
          // Ẩn thanh cuộn cho Firefox
          scrollbarWidth: 'none',
          // Ẩn thanh cuộn cho Webkit (Chrome, Safari)
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          // Ẩn thanh cuộn cho IE 10+
          '-ms-overflow-style': 'none',
          zIndex: 999,
          position: 'fixed',
        }}
      >
        {/* Nút Menu */}
        <IconButton
          onClick={toggleNavbar}
          sx={{
            alignSelf: isCollapsed ? 'center' : 'flex-end',
            margin: '8px',
            color: '#000',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Danh sách Sidebar */}
        <List sx={{ padding: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.name} style={{ textDecoration: 'none' }}>
                <ListItemButton
                  sx={{
                    paddingY: '10px',
                    paddingX: isCollapsed ? '8px' : '16px',
                    backgroundColor: isActive ? 'green' : 'transparent',
                    borderRadius: '4px',
                    marginX: isCollapsed ? '4px' : '8px',
                    marginY: '4px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: isActive
                        ? 'rgba(0, 0, 0, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: '#000',
                      minWidth: '40px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      color: '#000',
                      opacity: isCollapsed ? 0 : 1,
                      transition: 'opacity 0.3s ease',
                      fontWeight: isActive ? 'bold' : 'normal',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  />
                </ListItemButton>
              </Link>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />
      </Box>
    </nav>
  );
}

export default Sidebar;
