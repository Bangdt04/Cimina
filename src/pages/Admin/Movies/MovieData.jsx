import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import config from '../../../config';
import { useDeleteMovie, useGetMovies } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { Search } from '@mui/icons-material';

const { Title, Text } = Typography;

const baseColumns = [
    {
        title: 'Ảnh',
        dataIndex: 'anh_phim',
        render: (text) => <img src={`http://localhost:8000${text}`} alt="Movie Poster" style={{ width: '100px', borderRadius: '8px' }} />,
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
                    color: value === 'Đang Chiếu' ? 'green' : value === 'Sắp Công Chiếu' ? 'red' : 'black',
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

function transformData(dt, navigate, setIsDisableOpen, setViewData) {
    return dt?.map((item) => {
        return {
            ten_phim: item.ten_phim,
            dao_dien: item.dao_dien,
            gia_ve: item.gia_ve,
            thoi_gian_phim: item.thoi_gian_phim,
            hinh_thuc_phim: item.hinh_thuc_phim,
            anh_phim: item.anh_phim,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Visibility />}
                        onClick={() => setViewData(item)} // Set view data when clicking "view"
                    />
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<Edit />}
                        onClick={() => navigate(`${config.routes.admin.movies}/update/${item.id}`)}
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    />
                </div>
            ),
        };
    });
}

function MovieData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [viewData, setViewData] = useState(null); // Store movie details for modal
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetMovies();
    const [tdata, setTData] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen, setViewData);
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
        setTData(transformData(filteredData, navigate, setIsDisableOpen, setViewData));
    };

    const handleViewClose = () => {
        setViewData(null); // Close the view modal
    };

    return (
        <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <div className="mb-3 flex items-center">
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Nhập từ khoá tìm kiếm"
                    onChange={(e) => onSearch(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <Search />
                            </IconButton>
                        ),
                    }}
                />
            </div>
            <TableContainer>
                <Table loading={isLoading} aria-label="movies table">
                    <TableHead>
                        <TableRow>
                            {baseColumns.map((column) => (
                                <TableCell key={column.title}>{column.title}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tdata.map((row, index) => (
                            <TableRow key={index}>
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
                    content="Bạn có muốn xóa phim này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}

            <Dialog open={!!viewData} onClose={handleViewClose} maxWidth="md">
                <DialogTitle>Chi tiết phim</DialogTitle>
                <DialogContent>
                    {viewData && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            {viewData.anh_phim && (
                                <img
                                    src={`http://localhost:8000${viewData.anh_phim}`}
                                    alt="Movie Poster"
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
                                />
                            )}
                            <Title level={4}>Thông tin phim</Title>
                            <p><strong>Tên phim:</strong> <Text>{viewData.ten_phim}</Text></p>
                            <p><strong>Đạo diễn:</strong> <Text>{viewData.dao_dien}</Text></p>
                            <p><strong>Thời gian phim:</strong> <Text>{viewData.thoi_gian_phim}</Text></p>
                            <p><strong>Hình thức chiếu:</strong> <Text>{viewData.hinh_thuc_phim}</Text></p>
                            <p><strong>Giá vé:</strong> <Text>{viewData.gia_ve}</Text></p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewClose} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </div>
    );
}

export default MovieData;
