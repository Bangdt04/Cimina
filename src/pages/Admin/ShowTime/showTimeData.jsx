import { Button, Table, notification, Modal, Typography, Input, DatePicker, Row, Col, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import config from '../../../config';
import { useDeleteShowtime, useShowtimes } from '../../../hooks/api/useShowtimeApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import dayjs from 'dayjs'; // Import dayjs

const { Title, Text } = Typography;

const baseColumns = [
    {
        title: 'Tên phim',
        dataIndex: 'ten_phim',
        sorter: true,
        render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
        title: 'Ngày chiếu',
        dataIndex: 'ngay_chieu',
        render: (text) => dayjs(text).format('DD/MM/YYYY'), // Format the date
    },
    {
        title: 'Giờ chiếu',
        dataIndex: 'gio_chieu',
        render: (text) => dayjs(text, 'HH:mm:ss').format('HH:mm'), // Format the time
    },
    {
        title: 'Phòng chiếu',
        dataIndex: 'ten_phong_chieu',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

function transformData(dt, navigate, setIsDisableOpen) {
    return dt?.map((item) => {
        return {
            key: item.id,
            ten_phim: item.movie.ten_phim,
            ngay_chieu: item.ngay_chieu,
            gio_chieu: item.gio_chieu,
            ten_phong_chieu: item.room.ten_phong_chieu,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        icon={<EditOutlined />}
                        className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white transition-all"
                        onClick={() => navigate(`${config.routes.admin.showTime}/update/${item.id}`)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all"
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                        size="small"
                    >
                        Xóa
                    </Button>
                </div>
            ),
        };
    });
}

function ShowTimeData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [filters, setFilters] = useState({ movie: '', showDate: '' });
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useShowtimes(filters); // Fetch data based on filters
    const [tdata, setTData] = useState([]);
    const [movies, setMovies] = useState([]);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        if (data && data.data) {
            const moviesList = [...new Set(data.data.map(item => item.movie.ten_phim))]; // Get unique movie names
            const datesList = [...new Set(data.data.map(item => item.ngay_chieu))]; // Get unique show dates
            setMovies(moviesList);
            setDates(datesList);
            // Transform data for table display
            const transformedData = transformData(data?.data, navigate, setIsDisableOpen);
            setTData(transformedData);
        }
    }, [data]);

    useEffect(() => {
        refetch(); // Trigger API call when filters change
    }, [filters, refetch]);

    const mutationDelete = useDeleteShowtime({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({ message: 'Xóa thành công', placement: 'topRight' });
            refetch();
        },
        error: () => {
            notification.error({ message: 'Xóa thất bại', placement: 'topRight' });
        },
        obj: { id: isDisableOpen.id },
    });

    const onDelete = async (id) => {
        await mutationDelete.mutateAsync(id);
    };

    const handleFilterChange = (value, field) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Filter Section */}
            <div className="filter-section mb-6 border-b-2 pb-4">
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Input
                            placeholder="Nhập tên phim"
                            value={filters.movie}
                            onChange={(e) => handleFilterChange(e.target.value, 'movie')}
                            allowClear
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={8}>
                        <DatePicker
                            placeholder="Chọn ngày chiếu"
                            value={filters.showDate ? dayjs(filters.showDate) : null}
                            onChange={(date) => handleFilterChange(date ? date.format('YYYY-MM-DD') : '', 'showDate')}
                            style={{ width: '100%' }}
                            allowClear
                            className="custom-datepicker"
                        />
                    </Col>
                    <Col span={8}>
                        <Button
                            type="primary"
                            onClick={() => refetch()} // Trigger refetch manually if necessary
                            style={{ width: '100%', height: '100%' }}
                            icon={<SearchOutlined />}
                        >
                            Lọc
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Loading Spinner */}
            {isLoading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                // Table
                <Table
                    loading={isLoading}
                    columns={baseColumns}
                    dataSource={tdata}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-200')}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                />
            )}

            {isDisableOpen.id !== 0 && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa thời gian chiếu này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}
        </div>
    );
}

export default ShowTimeData;
