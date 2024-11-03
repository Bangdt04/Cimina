import { Button, Col, Form, Input, Row, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../../config';
import { useCreateRoom, useGetRoom, useUpdateRoom } from '../../../hooks/api/useRoomApi';

function RoomFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { isLoading: isLoadingRoom, data: room } = id
        ? useGetRoom(id)
        : { isLoading: null, data: null };

    const [form] = Form.useForm();

    useEffect(() => {
        if (!room) return;
        form.setFieldsValue({
            ten_phong_chieu: room?.data?.ten_phong_chieu,
            tong_ghe_phong: room?.data?.tong_ghe_phong,
        });
    }, [room]);

    const mutateAdd = useCreateRoom({
        success: () => {
            notification.success({
                message: 'Thêm mới thành công',
            });
            navigate(config.routes.admin.rooms);
        },
        error: () => {
            notification.error({
                message: 'Thêm mới thất bại',
            });
        },
    });

    const mutateEdit = useUpdateRoom({
        success: () => {
            notification.success({
                message: 'Cập nhật thành công',
            });
            navigate(config.routes.admin.rooms);
        },
        error: () => {
            notification.error({
                message: 'Cập nhật thất bại',
            });
        },
    });

    const onFinish = async () => {
        if (id) {
            await mutateEdit.mutateAsync({
                id: id,
                body: {
                    ten_phong_chieu: form.getFieldValue('ten_phong_chieu'),
                    tong_ghe_phong: form.getFieldValue('tong_ghe_phong'),
                },
            });
        } else {
            await mutateAdd.mutateAsync({
                ten_phong_chieu: form.getFieldValue('ten_phong_chieu'),
                tong_ghe_phong: form.getFieldValue('tong_ghe_phong'),
            });
        }
    };

    return (
        <div className="form-container">
            <h1>{id ? 'Cập nhật thông tin phòng' : 'Thêm phòng mới'}</h1>
            <Form
                name="room-form"
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên phòng"
                            name="ten_phong_chieu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập tên phòng!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tổng ghế"
                            name="tong_ghe_phong"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập tổng ghế!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button htmlType="reset" className="min-w-[10%]">Đặt lại</Button>
                    <Button htmlType="submit" className="bg-blue-500 text-white min-w-[10%]">
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default RoomFormPage;