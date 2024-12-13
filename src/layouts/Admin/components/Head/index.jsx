import { Button, Typography, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star'; // Thay thế # bằng icon Star
import { useNavigate } from 'react-router-dom';

function Head({ route, title, isAdd = true }) {
  const navigate = useNavigate();
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        borderRadius: 2, 
        p: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      {/* Title and Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Vùng biểu tượng với hiệu ứng gradient */}
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
            borderRadius: '50%',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <StarIcon />
        </Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
          {title}
        </Typography>
      </Box>

      {/* Action Button */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {isAdd && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate(route)}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              borderColor: '#fff',
              color: '#fff',
              borderRadius: 2,
              paddingX: 3,
              paddingY: 1,
              '&:hover': {
                backgroundColor: '#fff',
                color: 'primary.main',
                borderColor: '#fff',
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Thêm mới
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Head;
