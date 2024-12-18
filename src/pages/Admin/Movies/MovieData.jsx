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
    Modal,
    Grid,
    Chip,
    CircularProgress,
    Box,
    Tooltip,
    Divider,
    InputAdornment,
    TablePagination,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Search, Visibility ,Close  } from '@mui/icons-material';
import axios from 'axios';
import config from '../../../config';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

// Định nghĩa đối tượng ánh xạ
const hinhThucPhimMap = {
    0: 'Đang Chiếu',
    1: 'Sắp Công Chiếu',
};

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Cột trong bảng
const baseColumns = [
    {
        title: 'Ảnh',
        dataIndex: 'anh_phim',
        render: (text) => (
            <img
                src={`http://localhost:8000${text}`}
                alt="Movie Poster"
                style={{ width: '80px', borderRadius: '8px' }}
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
        title: 'Thời Gian Phim',
        dataIndex: 'thoi_gian_phim',
        render: (value) => `${value} phút`,
    },
    {
        title: 'Hình Thức Phim',
        dataIndex: 'hinh_thuc_phim',
        render: (value) => (
            <span
                style={{
                    color: value === '0' ? '#2ecc71' : value === '1' ? '#e74c3c' : '#34495e',
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
];

// Hàm transform dữ liệu
function transformData(dt, navigate, setIsDisableOpen, handleViewDetail) {
    return dt?.map((item) => {
        return {
            ten_phim: item.ten_phim,
            dao_dien: item.dao_dien,
            dien_vien: item.dien_vien,
            gia_ve: item.gia_ve,
            anh_phim: item.anh_phim,
            thoi_gian_phim: item.thoi_gian_phim,
            // Sử dụng ánh xạ để chuyển đổi hinh_thuc_phim
            hinh_thuc_phim: hinhThucPhimMap[item.hinh_thuc_phim] || 'Unknown',
            action: (
                <div className="action-btn flex gap-3">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            onClick={() => handleViewDetail(item.id)}
                            variant="contained"
                            size="small"
                            startIcon={<Visibility />}
                            sx={{ textTransform: 'none', backgroundColor: '#1976d2' }}
                        >
                            Xem
                        </Button>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            onClick={() => navigate(`${config.routes.admin.movies}/update/${item.id}`)}
                            variant="contained"
                            size="small"
                            startIcon={<Edit />}
                            sx={{ textTransform: 'none', backgroundColor: '#ffa726' }}
                        >
                            Sửa
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xóa phim">
                        <Button
                            onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                            variant="contained"
                            size="small"
                            startIcon={<Delete />}
                            sx={{ textTransform: 'none', backgroundColor: '#ef5350' }}
                        >
                            Xóa
                        </Button>
                    </Tooltip>
                </div>
            ),
        };
    });
}

function MovieData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [movieDetailId, setMovieDetailId] = useState(null); // Lưu ID phim để lấy chi tiết
    const [movieDetailData, setMovieDetailData] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch danh sách phim
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/movies`);
                setData(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setSnackbarMessage('Đã xảy ra lỗi khi tải danh sách phim');
                setOpenSnackbar(true);
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // Transform dữ liệu sau khi fetch
    const [tdata, setTData] = useState([]);

    useEffect(() => {
        if (isLoading || !data) return;
        const transformed = transformData(data, navigate, setIsDisableOpen, handleViewDetail);
        setTData(transformed);
    }, [isLoading, data]);

    // Hàm xóa phim
    const onDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/movies/${isDisableOpen.id}`);
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            setSnackbarMessage('Xóa phim thành công');
            setOpenSnackbar(true);
            // Refetch danh sách phim
            const response = await axios.get(`http://127.0.0.1:8000/api/movies`);
            setData(response.data.data);
        } catch (error) {
            console.error('Error deleting movie:', error);
            setSnackbarMessage('Xóa phim thất bại');
            setOpenSnackbar(true);
        }
    };

    // Hàm tìm kiếm phim
    const onSearch = (value) => {
        const filteredData = data.filter((item) =>
            item.ten_phim.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, navigate, setIsDisableOpen, handleViewDetail));
        setPage(0); // Reset to first page on search
    };

    // Hàm đóng modal chi tiết
    const handleCloseModal = () => {
        setOpenDetailModal(false);
        setMovieDetailId(null); // Reset ID khi đóng modal
        setMovieDetailData(null);
    };

    // Hàm xem chi tiết phim
    const handleViewDetail = async (movieId) => {
        setMovieDetailId(movieId);
        setOpenDetailModal(true);
        setIsDetailLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/showMovie/${movieId}`);
            setMovieDetailData(response.data.data);
            setIsDetailLoading(false);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi tải chi tiết phim');
            setOpenSnackbar(true);
            setIsDetailLoading(false);
        }
    };

    // Handle pagination change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate the data to display on the current page
    const paginatedData = tdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                overflowX: 'auto',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Danh Sách Phim
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box mb={2}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Tìm kiếm phim..."
                    onChange={(e) => onSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                    }}
                />
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {baseColumns.map((col, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f0f0f0',
                                        fontSize: '14px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {col.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={baseColumns.length} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((row, index) => (
                                <TableRow
                                    key={index}
                                    hover
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        fontSize: '14px',
                                    }}
                                >
                                    {baseColumns.map((col, idx) => (
                                        <TableCell
                                            key={idx}
                                            sx={{
                                                fontSize: '14px',
                                                textAlign: col.title === 'Thao Tác' ? 'center' : 'left',
                                            }}
                                        >
                                            {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={baseColumns.length} align="center">
                                    Không tìm thấy dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* Pagination Controls */}
                {!isLoading && paginatedData.length > 0 && (
                    <TablePagination
                        component="div"
                        count={tdata.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        sx={{
                            '.MuiTablePagination-toolbar': {
                                padding: '16px',
                            },
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                margin: '0',
                            },
                        }}
                    />
                )}
            </TableContainer>

            {/* Confirm Delete Prompt */}
            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có chắc muốn xóa phim này không?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}

           {/* Modal Chi Tiết Phim */}
<Modal
    open={openDetailModal}
    onClose={handleCloseModal}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
>
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={2}
    >
        <Paper
            sx={{
                p: 4,
                maxWidth: '1400px',
                width: '100%',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                maxHeight: '90vh',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                position: 'relative',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            {isDetailLoading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                    <CircularProgress />
                </Grid>
            ) : movieDetailData ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={5}>
                        <img
                            src={`http://localhost:8000${movieDetailData.anh_phim}`}
                            alt="Movie Poster"
                            style={{ width: '100%', borderRadius: '12px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Thông tin phim
                            </Typography>
                            {/* Thay thế Delete bằng Close và thêm aria-label */}
                            <IconButton onClick={handleCloseModal} aria-label="Đóng modal">
                                <Close />
                            </IconButton>
                        </Box>
                        <Typography variant="subtitle1"><strong>Tên phim:</strong> {movieDetailData.ten_phim}</Typography>
                        <Typography variant="subtitle1"><strong>Đạo diễn:</strong> {movieDetailData.dao_dien}</Typography>
                        <Typography variant="subtitle1"><strong>Diễn viên:</strong> {movieDetailData.dien_vien}</Typography>
                        <Typography variant="subtitle1"><strong>Thời gian:</strong> {movieDetailData.thoi_gian_phim} phút</Typography>
                        {/* Sử dụng ánh xạ để chuyển đổi hinh_thuc_phim */}
                        <Typography variant="subtitle1"><strong>Hình thức:</strong> {hinhThucPhimMap[movieDetailData.hinh_thuc_phim] || 'Unknown'}</Typography>
                        
                        <Box mt={2}>
                            <Typography variant="subtitle1"><strong>Thể loại:</strong></Typography>
                            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                {movieDetailData.movie_genres.map((genre) => (
                                    <Chip key={genre.id} label={genre.ten_loai_phim} />
                                ))}
                            </Box>
                        </Box>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}><strong>Nội dung:</strong></Typography>
                        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                            {movieDetailData.noi_dung}
                        </Typography>
                        
                        {movieDetailData.trailer && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}><strong>Trailer:</strong></Typography>
                                <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                    <iframe
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
                                        src={movieDetailData.trailer.replace('watch?v=', 'embed/')}
                                        title="Trailer"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="h6">Không tìm thấy thông tin phim.</Typography>
            )}
        </Paper>
    </Box>
</Modal>


            {/* Snackbar Thông Báo */}
            <Snackbar
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                ContentProps={{
                    sx: {
                        backgroundColor: snackbarMessage.includes('thành công') ? '#4caf50' : '#f44336',
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                }}
            />
        </Paper>
    );
}

export default MovieData;
