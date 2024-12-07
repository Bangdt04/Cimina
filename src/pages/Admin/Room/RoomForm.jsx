import { Button, Form, Input, notification, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../../config';
import { useUpdateRoom, useGetRoom, useCreateRoom } from '../../../hooks/api/useRoomApi';

const { Title } = Typography;

function RoomFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { data: room } = id ? useGetRoom(id) : { data: null };
    
    const [form] = Form.useForm();
    const mutateAdd = useCreateRoom({
        success: () => {
            notification.success({ message: 'Thêm mới phòng thành công', placement: 'topRight' });
            navigate(-1);  // Quay lại trang trước
        },
        error: (error) => {
            const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
            notification.error({ message: errorMessage, placement: 'topRight' });
        },
    });
    
    const mutateEdit = useUpdateRoom({
        id,
        success: () => {
            notification.success({ message: 'Cập nhật phòng thành công', placement: 'topRight' });
            navigate(-1);  // Quay lại trang trước
        },
        error: (error) => {
            const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
            notification.error({ message: errorMessage, placement: 'topRight' });
        },
    });
    
    useEffect(() => {
        if (!room) return;
        form.setFieldsValue({
            room_name: room?.data?.ten_phong_chieu,
        });
    }, [room]);

    const onFinish = async () => {
        const formData = {
            ten_phong_chieu: form.getFieldValue('room_name'),
        };

        if (id) {
            await mutateEdit.mutateAsync({ id, body: formData });
        } else {
            await mutateAdd.mutateAsync(formData);
        }
    };

    return (
        <div className="form-container" style={{ padding: '40px 60px', maxWidth: '1000px', margin: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px', color: '#4C4C6C' }}>
                {id ? 'Cập nhật thông tin phòng' : 'Thêm mới thông tin phòng'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tên Phòng"
                    name="room_name"
                    rules={[{ required: true, message: 'Nhập tên phòng!' }]}
                    style={{ marginBottom: '20px' }}
                >
                    <Input placeholder="Nhập tên phòng" style={{ borderRadius: '8px', padding: '10px' }} />
                </Form.Item>
                <div className="form-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                    <Button type="" onClick={() => navigate(-1)} className="cancel-button" style={{ backgroundColor: 'red', color: 'white' }}>Hủy</Button>
                    <Button 
                        htmlType="submit" 
                        className="bg-blue-500 text-white" 
                        style={{ width: '48%', borderRadius: '8px', backgroundColor: '#4D76D7', padding: '10px', fontWeight: '500' }}
                    >
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default RoomFormPage;
