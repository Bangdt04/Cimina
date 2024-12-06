import { Button, Input, Table, notification, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;

const baseColumns = [
    {
        title: 'Ảnh',
        dataIndex: 'anh_do_an',
        render: (text) => (
            <img
                src={`http://localhost:8000${text}`}
                alt="Food"
                style={{ width: '100px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
            />
        ),
    },
    {
        title: 'Tên món ăn',
        dataIndex: 'ten_do_an',
        sorter: true,
    },
    {
        title: 'Giá (VND)',
        dataIndex: 'gia',
        render: (gia) => gia.toLocaleString(),
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghi_chu',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

function transformData(data, navigate, handleStop, handleOpen, handleDelete) {
    return data.map((item) => ({
        key: item.id,
        ten_do_an: item.ten_do_an,
        gia: item.gia,
        ghi_chu: item.ghi_chu,
        anh_do_an: item.anh_do_an,
        action: (
            <div className="action-btn flex gap-2">
                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={() => navigate(`${config.routes.admin.food}/update/${item.id}`)}
                >
                    Sửa
                </Button>
                {item.trang_thai === 0 ? (
                    <Button
                        icon={<PauseOutlined />}
                        type="dashed"
                        danger
                        onClick={() => handleStop(item.id)}
                    >
                        Dừng bán
                    </Button>
                ) : (
                    <Button
                        icon={<PlayCircleOutlined />}
                        type="success"
                        onClick={() => handleOpen(item.id)}
                    >
                        Mở bán
                    </Button>
                )}
                <Button
                    icon={<DeleteOutlined />}
                    type="primary"
                    danger
                    onClick={() => handleDelete(item.id)}
                >
                    Xóa
                </Button>
            </div>
        ),
    }));
}

function FoodData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/foods');
            setData(response.data.data);
        } catch (error) {
            notification.error({ message: 'Không thể tải dữ liệu!', placement: 'topRight' });
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/stopFood/${id}`);
            notification.success({ message: 'Đã dừng bán món ăn!', placement: 'topRight' });
            fetchFoods();
        } catch (error) {
            notification.error({ message: 'Không thể dừng bán món ăn!', placement: 'topRight' });
        }
    };

    const handleOpen = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/openFood/${id}`);
            notification.success({ message: 'Đã mở bán món ăn!', placement: 'topRight' });
            fetchFoods();
        } catch (error) {
            notification.error({ message: 'Không thể mở bán món ăn!', placement: 'topRight' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/foods/${id}`);
            notification.success({ message: 'Xóa món ăn thành công!', placement: 'topRight' });
            fetchFoods();
        } catch (error) {
            notification.error({ message: 'Xóa món ăn thất bại!', placement: 'topRight' });
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const transformedData = transformData(data, navigate, handleStop, handleOpen, handleDelete);

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="mb-4">
                <Input.Search
                    placeholder="Tìm kiếm món ăn..."
                    onSearch={(value) =>
                        setData(
                            data.filter((item) =>
                                item.ten_do_an.toLowerCase().includes(value.toLowerCase())
                            )
                        )
                    }
                    allowClear
                    style={{ width: '50%' }}
                />
            </div>
            <Table
                loading={loading}
                columns={baseColumns}
                dataSource={transformedData}
                pagination={{ showSizeChanger: true }}
                bordered
            />
        </div>
    );
}

export default FoodData;
