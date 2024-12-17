import { Button, Col, Form, Input, Row, notification, Typography, Select, Card } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import config from '../../../config';
import { useCreateSeat, useGetSeatById, useUpdateSeat, useGetAddSeat } from '../../../hooks/api/useSeatApi';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

function SeatFormPage() {
    const navigate = useNavigate();
    const location = useLocation();
    let { id } = useParams();
    const roomIdFromState = location.state?.roomId || null; // Retrieve roomId from navigation state
    const { isLoading: loadingSeat, data: seat } = id ? useGetSeatById(id) : { isLoading: null, data: null };
    const { data: roomDataResponse, isLoading: loadingRooms } = useGetAddSeat();
    const roomData = roomDataResponse?.data || [];

    const [form] = Form.useForm();
    const [price, setPrice] = useState(0);  // State to manage price

    const mutateAdd = useCreateSeat({
        success: () => {
            notification.success({
                message: 'Thêm mới thành công',
                placement: 'topRight',
            });
            navigate(config.routes.admin.room); // Navigate to Room page after success
        },
        error: (error) => {
            const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
            const errorDetails = error?.response?.data?.existing_seats?.join(", ") || ""; // Nếu có thông tin chi tiết về ghế trùng
            const fullMessage = errorDetails ? `${errorMessage} ${errorDetails}` : errorMessage;
            
            notification.error({ 
                message: fullMessage, 
                placement: 'topRight' 
            });
        }
    });

    const mutateEdit = useUpdateSeat({
        id,
        success: () => {
            notification.success({
                message: 'Cập nhật thành công',
                placement: 'topRight',
            });
            navigate(config.routes.admin.room);
        },
        error: (error) => {
            const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
            notification.error({ message: errorMessage, placement: 'topRight' });
        },
    });

    useEffect(() => {
        if (!seat) return;
        form.setFieldsValue({
            so_ghe_ngoi: seat?.data?.so_ghe_ngoi,
            loai_ghe_ngoi: seat?.data?.loai_ghe_ngoi,
            gia_ghe: seat?.data?.gia_ghe,
            room_id: seat?.data?.room_id,
        });
    }, [seat, form]);

    useEffect(() => {
        if (roomIdFromState) {
            form.setFieldsValue({
                room_id: roomIdFromState,
            });
        }
    }, [roomIdFromState, form]);

    const onChangeLoạiGhế = (value) => {
        // Cập nhật giá ghế dựa trên loại ghế
        let priceValue = 0;
        if (value === 'Thường') {
            priceValue = 5000;
        } else if (value === 'Đôi') {
            priceValue = 20000;
        } else if (value === 'Vip') {
            priceValue = 12000;
        }
        setPrice(priceValue);
        form.setFieldsValue({
            gia_ghe: priceValue,
        });
    };

    const onFinish = async () => {
        const formData = {
            room_id: form.getFieldValue('room_id'),
            seats: [
                {
                    range: `${form.getFieldValue('so_ghe_bat_dau')}-${form.getFieldValue('so_ghe_ket_thuc')}`,
                    loai_ghe_ngoi: form.getFieldValue('loai_ghe_ngoi'),
                    gia_ghe: parseFloat(form.getFieldValue('gia_ghe')),
                }
            ]
        };

        if (id) {
            const editData = {
                so_ghe_ngoi: form.getFieldValue('so_ghe_ngoi'),
                loai_ghe_ngoi: form.getFieldValue('loai_ghe_ngoi'),
                gia_ghe: parseFloat(form.getFieldValue('gia_ghe')),
                room_id: form.getFieldValue('room_id'),
            };
            await mutateEdit.mutateAsync({ id, body: editData });
        } else {
            // Kiểm tra nếu chỉ có ghế bắt đầu
            const so_ghe_bat_dau = form.getFieldValue('so_ghe_bat_dau');
            const so_ghe_ket_thuc = form.getFieldValue('so_ghe_ket_thuc');

            if (so_ghe_bat_dau && !so_ghe_ket_thuc) {
                // Gọi API storeOneSeat để thêm 1 ghế
                try {
                    await axios.post('http://127.0.0.1:8000/api/storeOneSeat', {
                        room_id: form.getFieldValue('room_id'),
                        so_ghe_ngoi: so_ghe_bat_dau,
                        loai_ghe_ngoi: form.getFieldValue('loai_ghe_ngoi'),
                        gia_ghe: parseFloat(form.getFieldValue('gia_ghe')),
                    });

                    notification.success({
                        message: 'Thêm ghế thành công',
                        placement: 'topRight',
                    });
                    navigate(config.routes.admin.room); // Navigate to Room page after success
                } catch (error) {
                    const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra';
                    // Handle specific error case for existing seats
                    if (errorMessage.includes("Có ghế trùng trong phòng này")) {
                        notification.error({
                            message: 'Có ghế trùng trong phòng này, không thể thêm ghế mới',
                            description: error?.response?.data?.existing_seats.join(', '),
                            placement: 'topRight',
                        });
                    } else {
                        notification.error({
                            message: errorMessage,
                            placement: 'topRight',
                        });
                    }
                }
            } else {
                // Nếu có ghế bắt đầu và kết thúc, gọi mutateAdd
                await mutateAdd.mutateAsync(formData);
            }
        }
    };

    return (
        <Card style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: '20px' }}>
                {id ? 'Cập nhật thông tin ghế' : 'Thêm ghế mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[24, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Chọn phòng"
                            name="room_id"
                            rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu.' }]}
                        >
                            <Select 
                                placeholder="Chọn phòng" 
                                loading={loadingRooms} 
                                style={{ borderRadius: '4px' }} 
                                disabled={!!id || !!roomIdFromState} // Disable if editing or roomId is pre-selected
                            >
                                {roomData.map(room => (
                                    <Option key={room.id} value={room.id}>
                                        {room.ten_phong_chieu}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Only show these fields if it's the "add" form (not edit form) */}
                    {!id && (
                        <>
                            <Col span={12}>
                                <Form.Item
                                    label="Số ghế ngồi bắt đầu"
                                    name="so_ghe_bat_dau"
                                    rules={[{ required: true, message: 'Vui lòng nhập số ghế ngồi bắt đầu.' }]}
                                >
                                    <Input placeholder="Ví dụ: A1" style={{ borderRadius: '4px' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Số ghế ngồi kết thúc"
                                    name="so_ghe_ket_thuc"
                                    rules={[{ required: false, message: 'Vui lòng nhập số ghế ngồi kết thúc.' }]}
                                >
                                    <Input placeholder="Ví dụ: A5" style={{ borderRadius: '4px' }} />
                                </Form.Item>
                            </Col>
                        </>
                    )}

                    {/* For the update form, show only the "Number of Seats" field */}
                    {id && (
                        <Col span={12}>
                            <Form.Item
                                label="Số ghế ngồi (Range)"
                                name="so_ghe_ngoi"
                                rules={[{ required: true, message: 'Vui lòng nhập số ghế ngồi.' }]}
                            >
                                <Input placeholder="Ví dụ: A1-A5" style={{ borderRadius: '4px' }} disabled={id} />
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={12}>
                        <Form.Item
                            label="Loại ghế ngồi"
                            name="loai_ghe_ngoi"
                            rules={[{ required: true, message: 'Vui lòng chọn loại ghế ngồi.' }]}
                        >
                            <Select placeholder="Chọn loại ghế ngồi" style={{ borderRadius: '4px' }} onChange={onChangeLoạiGhế}>
                                <Option value="Thường">Thường</Option>
                                <Option value="Đôi">Đôi</Option>
                                <Option value="vip">Vip</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Giá ghế"
                            name="gia_ghe"
                            rules={[{ required: true, message: 'Vui lòng nhập giá ghế.' }]}
                        >
                            <Input value={price} disabled={true} style={{ borderRadius: '4px' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block style={{ borderRadius: '4px' }}>
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );

}

export default SeatFormPage;
