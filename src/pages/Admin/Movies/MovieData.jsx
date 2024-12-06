import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Snackbar,
    Typography,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Search, Visibility } from '@mui/icons-material';
import config from '../../../config';
import { useDeleteMovie, useGetMovies, useGetMovieById } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

const { Text } = Typography;

const baseColumns = [
    {
        title: 'Ảnh',
        dataIndex: 'anh_phim',
        render: (text) => (
            <img
                src={`http://localhost:8000${text}`}
                alt="Movie Poster"
                style={{
                    width: '80px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            />
        ),
    },
    {
        title: 'Tên Phim',
        dataIndex: 'ten_phim',
    },
    {
        title: 'Đạo Diễn',
        dataIndex: 'dao_dien',
    },
    {
        title: 'Giá Vé',
        dataIndex: 'gia_ve',
    },
    {
        title: 'Thời Gian Phim',
        dataIndex: 'thoi_gian_phim',
    },
    {
        title: 'Hình Thức Phim',
        dataIndex: 'hinh_thuc_phim',
        render: (value) => (
            <span
                style={{
                    color: value === 'Đang Chiếu' ? '#2ecc71' : value === 'Sắp Công Chiếu' ? '#e74c3c' : '#34495e',
                    fontWeight: 'bold',
                }}
            >
                {value}
            </span>
        ),
    },
    {
        title: 'Thao Tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
    {
        title: 'Xem Chi Tiết',
        dataIndex: 'view',
        render: (text) => <Visibility fontSize="small" style={{ cursor: 'pointer' }} onClick={text} />,
    }
];

function transformData(dt, navigate, setIsDisableOpen, setOpenDetailModal) {
    return dt?.map((item) => ({
        ten_phim: item.ten_phim,
        dao_dien: item.dao_dien,
        gia_ve: item.gia_ve,
        thoi_gian_phim: item.thoi_gian_phim,
        hinh_thuc_phim: item.hinh_thuc_phim,
        anh_phim: item.anh_phim,
        action: (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<Edit />}
                    style={{
                        textTransform: 'none',
                        borderRadius: '6px',
                        fontWeight: '500',
                    }}
                    onClick={() => navigate(`${config.routes.admin.movies}/update/${item.id}`)}
                >
                    Sửa
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    style={{
                        textTransform: 'none',
                        borderRadius: '6px',
                        fontWeight: '500',
                    }}
                    onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                >
                    Xóa
                </Button>
            </div>
        ),
        view: () => setOpenDetailModal(item.id), // Open the detail modal when clicked
    }));
}

function MovieData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [movieDetail, setMovieDetail] = useState(null);
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetMovies();
    const { data: movieDetailData, isLoading: isDetailLoading } = useGetMovieById(movieDetail?.id);
    const [tdata, setTData] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen, setOpenDetailModal);
        setTData(dt);
    }, [isLoading, data]);

    const mutationDelete = useDeleteMovie({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            setSnackbarMessage('Xóa phim thành công');
            setOpenSnackbar(true);
            refetch();
        },
        error: () => {
            setSnackbarMessage('Xóa phim thất bại');
            setOpenSnackbar(true);
        },
        obj: { id: isDisableOpen.id },
    });

    const onDelete = async () => {
        await mutationDelete.mutateAsync(isDisableOpen.id);
    };

    const onSearch = (value) => {
        const filteredData = data.data.filter((item) =>
            item.ten_phim.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, navigate, setIsDisableOpen, setOpenDetailModal));
    };

    const handleCloseModal = () => setOpenDetailModal(false);

    const handleViewDetail = (movieId) => {
        // Fetch movie details
        setMovieDetail({ id: movieId });
        setOpenDetailModal(true);
    };

    return (
        <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Tìm kiếm phim..."
                    onChange={(e) => onSearch(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <Search />
                            </IconButton>
                        ),
                    }}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                    }}
                />
            </div>
            <TableContainer>
                <Table aria-label="Movies Table">
                    <TableHead>
                        <TableRow>
                            {baseColumns.map((column) => (
                                <TableCell
                                    key={column.title}
                                    sx={{ fontWeight: 'bold', color: '#34495e', backgroundColor: '#ecf0f1' }}
                                >
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tdata.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                }}
                            >
                                {baseColumns.map((column) => (
                                    <TableCell key={column.title}>
                                        {column.render ? column.render(row[column.dataIndex]) : row[column.dataIndex]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có chắc muốn xóa phim này không?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />

            {/* Movie Detail Modal */}
            <Dialog open={openDetailModal} onClose={handleCloseModal}>
                <DialogTitle>Xem Chi Tiết Phim</DialogTitle>
                <DialogContent>
                    {isDetailLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <>
                            <Typography variant="h6">{movieDetailData?.ten_phim}</Typography>
                            <img
                                src={`http://localhost:8000${movieDetailData?.anh_phim}`}
                                alt="Movie Poster"
                                style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '16px' }}
                            />
                            <Typography variant="body1"><strong>Đạo diễn:</strong> {movieDetailData?.dao_dien}</Typography>
                            <Typography variant="body1"><strong>Diễn viên:</strong> {movieDetailData?.dien_vien}</Typography>
                            <Typography variant="body1"><strong>Nội dung:</strong> {movieDetailData?.noi_dung}</Typography>
                            <Typography variant="body1"><strong>Trailer:</strong> <a href={movieDetailData?.trailer} target="_blank" rel="noopener noreferrer">Xem Trailer</a></Typography>
                            <Typography variant="body1"><strong>Giá vé:</strong> {movieDetailData?.gia_ve} VNĐ</Typography>
                            <Typography variant="body1"><strong>Thể loại phim:</strong> {movieDetailData?.movie_genres.map((genre) => genre.ten_loai_phim).join(', ')}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default MovieData;
