import { Modal, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';

function UserDetail({ isDetailOpen, setIsDetailOpen }) {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (isDetailOpen.isOpen) {
            // Fetch user data based on isDetailOpen.id
            // For now, we'll use dummy data
            setUserData({
                id: '1',
                createdAt: new Date().toLocaleString(),
                updatedAt: new Date().toLocaleString(),
                name: 'T',
                email: 't@t.com',
                phone: '1243143434',
                zalo: 'zalo',
                facebook: 'fb',
                address: 'TPHCM',
                avatar: 'https://dummyimage.com/138x100.png/dddddd/000000',
                status: 'Chưa duyệt',
                confirmed: 'Đã xác nhận',
            });
        }
    }, [isDetailOpen]);

    const columns = [
        { title: 'Thuộc tính', dataIndex: 'property', key: 'property' },
        { title: 'Giá trị', dataIndex: 'value', key: 'value' },
    ];

    const data = Object.entries(userData).map(([key, value], index) => ({
        key: index,
        property: key.charAt(0).toUpperCase() + key.slice(1),
        value: key === 'avatar' ? <img src={value} alt="Avatar" className="w-20 h-20 rounded-xl" /> :
               key === 'status' || key === 'confirmed' ? <Tag color={value === 'Hoạt động' || value === 'Đã xác nhận' ? 'green' : 'red'}>{value}</Tag> :
               value,
    }));

    return (
        <Modal
            title="Chi tiết người dùng"
            open={isDetailOpen.isOpen}
            onCancel={() => setIsDetailOpen({ id: 0, isOpen: false })}
            footer={null}
            width={600}
        >
            <Table columns={columns} dataSource={data} pagination={false} />
        </Modal>
    );
}

export default UserDetail;