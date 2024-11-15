import { Button, Col, Form, Input, Row, notification, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../../config';
import { useUpdateRoom, useGetRoom, useCreateRoom } from '../../../hooks/api/useRoomApi';
const { Title } = Typography;

function RoomFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { isLoading, data: room } = id ? useGetRoom(id) : { isLoading: null, data: null };

    const [form] = Form.useForm();
    const mutateAdd = useCreateRoom({
        success: () => {
            notification.success({ message: 'Thêm mới phòng thành công' });
            navigate(config.routes.admin.room);
        },
        error: () => {
            notification.error({ message: 'Thêm mới phòng thất bại' });
        },
    });

    const mutateEdit = useUpdateRoom({
        id,
        success: () => {
            notification.success({ message: 'Cập nhật phòng thành công' });
            navigate(config.routes.admin.room);
        },
        error: () => {
            notification.error({ message: 'Cập nhật phòng thất bại' });
        },
    });

    useEffect(() => {
        if (!room) return;
        form.setFieldsValue({
            rapphim_id: room?.data?.rapphim_id,
            room_name: room?.data?.ten_phong_chieu,
            total_seats: room?.data?.tong_ghe_phong,
        });
    }, [room]);

    const handleAddRoom = async (formData) => {
        try {
            await mutateAdd.mutateAsync(formData);
        } catch (error) {
            console.error("Error during adding room:", error);
        }
    };

    const handleEditRoom = async (formData) => {
        try {
            await mutateEdit.mutateAsync({ id, body: formData });
        } catch (error) {
            console.error("Error during editing room:", error);
        }
    };

    const onFinish = async () => {
        const formData = {
            rapphim_id: form.getFieldValue('rapphim_id'),
            ten_phong_chieu: form.getFieldValue('room_name'),
            tong_ghe_phong: form.getFieldValue('total_seats'),
        };

        if (id) {
            await handleEditRoom(formData);
        } else {
            await handleAddRoom(formData);
        }
    };

    return (
        <div className="form-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>
                {id ? 'Cập nhật thông tin phòng' : 'Thêm phòng mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Rạp Phim ID"
                            name="rapphim_id"
                            rules={[{ required: true, message: 'Nhập ID rạp phim!' }]}
                        >
                            <Input placeholder="Nhập ID rạp phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tên Phòng"
                            name="room_name"
                            rules={[{ required: true, message: 'Nhập tên phòng!' }]}
                        >
                            <Input placeholder="Nhập tên phòng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tổng Ghế"
                            name="total_seats"
                            rules={[{ required: true, message: 'Nhập tổng ghế!' }]}
                        >
                            <Input placeholder="Nhập tổng ghế" />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button htmlType="reset" style={{ width: '48%' }}>Đặt lại</Button>
                    <Button htmlType="submit" className="bg-blue-500 text-white" style={{ width: '48%' }}>
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default RoomFormPage;