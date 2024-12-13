import React, { useState } from 'react';
import Header from '../components/Header';  // Import Header
import Sidebar from '../components/Sidebar'; // Import Sidebar
import { Box } from '@mui/material';

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Sidebar toggleNavbar={toggleSidebar} isCollapsed={isSidebarCollapsed} />

        {/* Content */}
        <Box
          component="main"
          sx={{
            marginTop: '80px', // Đảm bảo khoảng cách với header (80px là chiều cao của header)
            marginLeft: isSidebarCollapsed ? '60px' : '240px', // Adjust for collapsed/expanded sidebar
            padding: '16px',
            bgcolor: '#f4f6f8',
            flex: 1,
            height: 'calc(100vh - 80px)', // Giữ cho phần content không bị tràn
            overflowY: 'auto',
            transition: 'margin-left 0.3s ease', // Smooth transition khi Sidebar mở/đóng
            // Ẩn thanh cuộn cho Webkit (Chrome, Safari)
          '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {children}
        </Box>
      </div>
    </div>
  );
};

export default AdminLayout;
