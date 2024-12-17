import {
    Button,
    Input,
    Table,
    notification,
    Typography,
    Tooltip,
    Modal,
    Empty,
    Space,
    Row,
    Col,
    Select,
    Form,
    InputNumber,
    Tag,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import debounce from 'lodash.debounce';

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

// Hàm chuyển đổi trạng thái từ số sang nhãn
const getStatusTag = (status) => {
    switch (status) {
        case 0:
            return <Tag color="green">Hoạt động</Tag>;
        case 1:
            return <Tag color="red">Không hoạt động</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
};

// Định nghĩa các cột cơ bản của bảng (Đã loại bỏ cột 'Ngày cập nhật')
const baseColumns = [
    {
        title: 'Loại hội viên',
        dataIndex: 'loai_hoi_vien',
        align: 'center',
        sorter: true,
    },
    {
        title: 'Ảnh Hội viên',
        dataIndex: 'anh_hoi_vien',
        render: (text) => (
            <img
                src={`http://localhost:8000${text}`}
                alt="Hội viên"
                style={{ width: '80px', borderRadius: '8px' }}
            />
        ),
    },
    {
        title: 'Ưu đãi (%)',
        dataIndex: 'uu_dai',
        align: 'center',
        sorter: true,
    },
    {
        title: 'Thời gian (tháng)',
        dataIndex: 'thoi_gian',
        align: 'center',
        sorter: true,
    },
    {
        title: 'Giá (VND)',
        dataIndex: 'gia',
        align: 'center',
        sorter: true,
        render: (text) =>
            new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
            }).format(Number(text)),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        align: 'center',
        filters: [
            { text: 'Hoạt động', value: 0 },
            { text: 'Không hoạt động', value: 1 },
        ],
        onFilter: (value, record) => record.trang_thai === value,
        render: (status) => getStatusTag(status),
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghi_chu',
        align: 'center',
        ellipsis: true,
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        align: 'center',
        sorter: true,
        render: (text) => new Date(text).toLocaleString(),
    },
];

// Định nghĩa các cột của bảng (Đã thêm cột 'Hành động')
function MembershipData() {
    const [data, setData] = useState([]); // Đảm bảo data luôn là mảng
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
    });
    const [sorter, setSorter] = useState({});
    const [filters, setFilters] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const tokenData = localStorage.getItem('token');
    const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;
    const [hasError, setHasError] = useState(false); // Thêm trạng thái để theo dõi lỗi

    // Sử dụng useCallback để tối ưu hóa debounce
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchValue(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
        }, 500),
        []
    );

    // Sử dụng useRef để lưu trữ interval ID
    const intervalRef = useRef(null);

    // Hàm lấy dữ liệu hội viên từ API
    const fetchMembers = async () => {
        const { current, pageSize } = pagination;
        const { field, order } = sorter;

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: current,
                    per_page: pageSize,
                    search: searchValue,
                    sort_field: field,
                    sort_order:
                        order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : null,
                    ...filters,
                },
            });
            setData(response.data.data || []); // Đảm bảo data luôn là mảng
            setPagination((prev) => ({
                ...prev,
                total: response.data.total || 0,
            }));
            // Nếu fetch thành công, reset trạng thái lỗi
            if (hasError) {
                setHasError(false);
            }
        } catch (error) {
            if (!hasError) { // Chỉ thông báo nếu chưa có lỗi nào được thông báo
                if (error.response && error.response.data.message) {
                    const errorMessage = error.response.data.message || 'Đã xảy ra lỗi không xác định';
                    notification.error({
                        message: 'Lỗi',
                        description: errorMessage,
                        placement: 'topRight',
                    });
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Đã xảy ra lỗi không xác định.',
                        placement: 'topRight',
                    });
                }
                setHasError(true); // Đánh dấu đã có lỗi được thông báo
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút Sửa
    const handleEdit = (id) => {
        navigate(`${config.routes.admin.member}/update/${id}`);
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (e) => {
        const { value } = e.target;
        debouncedSearch(value);
    };

    // Hàm xử lý thay đổi bảng (phân trang, sắp xếp, lọc)
    const handleTableChange = (newPagination, newFilters, newSorter) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
        setSorter(newSorter);
        setFilters(newFilters);
    };

    // Hàm xử lý khi form được gửi
    const handleAddMember = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/members', values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.success({
                message: 'Thành công',
                description: response.data.message || 'Thêm mới hội viên thành công!',
                placement: 'topRight',
            });
            // Reset trạng thái lỗi sau khi thành công
            setHasError(false);
            // Cập nhật bảng dữ liệu
            setIsModalVisible(false);
            form.resetFields();
            // Tải lại dữ liệu
            fetchMembers();
        } catch (error) {
            if (!hasError) {
                const errorMessage = error.response?.data?.message || 'Thêm mới hội viên thất bại!';
                notification.error({
                    message: 'Lỗi',
                    description: errorMessage,
                    placement: 'topRight',
                });
                setHasError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi xóa hội viên
    const handleDeleteMember = (id) => {
        console.log("Deleting member with ID:", id); // Logging
        confirm({
            title: 'Bạn có chắc chắn muốn xóa hội viên này?',
            icon: <DeleteOutlined />,
            content: 'Thao tác này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setLoading(true); // Bắt đầu loading khi xóa
                axios.delete(`http://localhost:8000/api/members/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((response) => {
                        notification.success({
                            message: 'Thành công',
                            description: response.data.message || 'Xóa hội viên thành công!',
                            placement: 'topRight',
                        });
                        fetchMembers();
                        setHasError(false); // Reset trạng thái lỗi sau khi thành công
                    })
                    .catch((error) => {
                        if (!hasError) {
                            const errorMessage = error.response?.data?.message || 'Xóa hội viên thất bại!';
                            notification.error({
                                message: 'Lỗi',
                                description: errorMessage,
                                placement: 'topRight',
                            });
                            setHasError(true);
                        }
                    })
                    .finally(() => setLoading(false)); // Kết thúc loading
            },
        });
    };

    // Sử dụng useEffect để tự động gọi fetchMembers định kỳ
    useEffect(() => {
        fetchMembers();

        // Đặt interval để tự động cập nhật dữ liệu mỗi 30 giây
        intervalRef.current = setInterval(() => {
            fetchMembers();
        }, 30000); // 30000ms = 30s

        // Cleanup interval khi component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize, searchValue, sorter, filters]);

    // Hàm chuyển đổi dữ liệu để hiển thị trong bảng
    const transformedData = data.map((item) => ({
        key: item.id,
        loai_hoi_vien: item.loai_hoi_vien,
        uu_dai: item.uu_dai,
        thoi_gian: item.thoi_gian,
        gia: item.gia,
        trang_thai: item.trang_thai,
        ghi_chu: item.ghi_chu,
        created_at: item.created_at,
        anh_hoi_vien: item.anh_hoi_vien,
    }));

    // Định nghĩa các cột của bảng (Đã thêm cột 'Hành động')
    const columnsWithActions = [
        ...baseColumns,
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record.key)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDeleteMember(record.key)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <Row
                justify="space-between"
                align="middle"
                className="mb-4"
                gutter={[16, 16]}
            >
                <Col xs={24} sm={12} md={16}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Input
                            placeholder="Tìm kiếm hội viên..."
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={handleSearch}
                            style={{ width: '100%' }}
                        />
                    </Space>
                </Col>
            </Row>
            <Table
                loading={loading}
                columns={columnsWithActions}
                dataSource={transformedData}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                locale={{
                    emptyText: <Empty description="Không có dữ liệu" />,
                }}
                rowKey="key"
                scroll={{ x: 'max-content' }}
                size="middle"
            />
        </div>
    );
}

export default MembershipData;
