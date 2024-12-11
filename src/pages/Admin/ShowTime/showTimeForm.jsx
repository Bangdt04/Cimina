import { Button, Col, Form, Row, notification, Typography, Select, DatePicker, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../../config';
import { usestoreShowtime, useAddShowtime, useshowShowtime, useUpdateShowtime } from '../../../hooks/api/useShowtimeApi';
import moment from 'moment';
import axios from 'axios'; // Import axios for making API calls
const { Title } = Typography;

function ShowtimeFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const isEdit = Boolean(id); // Xác định chế độ Add hoặc Edit
    const { isLoading: loadingShowtime, data: showtime } = isEdit ? useshowShowtime(id) : { isLoading: null, data: null };
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
        const movieId = showtimeData?.data?.movies?.find(movie => movie.ten_phim === showtime.movie)?.id || '';
        const roomId = showtimeData?.data?.rooms?.find(room => room.ten_phong_chieu === showtime.room)?.id || '';

        // Kiểm tra và định dạng giờ chiếu
        const gioChieuValue = typeof showtime.gio_chieu === 'string' ? 
            moment(showtime.gio_chieu, 'HH:mm:ss').format('HH:mm') : 
            '';

        form.setFieldsValue({
            phim_id: movieId,
            room_id: isEdit ? roomId : [],
            ngay_chieu: moment(showtime.ngay_chieu),
            gio_chieu: isEdit ? gioChieuValue : [], 
        });
    }, [showtime, showtimeData, isEdit, form]);

    const onAddFinish = async (formData) => {
        await mutateAdd.mutateAsync(formData);
    };

    const onEditFinish = async (formData) => {
        await mutateEdit.mutateAsync({ id, body: formData });
    };

    const onFinish = async () => {
        const phim_id = form.getFieldValue('phim_id');
        const ngay_chieu = form.getFieldValue('ngay_chieu').format('YYYY-MM-DD');
        const gio_chieu = form.getFieldValue('gio_chieu');

        let formData = {
            phim_id,
            ngay_chieu,
            gio_chieu,
        };

        if (isEdit) {
            formData.room_id = form.getFieldValue('room_id'); // Sử dụng room_id khi chỉnh sửa
        } else {
            formData.room_ids = form.getFieldValue('room_ids'); // Sử dụng room_ids khi thêm mới
        }

        try {
            if (isEdit) {
                await onEditFinish(formData);
            } else {
                await onAddFinish(formData);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error || 'Đã xảy ra lỗi không xác định';
                notification.error({
                    message: 'Lỗi',
                    description: errorMessage,
                    placement: 'topRight',
                });
            } else {
                notification.error({ message: 'Đã xảy ra lỗi không xác định', placement: 'topRight' });
            }
        }
    };

    const handleAddShowtime = (value) => {
        if (value) {
            form.setFieldsValue({ gio_chieu: [...(form.getFieldValue('gio_chieu') || []), value] });
        }
    };

    const handleRemoveShowtime = (value) => {
        const currentValues = form.getFieldValue('gio_chieu') || [];
        const updatedValues = currentValues.filter(time => time !== value);
        form.setFieldsValue({ gio_chieu: updatedValues });
    };

    const validateShowtime = (_, value) => {
        if (isEdit && !value) {
            return Promise.reject('Giờ chiếu không được để trống');
        }
        const currentTime = moment();
        const showtimeMoment = moment(value, 'HH:mm');
        if (showtimeMoment.isBefore(currentTime, 'minute')) {
            return Promise.reject('Giờ chiếu không thể trước giờ hiện tại');
        }
        return Promise.resolve();
    };

    return (
        <div className="form-container" style={{ padding: '20px', maxWidth: '1800px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
                {isEdit ? 'Cập nhật thông tin suất chiếu' : 'Thêm suất chiếu mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Phim"
                            name="phim_id"
                            rules={[{ required: true, message: 'Chọn phim!' }]}>
                            <Select placeholder="Chọn phim">
                                {showtimeData?.data?.movies?.map(movie => (
                                    <Select.Option key={movie.id} value={movie.id}>{movie.ten_phim}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phòng chiếu"
                            name={isEdit ? "room_id" : "room_ids"}
                            rules={[{ required: true, message: 'Chọn phòng chiếu!' }]}>
                            {isEdit ? (
                                <Select placeholder="Chọn phòng chiếu">
                                    {showtimeData?.data?.rooms?.map(room => (
                                        <Select.Option key={room.id} value={room.id}>{room.ten_phong_chieu}</Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <Select mode="multiple" placeholder="Chọn phòng chiếu">
                                    {showtimeData?.data?.rooms?.map(room => (
                                        <Select.Option key={room.id} value={room.id}>{room.ten_phong_chieu}</Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày chiếu"
                            name="ngay_chieu"
                            rules={[{ required: true, message: 'Chọn ngày chiếu!' }]}>
                            <DatePicker
                                placeholder="Chọn ngày chiếu"
                                format="YYYY-MM-DD"
                                disabledDate={(current) => current && current < moment().startOf('day')} // Disable past dates
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giờ chiếu"
                            name="gio_chieu"
                            rules={[
                                { required: !isEdit, message: 'Nhập giờ chiếu!' },
                                { validator: validateShowtime }
                            ]}>
                            {isEdit ? (
                                <Input
                                    placeholder="Nhập giờ chiếu (HH:mm)"
                                />
                            ) : (
                                <>
                                    <Input
                                        placeholder="Nhập giờ chiếu (HH:mm)"
                                        onPressEnter={(e) => {
                                            const value = e.target.value;
                                            if (value) {
                                                handleAddShowtime(value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                    <div>
                                        {form.getFieldValue('gio_chieu')?.map((time) => (
                                            <div key={time} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{time}</span>
                                                <Button type="link" onClick={() => handleRemoveShowtime(time)}>Xóa</Button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button htmlType="reset" style={{ width: '48%', background: 'red', color: 'white' }} onClick={() => navigate(-1)}>Hủy</Button>
                    <Button htmlType="submit" className="bg-blue-500 text-white" style={{ width: '48%' }}>
                        {isEdit ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default ShowtimeFormPage;
