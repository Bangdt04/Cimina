import { Button, Typography, Box } from '@mui/material';
import { Add } from '@mui/icons-material'; // MUI icons
import { useNavigate } from 'react-router-dom';

function Head({ route, title, isAdd = true }) {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            {/* Title and Hashtag Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'primary.main',  // Màu chủ đạo của theme
                        borderRadius: '50%',
                        color: 'white',
                    }}
                >
                    <Typography variant="h6">#</Typography> {/* Ký tự # */}
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{title}</Typography> {/* Tiêu đề */}
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                {isAdd && (
                    <Button
                        variant="outlined"
                        color="primary" // Màu chủ đạo của theme cho "Thêm mới"
                        startIcon={<Add />}
                        onClick={() => navigate(route)}
                        sx={{
                            textTransform: 'none',
                            fontSize: '1rem',
                            borderColor: '#fff',  // Viền nút màu trắng để nổi bật trên nền tối
                            color: '#fff',  // Màu chữ trắng
                            '&:hover': {
                                backgroundColor: '#fff', // Đổi màu nền khi hover
                                color: 'primary.main', // Chữ màu chủ đạo khi hover
                            },
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
