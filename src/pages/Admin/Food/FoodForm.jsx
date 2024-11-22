import { Button, Col, Form, Input, Row, notification, Typography, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;

function FoodFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();

    // Hàm xử lý khi thêm mới món ăn
    const onFinish = async () => {
        const formData = new FormData(); // Sử dụng FormData để gửi dữ liệu

        // Lấy giá trị từ form và append vào formData
        formData.append('ten_do_an', form.getFieldValue('ten_do_an'));
        formData.append('gia', form.getFieldValue('gia'));
        formData.append('ghi_chu', form.getFieldValue('ghi_chu'));
        formData.append('trang_thai', form.getFieldValue('trang_thai'));

        // Kiểm tra và thêm file ảnh nếu có
        const fileInput = form.getFieldValue('anh_do_an');
        if (fileInput && fileInput.fileList && fileInput.fileList.length > 0) {
            formData.append('anh_do_an', fileInput.fileList[0].originFileObj); // Thêm file ảnh vào FormData
        } else {
            notification.warning({
                message: 'Chưa có ảnh',
                description: 'Vui lòng chọn ảnh món ăn trước khi gửi.',
            });
            return; // Dừng hàm nếu không có ảnh
        }

        // Gửi formData với axios
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/storeFood', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Đảm bảo đúng content type
                },
            });
            // Xử lý phản hồi thành công
            notification.success({
                message: 'Thêm mới món ăn thành công',
                description: response.data.message,
            });
            navigate(config.routes.admin.food);
        } catch (error) {
            // Xử lý lỗi
            if (error.response) {
                const { data } = error.response;
                notification.error({
                    message: 'Thêm mới món ăn thất bại',
                    description: data.message || 'Có lỗi xảy ra khi thêm món ăn.',
                });
            }
        }
    };

    return (
        <div className="form-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
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
                        <Form.Item
                            label="Ghi chú"
                            name="ghi_chu"
                        >
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
                            <Input type="file" />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-between items-center gap-[1rem]">
                    <Button htmlType="reset" style={{ width: '48%' , background:'red' }} onClick={() => navigate(-1)}>Hủy</Button>
                    <Button htmlType="submit" className="bg-blue-500 text-white" style={{ width: '48%' }}>
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default FoodFormPage;