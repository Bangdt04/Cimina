import { Button, Input, Table, Select, message, Modal, InputNumber, Card, Typography } from 'antd';
import { useState, useEffect } from 'react';

const { Title } = Typography;

function UserData() {
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tokenData = localStorage.getItem('token');
                const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

                const response = await fetch('http://127.0.0.1:8000/api/showAllUser', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
                if (result && Array.isArray(result.data)) {
                    // Lọc các tài khoản có vai trò là admin
                    const filteredData = result.data.filter(item => item.vai_tro !== 'admin');
                    setData(filteredData);
                } else {
                    console.error('Expected an array but got:', result);
                }

                // Fetch the current user's details
                const currentUserResponse = await fetch('http://127.0.0.1:8000/api/currentUser', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const currentUserData = await currentUserResponse.json();
                setCurrentUser(currentUserData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const updateUser = async (id, updatedData) => {
        try {
            const tokenData = localStorage.getItem('token');
            const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

            const response = await fetch(`http://127.0.0.1:8000/api/updateUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                message.success('Cập nhật thành công!');
            } else {
                message.error('Cập nhật thất bại!');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Đã xảy ra lỗi khi cập nhật!');
        }
    };

    const deleteUser = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    const tokenData = localStorage.getItem('token');
                    const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

                    const response = await fetch(`http://127.0.0.1:8000/api/deleteUser/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        message.success('Xóa thành công!');
                        setData((prevData) => prevData.filter((item) => item.id !== id)); // Remove deleted user from state
                    } else {
                        message.error('Xóa thất bại!');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    message.error('Đã xảy ra lỗi khi xóa!');
                }
            },
        });
    };

    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        setEditingKey(record.id);
    };

    const save = async (id) => {
        try {
            const updatedRow = data.find((row) => row.id === id);
            await updateUser(id, {
                ho_ten: updatedRow.ho_ten,
                gioi_tinh: updatedRow.gioi_tinh,
                vai_tro: updatedRow.vai_tro,
                so_luot_quay: updatedRow.so_luot_quay,
            });
            setEditingKey('');
        } catch (err) {
            console.error(err);
        }
    };

    const cancel = () => {
        setEditingKey('');
    };

    const handleChange = (id, key, value) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );
    };

    const columns = [
        {
            title: 'Họ Tên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
        },
        {
            title: 'Giới Tính',
            dataIndex: 'gioi_tinh',
            key: 'gioi_tinh',
            render: (text, record) =>
                isEditing(record) ? (
                    <Select
                        defaultValue={text}
                        onChange={(value) => handleChange(record.id, 'gioi_tinh', value)}
                        style={{ width: 100 }}
                    >
                        <Select.Option value="nam">Nam</Select.Option>
                        <Select.Option value="nu">Nữ</Select.Option>
                        <Select.Option value="khac">Khác</Select.Option>
                    </Select>
                ) : (
                    text === 'nam' ? 'Nam' : text === 'nu' ? 'Nữ' : 'Khác'
                ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'vai_tro',
            key: 'vai_tro',
            render: (text, record) => {
                let roleDisplay;
                let roleColor;

                switch (text) {
                    case 'admin':
                        roleDisplay = 'Admin';
                        roleColor = 'text-red-500';
                        break;
                    case 'nhan_vien':
                        roleDisplay = 'Nhân viên';
                        roleColor = 'text-blue-500';
                        break;
                    case 'user':
                        roleDisplay = 'Người dùng';
                        roleColor = 'text-green-500';
                        break;
                    default:
                        roleDisplay = text;
                        roleColor = 'text-gray-500';
                }

                return isEditing(record) ? (
                    <Select
                        defaultValue={text}
                        onChange={(value) => handleChange(record.id, 'vai_tro', value)}
                        style={{ width: 120 }}
                    >
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="nhan_vien">Nhân viên</Select.Option>
                        <Select.Option value="user">Người dùng</Select.Option>
                    </Select>
                ) : (
                    <span className={roleColor}>{roleDisplay}</span>
                );
            },
        },
        {
            title: 'Số Lượt Quay',
            dataIndex: 'so_luot_quay',
            key: 'so_luot_quay',
            render: (text, record) =>
                isEditing(record) ? (
                    <InputNumber
                        defaultValue={text}
                        onChange={(value) => handleChange(record.id, 'so_luot_quay', value)}
                        min={0}
                        style={{ width: 100 }}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => {
                // Disable edit and delete for the logged-in admin's own account
                if (currentUser && currentUser.id === record.id && currentUser.vai_tro === 'admin') {
                    return <span>Không thể sửa hoặc xóa tài khoản của mình</span>;
                }

                return isEditing(record) ? (
                    <>
                        <Button type="link" onClick={() => save(record.id)}>
                            Lưu
                        </Button>
                        <Button type="link" onClick={cancel}>
                            Hủy
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="link" onClick={() => edit(record)}>
                            Sửa
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Card style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={3}>Quản lý Người dùng</Title>
                    <Input
                        placeholder="Tìm kiếm người dùng"
                        style={{ width: 200 }}
                        // Add logic for searching by name or email
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: 800 }}
                />
            </Card>
        </div>
    );
}

export default UserData;
