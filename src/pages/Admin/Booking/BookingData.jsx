import { Button, Input, Table, notification, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import config from '../../../config';
import { useDeleteMovie } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { useGetBooking } from '../../../hooks/api/useBookingApi';
import Modal from '../../Client/Profile/Modal';
import { Tooltip } from "antd";
import { getTokenOfUser } from '../../../utils/storage';
import axios from 'axios';
const { Title, Text } = Typography;

function convertDateString(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return day + "-" + month + "-" + year;
}

const baseColumns = [
    {
        title: 'Ngày Giao Dịch',
        dataIndex: 'ngay_mua',
    },
    {
        title: 'Tên Phim',
        dataIndex: 'ten_phim',
    },
    {
        title: 'Số vé',
        dataIndex: 'so_luong',
    },
    {
        title: 'Ghế',
        dataIndex: 'ghe_ngoi',
    },
    {
        title: 'Số tiền',
        dataIndex: 'tong_tien',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        render: (text) => <div style={{ display: 'flex', gap: '8px', color: 'green' }}>{text}</div>,
    },
    {
        title: 'Thao Tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
];

function transformData(dt, navigate, setIsDisableOpen, handleModal, handleConfirmBookingDetail, mergedArrow) {
    return dt?.map((item) => {
        return {
            ngay_mua: convertDateString(item.ngay_mua),
            ten_phim: item.ten_phim,
            so_luong: item.so_luong,
            ghe_ngoi: item.ghe_ngoi,
            tong_tien: Number(item.tong_tien_thanh_toan).toLocaleString() + " VND",
            trang_thai: item.trang_thai == 0 ? "Chưa nhận vé" : "Đã nhận vé",
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        icon={<EyeOutlined />}
                        className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white transition"
                        onClick={() => handleModal(item)}
                    />
                    <Tooltip title="Xác nhận khách đến!" arrow={mergedArrow}>
                        <Button
                            icon={<StarOutlined />}
                            className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white transition"
                            onClick={() => handleConfirmBookingDetail(item.id)}
                        />
                    </Tooltip>

                    <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition"
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    />
                </div>
            ),
        };
    });
}

function BookingData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [viewData, setViewData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState();
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetBooking();
    const [tdata, setTData] = useState([]);
    const [arrow, setArrow] = useState('Show');
    const accessToken = getTokenOfUser();
    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);
    const handleModal = (item) => {
        setViewData(item);
        setIsModalOpen(true);
    }

    const handleConfirmBookingDetail = async (id) => {
        try {
            const result = await axios.put(`http://127.0.0.1:8000/api/confirm-booking-detail/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            alert("Xác nhận khách đến thành công")
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen, handleModal, handleConfirmBookingDetail, mergedArrow);
        setTData(dt);
    }, [isLoading, data]);

    const mutationDelete = useDeleteMovie({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({ message: 'Xóa phim thành công' });
            refetch();
        },
        error: () => {
            notification.error({ message: 'Xóa phim thất bại' });
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
        setViewData(null);
        setIsModalOpen(false);
    };
    return (
        <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <div className="mb-3 flex items-center">
                <Input.Search
                    className="xl:w-1/4 md:w-1/2"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
                    onSearch={onSearch}
                />
            </div>
            <Table
                loading={isLoading}
                columns={baseColumns}
                dataSource={tdata}
                rowKey="key"
                pagination={{ showSizeChanger: true }}
                rowClassName={(record, index) => (index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-200')}
                bordered
                size="middle"
            />
            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa phim này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}

            <Modal isOpen={isModalOpen} onClose={handleViewClose} ticket={viewData} />
        </div>
    );
}

export default BookingData;