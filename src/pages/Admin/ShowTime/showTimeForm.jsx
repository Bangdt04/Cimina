import { Button, Col, Form, Input, Row, notification, Typography, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../../config';
import { usestoreShowtime, useAddShowtime, useUpdateShowtime } from '../../../hooks/api/useShowtimeApi';

const { Title } = Typography;

function ShowtimeFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { isLoading, data: showtime } = id ? useAddShowtime(id) : { isLoading: null, data: null };

    const [form] = Form.useForm();
    const mutateAdd = usestoreShowtime({
        success: () => {
            notification.success({ message: 'Thêm mới thành công' });
            navigate(config.routes.admin.showTime);
        },
        error: () => {
            notification.error({ message: 'Thêm mới thất bại' });
        },
    });

    const mutateEdit = useUpdateShowtime({
        id,
        success: () => {
            notification.success({ message: 'Cập nhật thành công' });
            navigate(config.routes.admin.showTime);
        },
        error: () => {
            notification.error({ message: 'Cập nhật thất bại' });
        },
    });

    useEffect(() => {
        if (!showtime) return;
        form.setFieldsValue({
            phim_id: showtime?.data?.phim_id, // New field
            room_id: showtime?.data?.room_id, // New field
            ngay_chieu: showtime?.data?.ngay_chieu || "2024-11-14", // New field with default value
            gio_chieu: showtime?.data?.gio_chieu || [], // New field
        });
    }, [showtime]);

    const onAddFinish = async (formData) => {
        await mutateAdd.mutateAsync(formData);
    };

    const onEditFinish = async (formData) => {
        await mutateEdit.mutateAsync({ id, body: formData });
    };

    const onFinish = async () => {
        const formData = {
            phim_id: form.getFieldValue('phim_id'), // New field
            room_id: form.getFieldValue('room_id'), // New field
            ngay_chieu: form.getFieldValue('ngay_chieu'), // New field
            gio_chieu: form.getFieldValue('gio_chieu'), // New field
        };

        if (id) {
            await onEditFinish(formData);
        } else {
            await onAddFinish(formData);
        }
    };

    return (
        <div className="form-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
                {id ? 'Cập nhật thông tin suất chiếu' : 'Thêm suất chiếu mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Phim ID"
                            name="phim_id"
                            rules={[{ required: true, message: 'Nhập ID phim!' }]}
                        >
                            <Input placeholder="Nhập ID phim" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Room ID"
                            name="room_id"
                            rules={[{ required: true, message: 'Nhập ID phòng!' }]}
                        >
                            <Input placeholder="Nhập ID phòng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày chiếu"
                            name="ngay_chieu"
                            rules={[{ required: true, message: 'Nhập ngày chiếu!' }]}
                        >
                            <Input placeholder="Nhập ngày chiếu (YYYY-MM-DD)" defaultValue="2024-11-14" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giờ chiếu"
                            name="gio_chieu"
                            rules={[{ required: true, message: 'Chọn giờ chiếu!' }]}
                        >
                            <Select mode="multiple" placeholder="Chọn giờ chiếu">
                                <Select.Option value="07:00">07:00</Select.Option>
                                <Select.Option value="09:00">09:00</Select.Option>
                                <Select.Option value="11:00">11:00</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button htmlType="reset" style={{ width: '48%', background: 'red' }} onClick={() => navigate(-1)}>Hủy</Button>
                    <Button htmlType="submit" className="bg-blue-500 text-white" style={{ width: '48%' }}>
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default ShowtimeFormPage;