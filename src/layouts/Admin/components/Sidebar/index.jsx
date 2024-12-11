import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconMovie,
  IconCalendar,
  IconChefHat,
  IconUsers,
  IconCreditCard,
  IconTags,
  IconArmchair,
  IconDoor,
  IconAddressBook,
  IconArticle,
  IconTicket,
  IconMessageCircle2,
  IconWheel,
  IconCheck
} from '@tabler/icons-react';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const menuItems = [
  { name: 'Dashboard', icon: IconDashboard, path: '/admin/dashboard' },
  { name: 'Movies', icon: IconMovie, path: '/admin/movies' },
  { name: 'Movie Genre', icon: IconTags, path: '/admin/genres' },
  { name: 'Showtime', icon: IconCalendar, path: '/admin/showtime' },
  { name: 'Room', icon: IconDoor, path: '/admin/room' },
  // { name: 'Seat', icon: IconArmchair, path: '/admin/seats' },
  { name: 'Users', icon: IconUsers, path: '/admin/users' },
  { name: 'Bookings', icon: IconCalendar, path: '/admin/bookings' },
  { name: 'Food', icon: IconChefHat, path: '/admin/food' },
  { name: 'Membership', icon: IconUsers, path: '/admin/membership' },
  { name: 'Voucher', icon: IconTicket, path: '/admin/voucher' },
  { name: 'Check', icon: IconCheck, path: '/admin/checkin' },
  { name: 'Contact', icon: IconAddressBook, path: '/admin/contact' },
  { name: 'Blog', icon: IconArticle, path: '/admin/blog' },
  { name: 'Feedback', icon: IconMessageCircle2, path: '/admin/feedback' },
  { name: 'Lucky Wheel', icon: IconWheel, path: '/admin/lucky-wheel' },
];

function Sidebar({ toggleNavbar, isCollapsed }) {
  const location = useLocation();

  return (
    <nav className="sidebar fixed">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isCollapsed ? 60 : 240,
        height: '100vh',
        bgcolor: '#000', // Set default background color to black
        color: '#fff', // Set text color to white
        boxShadow: 2,
        marginTop: '80px', // Adjust margin-top to avoid overlap with header (assuming header is 80px)
        transition: 'width 0.3s ease', // Smooth transition for sidebar width
        overflowY: 'auto', // Added overflow to enable scrolling
        zIndex: 999, // Ensure sidebar appears below the header
      }}>
        {/* Menu Button - Move it to the right */}
        <IconButton color="primary" onClick={toggleNavbar} sx={{ alignSelf: 'flex-end', marginRight: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Sidebar List */}
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.name} style={{ textDecoration: 'none' }}>
                <ListItem button sx={{
                  padding: '12px 0',
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)', // Lighten inactive text
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                    transition: 'background-color 0.5s ease', // Smooth hover effect
                  },
                  transition: 'background-color 0.3s ease', // Smooth background change
                }}>
                  <ListItemIcon sx={{
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)', // Lighten inactive icons
                    transition: 'color 0.3s ease', // Smooth icon color transition
                  }}>
                    <item.icon size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      opacity: isCollapsed ? 0 : 1,
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)', // Lighten inactive text
                      fontWeight: isActive ? 'bold' : 'normal', // Make active item bold
                      transition: 'opacity 0.3s ease, font-weight 0.3s ease', // Smooth text transition
                    }}
                  />
                </ListItem>
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
