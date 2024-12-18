import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, notification, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CountdownVoucherData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm fetch dữ liệu từ API
  const fetchCountdownVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/countdown_vouchers');
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        notification.error({ message: 'Không có dữ liệu!', placement: 'topRight' });
      }
    } catch (error) {
      notification.error({ message: 'Đã xảy ra lỗi khi lấy dữ liệu!', placement: 'topRight' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi fetchCountdownVouchers khi component được render
  useEffect(() => {
    fetchCountdownVouchers();
  }, []);

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'Mã Giảm Giá',
      dataIndex: ['coupon', 'ma_giam_gia'],
      key: 'ma_giam_gia',
    },
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      key: 'ngay',
    },
    {
      title: 'Thời Gian Bắt Đầu',
      dataIndex: 'thoi_gian_bat_dau',
      key: 'thoi_gian_bat_dau',
    },
    {
      title: 'Thời Gian Kết Thúc',
      dataIndex: 'thoi_gian_ket_thuc',
      key: 'thoi_gian_ket_thuc',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'so_luong',
      key: 'so_luong',
    },
    {
      title: 'Mô Tả',
      dataIndex: ['coupon', 'mota'],
      key: 'mota',
      ellipsis: true,
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/sanvoucher/update/${record.id}`)}>
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Button
        type="primary"
        onClick={fetchCountdownVouchers}
        style={{ marginBottom: '16px' }}
        loading={isLoading}
      >
        Làm Mới
      </Button>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ key: item.id, ...item }))}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
        rowKey="id"
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
    </div>
  );
};

export default CountdownVoucherData;
