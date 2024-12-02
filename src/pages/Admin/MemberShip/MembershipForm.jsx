import { Button, Col, Form, Input, notification, Typography, Select, InputNumber, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;
const { Option } = Select;

function MembershipFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();
    const tokenData = localStorage.getItem('token');
    const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

    useEffect(() => {
        if (id) {
            const fetchMembership = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/members/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    form.setFieldsValue(response.data.data); // Giả sử dữ liệu trả về có cấu trúc { data: { ... } }
                } catch (error) {
                    notification.error({ message: 'Lấy thông tin thành viên thất bại' });
                }
            };
            fetchMembership();
        }
    }, [id, form, token]);

    const onFinish = async (values) => {
        const formData = {
            loai_hoi_vien: values.loai_hoi_vien,
            uu_dai: values.uu_dai,
            thoi_gian: values.thoi_gian,
            ghi_chu: values.ghi_chu,
            gia: values.gia,
            trang_thai: values.trang_thai,
        };

        try {
            const url = id
                ? `http://localhost:8000/api/members/${id}`
                : 'http://localhost:8000/api/members';

            const method = id ? 'put' : 'post';
            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            notification.success({
                message: id ? 'Cập nhật thành viên thành công' : 'Thêm mới thành viên thành công',
            });

            navigate(config.routes.admin.membership);
        } catch (error) {
            notification.error({
                message: id ? 'Cập nhật thành viên thất bại' : 'Thêm mới thành viên thất bại',
            });
        }
    };

    return (
        <div
            className="form-container"
            style={{
                padding: '40px',
                maxWidth: '1800px',
                margin: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Title
                level={2}
                style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: '#4CAF50',
                    fontWeight: 600,
                }}
            >
                {id ? 'Cập nhật thông tin thành viên' : 'Thêm mới thành viên'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[24, 24]}>
                    <Col span={12}>
                        <Form.Item
                            label="Loại Hội Viên"
                            name="loai_hoi_vien"
                            rules={[{ required: true, message: 'Chọn loại hội viên!' }]}
                        >
                            <Select placeholder="Chọn loại hội viên">
                                <Option value="thường">Thường</Option>
                                <Option value="cao cấp">Cao cấp</Option>
                                <Option value="vip">VIP</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ưu Đãi (%)"
                            name="uu_dai"
                            rules={[{ required: true, message: 'Nhập ưu đãi!' }]}
                        >
                            <InputNumber placeholder="Nhập ưu đãi" min={0} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thời Gian (tháng)"
                            name="thoi_gian"
                            rules={[{ required: true, message: 'Nhập thời gian!' }]}
                        >
                            <InputNumber placeholder="Nhập thời gian" min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Ghi Chú" name="ghi_chu">
                            <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá (VND)"
                            name="gia"
                            rules={[{ required: true, message: 'Nhập giá!' }]}
                        >
                            <InputNumber placeholder="Nhập giá" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng Thái"
                            name="trang_thai"
                            rules={[{ required: true, message: 'Chọn trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value={1}>Hoạt động</Option>
                                <Option value={0}>Không hoạt động</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-between" style={{ marginTop: '20px' }}>
                    <Button
                        style={{
                            width: '48%',
                            backgroundColor: '#f44336',
                            color: '#ffffff',
                            borderRadius: '8px',
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            width: '48%',
                            backgroundColor: '#4CAF50',
                            color: '#ffffff',
                            borderRadius: '8px',
                        }}
                    >
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Row>
            </Form>
        </div>
    );
}

export default MembershipFormPage;