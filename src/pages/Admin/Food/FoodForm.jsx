import { Button, Col, Form, Input, Row, notification, Typography, Select, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

function FoodFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState(false); // State khi gửi form

    useEffect(() => {
        if (id) {
            const fetchFood = async () => {
                try {
                    const { data } = await axios.get(`http://127.0.0.1:8000/api/editFood/${id}`);
                    form.setFieldsValue({
                        ten_do_an: data.data.ten_do_an,
                        gia: data.data.gia,
                        ghi_chu: data.data.ghi_chu,
                        anh_do_an: data.data.anh_do_an
                            ? [
                                  {
                                      uid: '-1',
                                      name: data.data.anh_do_an.split('/').pop(),
                                      status: 'done',
                                      url: `http://127.0.0.1:8000${data.data.anh_do_an}`,
                                  },
                              ]
                            : [],
                    });
                } catch (error) {
                    notification.error({
                        message: 'Không thể tải dữ liệu',
                        description: 'Vui lòng thử lại sau!',
                    });
                }
            };
            fetchFood();
        }
    }, [id, form]);

    const onFinish = async (values) => {
        const formData = new FormData();

        // Xử lý các trường khác (ngoài 'anh_do_an')
        Object.keys(values).forEach((key) => {
            if (key !== 'anh_do_an') {
                formData.append(key, values[key]);
            }
        });

        // Xử lý ảnh món ăn
        if (values.anh_do_an && values.anh_do_an.length > 0) {
            const file = values.anh_do_an[0]?.originFileObj;
            if (file) {
                // Nếu có tệp ảnh mới, thêm tệp đó vào formData
                formData.append('anh_do_an', file);
            }
            // Nếu không có tệp mới nhưng đã có ảnh cũ, không thêm 'anh_do_an' vào formData
            // Backend sẽ giữ nguyên ảnh cũ
        } else if (id) {
            // Khi chỉnh sửa và không thay đổi ảnh, không thêm 'anh_do_an' vào formData
            // Backend sẽ giữ nguyên ảnh cũ
        } else {
            // Khi thêm mới nhưng không có ảnh, backend sẽ báo lỗi (do quy tắc xác thực)
            // Đây không nên xảy ra vì khi thêm mới, 'anh_do_an' là bắt buộc
        }

        setLoadingSubmit(true); // Bật trạng thái gửi form

        try {
            const url = id
                ? `http://127.0.0.1:8000/api/updateFood/${id}`
                : 'http://127.0.0.1:8000/api/storeFood';

            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            notification.success({
                message: id ? 'Cập nhật món ăn thành công' : 'Thêm mới món ăn thành công',
                description: response.data.message,
                placement: 'topRight',
            });

            navigate(config.routes.admin.food);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((field) => {
                    form.setFields([
                        {
                            name: field,
                            errors: backendErrors[field],
                        },
                    ]);
                });
            } else {
                notification.error({
                    message: id ? 'Cập nhật món ăn thất bại' : 'Thêm mới món ăn thất bại',
                    description: 'Có lỗi xảy ra khi thao tác với món ăn.',
                    placement: 'topRight',
                });
            }
        } finally {
            setLoadingSubmit(false); // Tắt trạng thái gửi form
        }
    };

    return (
        <div
            className="form-container"
            style={{
                padding: '40px',
                maxWidth: '1600px',
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
                {id ? 'Cập nhật thông tin món ăn' : 'Thêm món ăn mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[24, 24]}>
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
                            label="Giá (VND)"
                            name="gia"
                            rules={[{ required: true, message: 'Nhập giá món ăn!' }]}
                        >
                            <Input type="number" placeholder="Nhập giá món ăn" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Ghi chú" name="ghi_chu">
                            <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Ảnh món ăn"
                            name="anh_do_an"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            rules={[
                                {
                                    required: !id, // Bắt buộc khi thêm mới
                                    message: 'Chọn ảnh món ăn!',
                                },
                            ]}
                            extra="Chọn ảnh món ăn (Tối đa 2MB)"
                        >
                            <Upload
                                beforeUpload={() => false} // Ngăn việc upload tự động
                                listType="picture-card"
                                accept=".jpg,.jpeg,.png,.gif"
                                maxCount={1}
                                showUploadList={{ showRemoveIcon: true }}
                            >
                                {id ? (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                                    </div>
                                ) : (
                                    <Button icon={<UploadOutlined />} style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }}>
                                        Chọn ảnh
                                    </Button>
                                )}
                            </Upload>
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
                        loading={loadingSubmit} // Hiển thị trạng thái tải khi gửi form
                    >
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Row>
            </Form>
        </div>
    );
}

export default FoodFormPage;
