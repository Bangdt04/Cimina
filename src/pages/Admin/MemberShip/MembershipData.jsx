import { Button, Input, Table, notification, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;

const baseColumns = [
    {
        title: 'Tên thành viên',
        dataIndex: 'ten_thanh_vien',
        sorter: true,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'so_dien_thoai',
        sorter: true,
    },
    {
        title: 'Loại hội viên',
        dataIndex: 'loai_hoi_vien',
    },
    {
        title: 'Ưu đãi',
        dataIndex: 'uu_dai',
    },
    {
        title: 'Thời gian',
        dataIndex: 'thoi_gian',
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghi_chu',
    },
    {
        title: 'Giá',
        dataIndex: 'gia',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        render: (text) => (text === 0 ? 'Không hoạt động' : 'Hoạt động'),
    },
];

function MembershipData() {
    const [data, setData] = useState([]);
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
            setData(response.data.data);
            setPagination({ ...pagination, total: response.data.total });
        } catch (error) {
            notification.error({ message: 'Không thể tải dữ liệu!' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`${config.routes.admin.membership}/update/${id}`);
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

    const transformedData = data.map((item) => ({
        key: item.id,
        ten_thanh_vien: item.ten_thanh_vien,
        email: item.email,
        so_dien_thoai: item.so_dien_thoai,
        loai_hoi_vien: item.loai_hoi_vien,
        uu_dai: item.uu_dai,
        thoi_gian: item.thoi_gian,
        ghi_chu: item.ghi_chu,
        gia: item.gia,
        trang_thai: item.trang_thai,
        action: (
            <div className="action-btn flex gap-2">
                <Button
                    type="primary"
                    onClick={() => handleEdit(item.id)}
                >
                    Sửa
                </Button>
                <Button
                    type="danger"
                    onClick={() => handleDelete(item.id)}
                >
                    Xóa
                </Button>
            </div>
        ),
    }));

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="mb-4">
                <Input.Search
                    placeholder="Tìm kiếm thành viên..."
                    value={searchValue}
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                    style={{ width: '50%' }}
                />
            </div>
            <Table
                loading={loading}
                columns={baseColumns}
                dataSource={transformedData}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                rowKey="id"
            />
        </div>
    );
}

export default MembershipData;
