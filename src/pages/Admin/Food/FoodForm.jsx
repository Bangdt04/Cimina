import { Button, Col, Form, Input, Row, notification, Typography, Select, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;

function FoodFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();

    // Hàm xử lý khi thêm mới hoặc cập nhật món ăn
    const onFinish = async (values) => {
        const formData = new FormData();

        // Lặp qua tất cả các trường dữ liệu trong form
        Object.keys(values).forEach((key) => {
            if (key === 'anh_do_an') {
                // Xử lý ảnh nếu có
                if (values[key] && values[key][0]) {
                    formData.append(key, values[key][0].originFileObj);
                }
            } else {
                formData.append(key, values[key]);
            }
        });

        try {
            if (id) {
                // Nếu có id, thực hiện update
                const response = await axios.post(`http://127.0.0.1:8000/api/updateFood/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({
                    message: 'Cập nhật món ăn thành công',
                    description: response.data.message,
                });
            } else {
                // Nếu không có id, thực hiện tạo mới
                const response = await axios.post('http://127.0.0.1:8000/api/storeFood', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({
                    message: 'Thêm mới món ăn thành công',
                    description: response.data.message,
                });
            }
            navigate(config.routes.admin.food); // Điều hướng về trang danh sách món ăn
        } catch (error) {
            // Xử lý lỗi từ API
            if (error.response) {
                const { data } = error.response;
                notification.error({
                    message: id ? 'Cập nhật món ăn thất bại' : 'Thêm mới món ăn thất bại',
                    description: data.message || 'Có lỗi xảy ra khi thao tác với món ăn.',
                });
            }
        }
    };

    // Lấy dữ liệu món ăn khi chỉnh sửa
    useEffect(() => {
        if (id) {
            const fetchFood = async () => {
                try {
                    const { data } = await axios.get(`http://127.0.0.1:8000/api/editFood/${id}`);
                    form.setFieldsValue(data); // Điền dữ liệu vào form
                } catch (error) {
                    notification.error({
                        message: 'Không thể tải dữ liệu',
                        description: 'Vui lòng thử lại sau!',
                    });
                }
            };
            fetchFood();
        }
    }, [id]);

    return (
        <div
            className="form-container"
            style={{
                padding: '20px',
                maxWidth: '600px',
                margin: 'auto',
                backgroundColor: '#f9f9f9',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
                {id ? 'Cập nhật thông tin món ăn' : 'Thêm món ăn mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên món ăn"
                            name="ten_do_an"
                            rules={[{ required: true, message: 'Nhập tên món ăn!' }]}
                        >
                            <Input placeholder="Nhập tên món ăn" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá"
                            name="gia"
                            rules={[{ required: true, message: 'Nhập giá món ăn!' }]}
                        >
                            <Input placeholder="Nhập giá món ăn" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Ghi chú" name="ghi_chu">
                            <Input placeholder="Nhập ghi chú" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="trang_thai"
                            rules={[{ required: true, message: 'Chọn trạng thái món ăn!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={0}>Còn hàng</Select.Option>
                                <Select.Option value={1}>Hết hàng</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ảnh món ăn"
                            name="anh_do_an"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            extra="Chọn ảnh món ăn (Tối đa 2MB)"
                        >
                            <Upload
                                beforeUpload={() => false} // Không upload ngay mà xử lý khi submit
                                listType="picture-card" // Hiển thị ảnh sau khi upload
                                accept=".jpg,.jpeg,.png,.gif" // Giới hạn loại file
                                maxCount={1} // Chỉ cho phép upload 1 ảnh
                            >
                                <Button>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button
                        htmlType="reset"
                        style={{ width: '48%', backgroundColor: 'red', color: 'white' }}
                        onClick={() => navigate(-1)}
                    >
                        Hủy
                    </Button>
                    <Button
                        htmlType="submit"
                        style={{
                            width: '48%',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                        }}
                    >
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default FoodFormPage;
