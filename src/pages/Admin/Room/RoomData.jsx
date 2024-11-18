import { Button, Input, Table, notification, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { useDeleteRoom, useGetRooms, useSeatAllRoom, useEnableMaintenanceSeat, useDisableMaintenanceSeat } from '../../../hooks/api/useRoomApi'; // Updated imports
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { CloseCircleOutlined } from '@ant-design/icons'; 
import './RoomData.css';

const baseColumns = [
    {
        title: 'Id',
        dataIndex: 'id',
        sorter: true,
        width: 50,
    },
    {
        title: 'Tên phòng chiếu',
        dataIndex: 'ten_phong_chieu',
    },
    {
        title: 'Tổng ghế',
        dataIndex: 'tong_ghe_phong', // Cột này sẽ hiển thị tổng số ghế
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
];

function transformData(dt, navigate, setIsDisableOpen, showSeats) {
    return dt?.map((item) => {
        // Đếm số ghế từ dữ liệu phòng
        const totalSeats = Array.isArray(item.seats) ? item.seats.length : 0; // Đếm số ghế
        return {
            key: item.id,
            id: item.id,
            ten_phong_chieu: item.ten_phong_chieu,
            tong_ghe_phong: totalSeats, // Hiển thị tổng số ghế
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-green-500 border border-green-500"
                        onClick={() => navigate(`${config.routes.admin.room}/update/${item.id}`)}
                    >
                        Sửa
                    </Button>
                    <Button
                        className={'text-blue-500 border border-blue-500'}
                        onClick={() => showSeats(item.id)}
                    >
                        Xem ghế
                    </Button>
                    <Button
                        className={'text-red-500 border border-red-500'}
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        };
    });
}

function RoomData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetRooms();
    const [tdata, setTData] = useState([]);

    // Define mutations at the top level
    const mutationEnable = useEnableMaintenanceSeat(); // Get the mutation function
    const mutationDisable = useDisableMaintenanceSeat(); // Get the mutation function

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen, showSeats);
        setTData(dt);
    }, [isLoading, data]);

    const mutationDelete = useDeleteRoom({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({ message: 'Xóa phòng thành công' });
            refetch();
        },
        error: () => {
            notification.error({ message: 'Xóa phòng thất bại' });
        },
        obj: { id: isDisableOpen.id },
    });

    const onDelete = async () => {
        await mutationDelete.mutateAsync(isDisableOpen.id);
    };

    const onSearch = (value) => {
        const filteredData = data.data.filter((item) =>
            item.ten_phong_chieu.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, navigate, setIsDisableOpen, showSeats));
    };

    const showSeats = (id) => {
        setSelectedRoomId(id);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRoomId(null);
    };

    const handleMaintenance = async (seat) => {
        const action = seat.trang_thai === 2 ? 'tắt bảo trì' : 'bảo trì';
        const confirm = window.confirm(`Bạn có muốn ${action} ghế này?`); // Confirmation prompt
        if (confirm) {
            const mutation = seat.trang_thai === 2 ? mutationDisable : mutationEnable; // Use the mutation function
            await mutation(seat.id); // Call the mutation function with the seat ID
            // Cập nhật trạng thái ghế
            const newStatus = seat.trang_thai === 2 ? 0 : 2; // 0: không bảo trì, 2: đang bảo trì
            notification.success({ message: `Ghế đã được ${action} thành công` });
            // Cập nhật lại dữ liệu ghế
            setTData(prevData => prevData.map(item => 
                item.id === seat.id ? { ...item, trang_thai: newStatus } : item
            ));
            handleModalClose(); // Close the modal after action
        }
    };

    return (
        <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <div className="p-4 mb-3 flex items-center rounded-lg">
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
            />
            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa phòng này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}
            <Modal
                open={isModalVisible} // Changed from visible to open
                onCancel={handleModalClose}
                footer={null}
                width={900}
                style={{ 
                    top: 90,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    maxHeight: '80vh', 
                    overflowY: 'auto', 
                    padding: '20px', 
                }}
            >
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <SeatLayout roomId={selectedRoomId} onClose={handleModalClose} handleMaintenance={handleMaintenance} />
                    <div className="legend">
                        <div className="legend-item">
                            <div className="seat selected"></div>
                            <span>Ghế đang bảo trì</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat regular"></div>
                            <span>Ghế thường</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat vip"></div>
                            <span>Ghế VIP</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat double"></div>
                            <span>Ghế đôi</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

const SeatLayout = ({ roomId, onClose, handleMaintenance }) => {
    const { data, isLoading, error } = useSeatAllRoom(roomId);

    useEffect(() => {
        if (error) {
            notification.error({ message: 'Failed to load seats' });
        }
    }, [error]);

    if (isLoading) return <div>Loading...</div>;

    const seats = data?.data || [];

    const getSeatClass = (loai_ghe_ngoi, trang_thai) => {
        if (trang_thai === 2) return 'selected'; // 2: Under maintenance (blue)
        if (loai_ghe_ngoi === 'VIP') return 'vip'; // VIP seat
        if (loai_ghe_ngoi === 'Đôi') return 'double'; // Double seat
        return 'regular'; // Regular seat
    };

    const rows = {};
    seats.forEach(seat => {
        const row = seat.so_ghe_ngoi.charAt(0); 
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
    });

    return (
        <div className="seat-layout">
            {Object.keys(rows).map(row => (
                <div key={row} className="seat-row">
                    {rows[row].map(seat => (
                        <div 
                            key={seat.id} 
                            className={`seat ${getSeatClass(seat.loai_ghe_ngoi, seat.trang_thai)}`} 
                            onClick={() => handleMaintenance(seat)}
                        >
                            {seat.trang_thai === 2 ? (
                                <CloseCircleOutlined style={{ color: 'blue', fontSize: '24px' }} />
                            ) : (
                                seat.so_ghe_ngoi
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default RoomData;