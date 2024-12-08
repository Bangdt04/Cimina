import { Button, Input, Table, notification, Modal, Card, Row, Col, Tooltip, Menu, Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, CloseCircleOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import config from '../../../config';
import { useDeleteRoom, useGetRooms, useSeatAllRoom } from '../../../hooks/api/useRoomApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import './RoomData.css';

const baseColumns = [
    {
        title: 'Tên phòng chiếu',
        dataIndex: 'ten_phong_chieu',
    },
    {
        title: 'Tổng số ghế',
        dataIndex: 'tong_ghe_phong',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
];

function transformData(dt, navigate, setIsDisableOpen, showSeats, handleDeleteAllSeats) {
    return dt?.map((item) => ({
        key: item.id,
        id: item.id,
        ten_phong_chieu: item.ten_phong_chieu,
        tong_ghe_phong: item.tong_ghe_phong,
        action: (
            <div className="action-btn flex gap-2">
                <Tooltip title="Chỉnh sửa phòng chiếu">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`${config.routes.admin.room}/update/${item.id}`)}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#e0f7fa',
                            borderColor: '#e0f7fa',
                        }}
                    >
                        Sửa
                    </Button>
                </Tooltip>

                <Tooltip title="Xem ghế trong phòng">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showSeats(item.id)}
                        style={{
                            borderRadius: '8px',
                        }}
                    >
                        Xem ghế
                    </Button>
                </Tooltip>

                <Tooltip title="Xóa toàn bộ ghế trong phòng">
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteAllSeats(item.id)}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#ffcdd2',
                            borderColor: '#ffcdd2',
                        }}
                    >
                        Xóa toàn bộ ghế
                    </Button>
                </Tooltip>
            </div>
        ),
    }));
}

function RoomData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetRooms();
    const [tdata, setTData] = useState([]);

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen, showSeats, handleDeleteAllSeats);
        setTData(dt);
    }, [isLoading, data]);

    const handleDeleteAllSeats = async (roomId) => {
        Modal.confirm({
            title: 'Xác nhận xóa toàn bộ ghế',
            content: `Bạn có chắc chắn muốn xóa toàn bộ ghế của phòng chiếu này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/delete-all-seatbyroom/${roomId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Phản hồi mạng không hợp lệ');
                    }

                    notification.success({ message: 'Xóa toàn bộ ghế thành công', placement: 'topRight' });
                    refetch(); // Refetch to update the list of rooms
                } catch (error) {
                    notification.error({ message: `Xóa toàn bộ ghế thất bại: ${error.message}`, placement: 'topRight' });
                }
            },
        });
    };

    const onSearch = (value) => {
        const filteredData = data.data.filter((item) =>
            item.ten_phong_chieu.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, navigate, setIsDisableOpen, showSeats, handleDeleteAllSeats));
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
        Modal.confirm({
            title: `Xác nhận ${action} ghế`,
            content: `Bạn có muốn ${action} ghế ${seat.so_ghe_ngoi}?`,
            okText: action === 'bảo trì' ? 'Bảo trì' : 'Tắt bảo trì',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const endpoint = seat.trang_thai === 2
                        ? `http://127.0.0.1:8000/api/tatbaoTriSeat/${seat.id}`
                        : `http://127.0.0.1:8000/api/baoTriSeat/${seat.id}`;

                    const response = await fetch(endpoint, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Phản hồi mạng không hợp lệ');
                    }

                    const responseData = await response.json();
                    const newStatus = seat.trang_thai === 2 ? 0 : 2;
                    notification.success({ message: responseData.message, placement: 'topRight' });

                    setTData((prevData) =>
                        prevData.map((item) =>
                            item.id === seat.id ? { ...item, trang_thai: newStatus } : item
                        )
                    );
                } catch (error) {
                    notification.error({ message: `Có lỗi xảy ra: ${error.message}`, placement: 'topRight' });
                }
            },
        });
    };

    // Define the SeatLayout component within RoomData
    const SeatLayout = ({ roomId, onClose, handleMaintenance }) => {
        const { data, isLoading, error, refetch: refetchSeats } = useSeatAllRoom(roomId);
        const navigate = useNavigate();
    
        useEffect(() => {
            if (error) {
                notification.error({ message: 'Failed to load seats', placement: 'topRight' });
            }
        }, [error]);
    
        if (isLoading) return <div>Loading...</div>;
    
        const seats = data?.data || [];
    
        const getSeatClass = (loai_ghe_ngoi, trang_thai) => {
            if (trang_thai === 2) return 'selected';
            if (loai_ghe_ngoi === 'VIP') return 'vip';
            if (loai_ghe_ngoi === 'Đôi') return 'double';
            return 'regular';
        };
    
        const rows = {};
        seats.forEach((seat) => {
            const row = seat.so_ghe_ngoi.charAt(0).toUpperCase(); // Đảm bảo chữ cái viết hoa
            if (!rows[row]) rows[row] = [];
            rows[row].push(seat);
        });
    
        // Sắp xếp các hàng theo thứ tự chữ cái
        const sortedRowKeys = Object.keys(rows).sort();
    
        // Sắp xếp các ghế trong mỗi hàng theo số ghế
        sortedRowKeys.forEach((row) => {
            rows[row].sort((a, b) => {
                const seatNumberA = parseInt(a.so_ghe_ngoi.slice(1), 10);
                const seatNumberB = parseInt(b.so_ghe_ngoi.slice(1), 10);
                return seatNumberA - seatNumberB;
            });
        });

        // Action Handlers
        const handleDeleteSeat = (seatId) => {
            Modal.confirm({
                title: 'Xác nhận xóa ghế',
                content: 'Bạn có chắc chắn muốn xóa ghế này không?',
                okText: 'Xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                onOk: async () => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/api/deleteSeat/${seatId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Phản hồi mạng không hợp lệ');
                        }

                        notification.success({ message: 'Xóa ghế thành công', placement: 'topRight' });
                        refetchSeats(); // Refetch seats to update UI
                    } catch (error) {
                        notification.error({ message: `Xóa ghế thất bại: ${error.message}`, placement: 'topRight' });
                    }
                },
            });
        };

        const handleEditSeat = (seatId) => {
            navigate(`/admin/seats/update/${seatId}`);
        };

        const handleToggleMaintenance = (seat) => {
            const action = seat.trang_thai === 2 ? 'tắt bảo trì' : 'bảo trì';
            Modal.confirm({
                title: `Xác nhận ${action} ghế`,
                content: `Bạn có muốn ${action} ghế ${seat.so_ghe_ngoi} không?`,
                okText: action === 'bảo trì' ? 'Bảo trì' : 'Tắt bảo trì',
                cancelText: 'Hủy',
                onOk: async () => {
                    try {
                        const endpoint = seat.trang_thai === 2
                            ? `http://127.0.0.1:8000/api/tatbaoTriSeat/${seat.id}`
                            : `http://127.0.0.1:8000/api/baoTriSeat/${seat.id}`;

                        const response = await fetch(endpoint, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Phản hồi mạng không hợp lệ');
                        }

                        const responseData = await response.json();
                        const newStatus = seat.trang_thai === 2 ? 0 : 2;
                        notification.success({ message: responseData.message, placement: 'topRight' });

                        setTData((prevData) =>
                            prevData.map((item) =>
                                item.id === seat.id ? { ...item, trang_thai: newStatus } : item
                            )
                        );
                    } catch (error) {
                        notification.error({ message: `Có lỗi xảy ra: ${error.message}`, placement: 'topRight' });
                    }
                },
            });
        };

        const getMenu = (seat) => (
            <Menu>
                <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditSeat(seat.id)}>
                    Sửa ghế
                </Menu.Item>
                <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSeat(seat.id)}>
                    Xóa ghế
                </Menu.Item>
                <Menu.Item key="maintenance" icon={<SettingOutlined />} onClick={() => handleToggleMaintenance(seat)}>
                    {seat.trang_thai === 2 ? 'Tắt bảo trì' : 'Bảo trì ghế'}
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="seat-layout">
            {sortedRowKeys.map((row) => (
                <div key={row} className="seat-row">
                    {rows[row].map((seat) => (
                        <Dropdown overlay={getMenu(seat)} trigger={['click']} key={seat.id}>
                            <div
                                className={`seat ${getSeatClass(seat.loai_ghe_ngoi, seat.trang_thai)}`}
                                style={{ cursor: 'pointer' }}
                            >
                                {seat.trang_thai === 2 ? (
                                    <CloseCircleOutlined style={{ color: 'blue', fontSize: '24px' }} />
                                ) : (
                                    seat.so_ghe_ngoi
                                )}
                            </div>
                        </Dropdown>
                    ))}
                </div>
            ))}
        </div>
        );
    };

    return (
        <Card className="bg-white text-black p-4 rounded-lg shadow-lg">
            <Row gutter={16} className="mb-3">
                <Col span={24}>
                    <Input.Search
                        allowClear
                        enterButton
                        placeholder="Nhập từ khoá tìm kiếm"
                        onSearch={onSearch}
                    />
                </Col>
            </Row>
            <Table
                loading={isLoading}
                columns={baseColumns}
                dataSource={tdata}
                rowKey="key"
                pagination={{ pageSize: 5 }}
            />
            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa phòng này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={() => handleDeleteAllSeats(isDisableOpen.id)}
                />
            )}
            <Modal
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={1000}
                style={{
                    top: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    padding: '20px',
                }}
            >
                <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <h2>Danh sách ghế</h2>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/admin/seats/create', { state: { roomId: selectedRoomId } })}
                            >
                                Thêm mới ghế
                            </Button>
                        </Col>
                    </Row>
                    <SeatLayout
                        roomId={selectedRoomId}
                        onClose={handleModalClose}
                        handleMaintenance={handleMaintenance}
                    />
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
        </Card>
    );
}

export default RoomData;
