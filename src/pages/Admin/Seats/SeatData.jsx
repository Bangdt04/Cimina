// src/pages/Admin/Seats/SeatData.jsx
import { Button, Input, Table, notification, Modal, Typography, Tooltip } from 'antd'; // Added Tooltip import
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../../config';
import { useDeleteSeat, useGetSeats, useGetAddSeat } from '../../../hooks/api/useSeatApi'; 
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

const { Title, Text } = Typography;

const baseColumns = [
    {
        title: 'Số ghế ngồi',
        dataIndex: 'so_ghe_ngoi',
    },
    {
        title: 'Loại ghế ngồi',
        dataIndex: 'loai_ghe_ngoi',
    },
    {
        title: 'Giá ghế',
        dataIndex: 'gia_ghe',
    },
    {
        title: 'Tên phòng chiếu',
        dataIndex: 'ten_phong_chieu',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

function transformData(dt, roomData, navigate, setIsDisableOpen, setViewData) {
    return dt?.map((item) => {
        const room = Array.isArray(roomData) ? roomData.find(r => r.id === item.room_id) : null;
        return {
            key: item.id,
            id: item.id,
            so_ghe_ngoi: item.so_ghe_ngoi,
            loai_ghe_ngoi: item.loai_ghe_ngoi,
            gia_ghe: item.gia_ghe,
            room_id: item.room_id,
            ten_phong_chieu: room ? room.ten_phong_chieu : 'Không xác định', 
            action: (
                <div className="action-btn flex gap-3">
                    <Tooltip title="Sửa">
                        <Button
                            icon={<EditOutlined />}
                            className="text-green-500 border border-green-500 hover:bg-green-100 transition-all"
                            onClick={() => navigate(`${config.routes.admin.seat}/update/${item.id}`)}
                        >
                            Sửa
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            icon={<DeleteOutlined />}
                            className={'text-red-500 border border-red-500 hover:bg-red-100 transition-all'}
                            onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                        >
                            Xóa
                        </Button>
                    </Tooltip>
                </div>
            ),
        };
    });
}

function SeatData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [viewData, setViewData] = useState(null);
    const navigate = useNavigate();
    const { data: seatData, isLoading, refetch } = useGetSeats();
    const { data: roomDataResponse } = useGetAddSeat();
    const roomData = roomDataResponse?.data || [];
    const [tdata, setTData] = useState([]);

    useEffect(() => {
        if (isLoading || !seatData) return;
        
        let dt = transformData(seatData?.data, roomData, navigate, setIsDisableOpen, setViewData);
    
        // Sắp xếp dữ liệu theo tên phòng chiếu
        dt = dt.sort((a, b) => {
            if (a.ten_phong_chieu < b.ten_phong_chieu) return -1;
            if (a.ten_phong_chieu > b.ten_phong_chieu) return 1;
            return 0;
        });
    
        setTData(dt);
    }, [isLoading, seatData, roomData]);
    
    const mutationDelete = useDeleteSeat({
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

    const onSearch = (value) => {
        const filteredData = seatData.data.filter((item) =>
            item.ten_phong_chieu.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, roomData, navigate, setIsDisableOpen, setViewData));
    };

    const handleViewClose = () => {
        setViewData(null);
    };

    return (
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <div className="p-4 mb-4 flex items-center rounded-lg">
                <Input.Search
                    className="xl:w-1/4 md:w-1/2"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
                    onSearch={onSearch}
                    style={{ borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                />
            </div>
            <Table
                loading={isLoading}
                columns={baseColumns}
                dataSource={tdata}
                pagination={{ showSizeChanger: true, pageSize: 10, size: 'middle' }}
                rowClassName="hover:bg-gray-50"
                bordered
                style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
            />
            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa ghế này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}
            <Modal
                title="Chi tiết ghế"
                visible={!!viewData}
                onCancel={handleViewClose}
                footer={null}
                width={600}
                centered
                bodyStyle={{ padding: '20px', backgroundColor: '#f9f9f9' }}
            >
                {viewData && (
                    <div style={{ padding: '20px' }}>
                        <Title level={4} style={{ color: '#1890ff' }}>Thông tin ghế</Title>
                        <p><strong>Số ghế ngồi:</strong> <Text>{viewData.so_ghe_ngoi}</Text></p>
                        <p><strong>Loại ghế ngồi:</strong> <Text>{viewData.loai_ghe_ngoi}</Text></p>
                        <p><strong>Giá ghế:</strong> <Text>{viewData.gia_ghe}</Text></p>
                        <p><strong>Tên phòng chiếu:</strong> <Text>{viewData.ten_phong_chieu}</Text></p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default SeatData;