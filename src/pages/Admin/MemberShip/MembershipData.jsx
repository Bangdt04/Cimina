import { Button, Input, Table, notification, Typography, Tooltip, Modal, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;
const { confirm } = Modal;

const baseColumns = [
    {
        title: 'Tên thành viên',
        dataIndex: 'ten_thanh_vien',
        sorter: true,
        align: 'left',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
        align: 'left',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'so_dien_thoai',
        align: 'center',
    },
    {
        title: 'Loại hội viên',
        dataIndex: 'loai_hoi_vien',
        align: 'center',
    },
    {
        title: 'Ưu đãi',
        dataIndex: 'uu_dai',
        align: 'center',
    },
    {
        title: 'Thời gian',
        dataIndex: 'thoi_gian',
        align: 'center',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        align: 'center',
        render: (text) => (
            <span style={{ color: text === 0 ? 'red' : 'green' }}>
                {text === 0 ? 'Không hoạt động' : 'Hoạt động'}
            </span>
        ),
    },
];

function MembershipData() {
    const [data, setData] = useState([]); // Ensure data is always an array
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [sorter, setSorter] = useState({});
    const navigate = useNavigate();
    const tokenData = localStorage.getItem('token');
    const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

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
                    sort_order: order,
                },
            });
            setData(response.data.data || []); // Ensure data is always an array
            setPagination({ ...pagination, total: response.data.total || 0 });
        } catch (error) {
            notification.error({ message: 'Không thể tải dữ liệu!' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`${config.routes.admin.membership}/update/${id}`);
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa thành viên này?',
            content: 'Thao tác này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDelete(id),
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/members/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.success({ message: 'Xóa thành viên thành công!' });
            fetchMembers();
        } catch (error) {
            notification.error({ message: 'Xóa thành viên thất bại!' });
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setPagination({ ...pagination, current: 1 });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
        setSorter(sorter);
    };

    useEffect(() => {
        fetchMembers();
    }, [pagination.current, pagination.pageSize, searchValue, sorter]);

    const transformedData = (data || []).map((item) => ({
        key: item.id,
        ten_thanh_vien: item.ten_thanh_vien,
        email: item.email,
        so_dien_thoai: item.so_dien_thoai,
        loai_hoi_vien: item.loai_hoi_vien,
        uu_dai: item.uu_dai,
        thoi_gian: item.thoi_gian,
        trang_thai: item.trang_thai,
        action: (
            <div className="action-btn flex gap-2">
                <Tooltip title="Sửa">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(item.id)}
                    />
                </Tooltip>
                <Tooltip title="Xóa">
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => showDeleteConfirm(item.id)}
                    />
                </Tooltip>
            </div>
        ),
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <Title level={4}>Quản lý thành viên</Title>
                <Input.Search
                    placeholder="Tìm kiếm thành viên..."
                    value={searchValue}
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ maxWidth: '400px' }}
                />
            </div>
            <Table
                loading={loading}
                columns={[
                    ...baseColumns,
                    {
                        title: 'Hành động',
                        dataIndex: 'action',
                        align: 'center',
                        render: (_, record) => record.action,
                    },
                ]}
                dataSource={transformedData}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                locale={{
                    emptyText: <Empty description="Không có dữ liệu" />,
                }}
                rowKey="id"
            />
        </div>
    );
}

export default MembershipData;
