import { faEdit, faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Table, Tag, message, Modal } from 'antd'; // Thêm Modal từ antd
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import UserDetail from './UserDetail';
import UserEdit from './UserEdit';
import UserActions from './UserActions';

function UserList() {
    const [isDetailOpen, setIsDetailOpen] = useState({ id: 0, isOpen: false });
    const [isEditOpen, setIsEditOpen] = useState({ id: 0, isOpen: false });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Changed to a boolean state
    const navigate = useNavigate();
    const [data, setData] = useState([]);

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
                console.log(result); // Kiểm tra dữ liệu nhận được

                // Kiểm tra xem result có phải là mảng không
                if (result && Array.isArray(result.data)) {
                    setData(result.data); // Lấy mảng từ thuộc tính 'data'
                } else {
                    console.error('Expected an array but got:', result);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const currentUserId = JSON.parse(localStorage.getItem('token'))?.userId; // Lấy ID của tài khoản đang đăng nhập

    const handleDelete = async (id) => {
        if (id === currentUserId) {
            message.error('Bạn không thể xóa tài khoản đang đăng nhập!'); // Thông báo lỗi
            return; // Ngừng thực hiện nếu là tài khoản đang đăng nhập
        }

        // Hiển thị modal xác nhận
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
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
                        setData(prevData => prevData.filter(user => user.id !== id));
                        console.log('User deleted successfully');
                    } else {
                        console.error('Failed to delete user:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
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
            render: (text) => {
                let color;
                switch (text) {
                    case 'admin':
                        color = 'red'; 
                        break;
                    case 'user':
                        color = 'green'; 
                        break;
                    case 'nhan_vien':
                        color = 'blue';
                        break;
                    default:
                        color = 'default'; 
                }
                return <Tag color={color}>{text}</Tag>; 
            },
        },
        {
            title: 'Điểm Thưởng',
            dataIndex: 'diem_thuong',
            key: 'diem_thuong',
        },{
            title: 'Số điện thoại',
            dataIndex: 'so_dien_thoai',
            key: 'so_dien_thoai',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <UserActions
                    record={record}
                    setIsDetailOpen={setIsDetailOpen}
                    setIsEditOpen={setIsEditOpen}
                    setIsDeleteOpen={() => handleDelete(record.id)} // Update to handle delete
                />
            ),
        },
    ];

    return (
        <div className="user-container bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-6">
                <Input.Search
                    className="w-full md:w-1/2 lg:w-1/3"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
                />
                <Button type="primary" icon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới
                </Button>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden flex-grow">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        className: 'bg-gray-800 text-gray-200',
                    }}
                    className="custom-table"
                    scroll={{ y: 'calc(100vh - 300px)' }}
                />
            </div>
            <UserDetail isDetailOpen={isDetailOpen} setIsDetailOpen={setIsDetailOpen} />
            <UserEdit isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
            <ConfirmPrompt
                content="Bạn có chắc chắn muốn xóa người dùng này?"
                isDisableOpen={isDeleteOpen !== false} // Update to check if a user is selected for deletion
                setIsDisableOpen={() => setIsDeleteOpen(false)} // Reset the state
            />
        </div>
    );
}

export default UserList;