import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteRoom, useGetRooms } from '../../../hooks/api/useRoomApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { Button, Input, Table, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import RoomDetail from './RoomDetail';

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
        dataIndex: 'tong_ghe_phong',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
];

function RoomList() {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetRooms();
    const [tdata, setTData] = useState([]);

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen, setSelectedRoom, setIsModalVisible);
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
        setTData(transformData(filteredData, navigate, setIsDisableOpen, setSelectedRoom, setIsModalVisible));
    };

    return (
        <div>
            <div className="p-4 bg-white mb-3 flex items-center rounded-lg">
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
                    content="Bạn có muốn xóa phòng này ?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}

            <RoomDetail 
                visible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
                room={selectedRoom} 
            />
        </div>
    );
}

function transformData(dt, navigate, setIsDisableOpen, setSelectedRoom, setIsModalVisible) {
    return dt?.map((item) => {
        return {
            key: item.id,
            id: item.id,
            ten_phong_chieu: item.ten_phong_chieu,
            tong_ghe_phong: item.tong_ghe_phong,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-blue-500 border border-blue-500"
                        onClick={() => {
                            setSelectedRoom(item);
                            setIsModalVisible(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button
                        className="text-green-500 border border-green-500"
                        onClick={() => navigate(`/admin/room/edit/${item.id}`)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                        className={'text-red-500 border border-red-500'}
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            ),
        };
    });
}

export default RoomList;