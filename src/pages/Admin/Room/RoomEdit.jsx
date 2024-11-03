import { Button, Form, Input, notification } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRoom, useUpdateRoom } from '../../../hooks/api/useRoomApi';
import config from '../../../config';

const RoomEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy id từ URL
    const { data: roomData } = useGetRoom(id); // Fetch room data by ID
    const [form] = Form.useForm();

    // Kiểm tra xem roomData có tồn tại không
    useEffect(() => {
        if (roomData) {
            // Populate form fields with fetched room data
            form.setFieldsValue({
                ten_phong_chieu: roomData.data.ten_phong_chieu,
                tong_ghe_phong: roomData.data.tong_ghe_phong,
            });
        }
    }, [roomData]);

    // Gọi useUpdateRoom với updater chứa id
    const mutateUpdate = useUpdateRoom({
        id: id, // Đảm bảo id được truyền vào đây
        success: () => {
            notification.success({
                message: 'Cập nhật phòng thành công', // Success notification
            });
            navigate(config.routes.admin.room); // Navigate to rooms list
        },
        error: () => {
            notification.error({
                message: 'Cập nhật phòng thất bại', // Error notification
            });
        },
    });

    const onFinish = async (values) => {
        const updateData = {
            id: id, // Room ID
            body: {
                ten_phong_chieu: values.ten_phong_chieu, // Updated room name
                tong_ghe_phong: values.tong_ghe_phong, // Updated total seats
            },
        };
        console.log("Update Data:", updateData); // Kiểm tra dữ liệu trước khi gửi
        await mutateUpdate.mutateAsync(updateData);
    };

    return (
        <div className="form-container">
            <h1 className="font-bold">Cập nhật thông tin phòng</h1>
            <Form
                name="room-form"
                layout="vertical"
                form={form}
                onFinish={onFinish} // Handle form submission
            >
                <Form.Item
                    label="Tên phòng"
                    name="ten_phong_chieu"
                    rules={[{ required: true, message: 'Nhập tên phòng!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tổng ghế"
                    name="tong_ghe_phong"
                    rules={[{ required: true, message: 'Nhập tổng ghế!' }]}
                >
                    <Input />
                </Form.Item>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button htmlType="reset" className="min-w-[10%]">Đặt lại</Button>
                    <Button htmlType="submit" className="bg-blue-500 text-white min-w-[10%]">Cập nhật</Button>
                </div>
            </Form>
        </div>
    );
};

export default RoomEdit;