import React, { useEffect, useState, useRef } from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    notification,
    Typography,
    Select,
    InputNumber,
    Upload,
} from 'antd';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import {
    UploadOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function MemberFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();
    const tokenData = localStorage.getItem('token');
    const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

    // Trạng thái tải dữ liệu và gửi form
    const [loadingData, setLoadingData] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const isSubmitting = useRef(false); // Ref để theo dõi trạng thái gửi form

    // Cấu hình notification khi component mount
    useEffect(() => {
        notification.config({
            placement: 'topRight',
            top: 50,
            duration: 4,
            rtl: false,
        });
    }, []);

    // Lấy dữ liệu thành viên để chỉnh sửa nếu có id
    useEffect(() => {
        if (id) {
            const fetchMember = async () => {
                setLoadingData(true); // Bắt đầu quá trình tải dữ liệu
                try {
                    const response = await axios.get(`http://localhost:8000/api/members/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const memberData = response.data.data;
                    form.setFieldsValue({
                        loai_hoi_vien: memberData.loai_hoi_vien,
                        uu_dai: memberData.uu_dai,
                        thoi_gian: memberData.thoi_gian,
                        ghi_chu: memberData.ghi_chu,
                        gia: memberData.gia,
                        trang_thai: memberData.trang_thai,
                        anh_hoi_vien: memberData.anh_hoi_vien
                            ? [
                                  {
                                      uid: '-1',
                                      name: memberData.anh_hoi_vien.split('/').pop(),
                                      status: 'done',
                                      url: `http://localhost:8000${memberData.anh_hoi_vien}`,
                                  },
                              ]
                            : [],
                    });
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Lấy thông tin thành viên thất bại.',
                        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                    });
                } finally {
                    setLoadingData(false); // Kết thúc quá trình tải dữ liệu
                }
            };
            fetchMember();
        }
    }, [id, form, token]);

    // Hàm xử lý khi gửi form
const onFinish = async (values) => {
    if (isSubmitting.current) {
        // Nếu đang gửi form, không làm gì cả
        return;
    }

    isSubmitting.current = true; // Đánh dấu là đang gửi form
    setLoadingSubmit(true); // Bật trạng thái gửi form

    const formData = new FormData();

    // Xử lý các trường khác
    formData.append('loai_hoi_vien', values.loai_hoi_vien);
    formData.append('uu_dai', values.uu_dai);
    formData.append('thoi_gian', values.thoi_gian);
    formData.append('ghi_chu', values.ghi_chu);
    formData.append('gia', values.gia);
    formData.append('trang_thai', values.trang_thai);

    // Xử lý ảnh hội viên
    if (values.anh_hoi_vien && values.anh_hoi_vien.length > 0) {
        const file = values.anh_hoi_vien[0].originFileObj;
        if (file) {
            formData.append('anh_hoi_vien', file);
        }
    }

    try {
        if (id) {
            // Gửi yêu cầu cập nhật thành viên
            await axios.post(`http://127.0.0.1:8000/api/members/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            notification.success({
                message: 'Thành công',
                description: 'Cập nhật thành viên thành công.',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            });
        } else {
            // Gửi yêu cầu thêm mới thành viên
            await axios.post('http://127.0.0.1:8000/api/members', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            notification.success({
                message: 'Thành công',
                description: 'Thêm mới thành viên thành công.',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            });
        }
        navigate(config.routes.admin.member); // Điều hướng về trang quản lý thành viên
    } catch (error) {
        // Kiểm tra lỗi cụ thể từ backend
        if (error.response) {
            if (error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((field) => {
                    form.setFields([
                        {
                            name: field,
                            errors: backendErrors[field],
                        },
                    ]);
                });
                notification.error({
                    message: 'Lỗi',
                    description: 'Vui lòng kiểm tra lại các trường đã nhập.',
                    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                });
            } else if (error.response.data.message) {
                // Hiển thị thông báo lỗi từ trường message
                notification.error({
                    message: 'Lỗi',
                    description: error.response.data.message,
                    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                });
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi lưu thành viên.',
                    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                });
            }
        } else {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể kết nối đến máy chủ.',
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            });
        }
    } finally {
        setLoadingSubmit(false); // Tắt trạng thái gửi form
        isSubmitting.current = false; // Đánh dấu đã hoàn thành gửi form
    }
};


    return (
        <div
            className="form-container"
            style={{
                padding: '40px',
                maxWidth: '800px',
                margin: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            {/* Header với nút quay lại và tiêu đề */}
            <Row align="middle" gutter={16} style={{ marginBottom: '20px' }}>
                <Col>
                    <Button
                        type="link"
                        onClick={() => navigate(-1)}
                        icon={<ArrowLeftOutlined />}
                        style={{
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        disabled={loadingSubmit}
                    >
                        Quay lại
                    </Button>
                </Col>
                <Col>
                    <Title level={2} style={{ color: '#333', margin: 0 }}>
                        {id ? 'Cập nhật thông tin thành viên' : 'Thêm mới thành viên'}
                    </Title>
                </Col>
            </Row>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{
                    backgroundColor: '#f9f9f9',
                    padding: '20px',
                    borderRadius: '12px',
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Loại Hội Viên"
                            name="loai_hoi_vien"
                            rules={[{ required: true, message: 'Chọn loại hội viên!' }]}
                        >
                            <Input
                                placeholder="Nhập loại hội viên"
                                style={{
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '14px',
                                    border: '1px solid #d9d9d9',
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Ưu Đãi (%)"
                            name="uu_dai"
                            rules={[{ required: true, message: 'Nhập ưu đãi!' }]}
                        >
                            <InputNumber
                                placeholder="Nhập ưu đãi"
                                min={1}
                                max={100}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Ảnh Hội Viên"
                            name="anh_hoi_vien"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            rules={[
                                {
                                    required: !id, // Bắt buộc khi thêm mới
                                    message: 'Chọn ảnh hội viên!',
                                },
                            ]}
                        >
                            <Upload
                                beforeUpload={() => false} // Ngăn việc upload tự động
                                listType="picture-card"
                                accept=".jpg,.jpeg,.png,.gif"
                                maxCount={1}
                                showUploadList={{ showRemoveIcon: true }}
                                style={{ borderRadius: '8px' }}
                            >
                                {id ? (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                                    </div>
                                ) : (
                                    <Button
                                        icon={<UploadOutlined />}
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px',
                                            fontSize: '14px',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        Chọn ảnh
                                    </Button>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Thời Gian (tháng)"
                            name="thoi_gian"
                            rules={[{ required: true, message: 'Nhập thời gian!' }]}
                        >
                            <InputNumber
                                placeholder="Nhập thời gian"
                                min={1}
                                
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Ghi Chú" name="ghi_chu">
                            <Input.TextArea
                                rows={2}
                                placeholder="Nhập ghi chú"
                                style={{
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '14px',
                                    border: '1px solid #d9d9d9',
                                    resize: 'vertical',
                                    minHeight: '100px',
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Giá (VND)"
                            name="gia"
                            rules={[{ required: true, message: 'Nhập giá!' }]}
                        >
                            <InputNumber
                                placeholder="Nhập giá"
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div
                    className="form-actions"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '10px 30px',
                            fontSize: '16px',
                            marginRight: '15px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        loading={loadingSubmit} // Hiển thị trạng thái tải khi gửi form
                        disabled={loadingSubmit} // Vô hiệu hóa nút gửi khi đang gửi
                    >
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                    <Button
                        type="default"
                        onClick={() => navigate(config.routes.admin.member)}
                        style={{
                            backgroundColor: '#f0f0f0',
                            color: '#333',
                            borderRadius: '8px',
                            padding: '10px 30px',
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        disabled={loadingSubmit}
                    >
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default MemberFormPage;
