import { Button, Col, Form, Row, notification, Typography, Select, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../../config';
import { usestoreShowtime, useAddShowtime, useshowShowtime, useUpdateShowtime } from '../../../hooks/api/useShowtimeApi';
import moment from 'moment';

const { Title } = Typography;

function ShowtimeFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { isLoading: loadingShowtime, data: showtime } = id ? useshowShowtime(id) : { isLoading: null, data: null };
    const { data: showtimeData } = useAddShowtime();

    useEffect(() => {
        console.log('Showtime data:', showtime);
    }, [showtime]);

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
    
        // Tìm ID phim và ID phòng từ showtimeData
        const movieId = showtimeData?.data?.movies?.find(movie => movie.ten_phim === showtime.movie)?.id || '';
        const roomId = showtimeData?.data?.rooms?.find(room => room.ten_phong_chieu === showtime.room)?.id || '';
    
        form.setFieldsValue({
            phim_id: movieId,
            room_id: roomId,
            ngay_chieu: moment(showtime.ngay_chieu),
            gio_chieu: showtime.gio_chieu ? [showtime.gio_chieu] : [],
        });
    }, [showtime, showtimeData]);

    const onAddFinish = async (formData) => {
        await mutateAdd.mutateAsync(formData);
    };

    const onEditFinish = async (formData) => {
        await mutateEdit.mutateAsync({ id, body: formData });
    };

    const onFinish = async () => {
        const formData = {
            phim_id: form.getFieldValue('phim_id'),
            room_id: form.getFieldValue('room_id'),
            ngay_chieu: form.getFieldValue('ngay_chieu').format('YYYY-MM-DD'),
            gio_chieu: form.getFieldValue('gio_chieu'),
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
                            rules={[{ required: true, message: 'Chọn ID phim!' }]} // Updated message
                        >
                            <Select placeholder="Chọn ID phim">
                                {showtimeData?.data?.movies?.map(movie => (
                                    <Select.Option key={movie.id} value={movie.id}>{movie.ten_phim}</Select.Option> // Use movie ID as value
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Room ID"
                            name="room_id"
                            rules={[{ required: true, message: 'Chọn ID phòng!' }]} // Updated message
                        >
                            <Select placeholder="Chọn ID phòng">
                                {showtimeData?.data?.rooms?.map(room => (
                                    <Select.Option key={room.id} value={room.id}>{room.ten_phong_chieu}</Select.Option> // Use room ID as value
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày chiếu"
                            name="ngay_chieu"
                            rules={[{ required: true, message: 'Chọn ngày chiếu!' }]} // Updated message
                        >
                            <DatePicker placeholder="Chọn ngày chiếu" format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giờ chiếu"
                            name="gio_chieu"
                            rules={[{ required: true, message: 'Chọn giờ chiếu!' }]}>
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