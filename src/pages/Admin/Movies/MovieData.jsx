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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Search, Visibility } from '@mui/icons-material';
import config from '../../../config';
import { useDeleteMovie, useGetMovies, useGetMovieById } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

const { Text } = Typography;

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
                style={{ width: '100px', borderRadius: '8px' }}
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
        render: (gia_ve) => formatCurrency(gia_ve),
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
    {
        title: 'Xem Chi Tiết',
        dataIndex: 'view',
        render: (_, record) => (
            <Visibility
                fontSize="small"
                style={{ cursor: 'pointer' }}
                onClick={() => handleViewDetail(record.id)}
            />
        ),
    }
];

// Hàm transform dữ liệu
function transformData(dt, navigate, setIsDisableOpen, setViewData) {
    return dt?.map((item) => {
        return {
            ten_phim: item.ten_phim,
            dao_dien: item.dao_dien,
            dien_vien: item.dien_vien,
            gia_ve: item.gia_ve,
            anh_phim: item.anh_phim,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white transition"
                        onClick={() => setViewData(item)}
                    >
                        <Visibility />
                    </Button>
                    <Button
                        className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white transition"
                        onClick={() => navigate(`${config.routes.admin.movies}/update/${item.id}`)}
                    >
                        <Edit />
                    </Button>
                    <Button
                        className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition"
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    >
                        <Delete />
                    </Button>
                </div>
            ),
        };
    });
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
        const dt = transformData(data.data, navigate, setIsDisableOpen, handleViewDetail);
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
        setTData(transformData(filteredData, navigate, setIsDisableOpen, handleViewDetail));
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {baseColumns.map((col, index) => (
                                <TableCell key={index}>{col.title}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tdata.map((row, index) => (
                            <TableRow key={index}>
                                {baseColumns.map((col, idx) => (
                                    <TableCell key={idx}>
                                        {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
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

            <Modal
                open={openDetailModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Paper sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
                    {movieDetailData && (
                        <div>
                            <img
                                src={`http://localhost:8000${movieDetailData.anh_phim}`}
                                alt="Movie Poster"
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
                            />
                            <Typography variant="h6">Thông tin phim</Typography>
                            <p><strong>Tên phim:</strong> {movieDetailData.ten_phim}</p>
                            <p><strong>Đạo diễn:</strong> {movieDetailData.dao_dien}</p>
                            <p><strong>Diễn viên:</strong> {movieDetailData.dien_vien}</p>
                            <p><strong>Giá vé:</strong> {formatCurrency(movieDetailData.gia_ve)}</p>
                        </div>
                    )}
                </Paper>
            </Modal>

            <Snackbar
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                autoHideDuration={4000}
            />
        </Paper>
    );
}

export default MovieData;
