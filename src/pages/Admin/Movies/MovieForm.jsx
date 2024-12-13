import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    notification,
    Typography,
    Select,
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

function MovieFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();
    const [genres, setGenres] = useState([]); // State để lưu thể loại phim
    const [loadingGenres, setLoadingGenres] = useState(true); // State tải thể loại phim
    const [loadingSubmit, setLoadingSubmit] = useState(false); // State khi gửi form

    // Cấu hình notification khi component mount
    useEffect(() => {
        notification.config({
            placement: 'topRight', // Đặt vị trí thông báo ở góc phải phía trên
            top: 50, // Khoảng cách từ trên
            duration: 4, // Thời gian hiển thị (giây)
            rtl: false, // Ngôn ngữ viết từ phải sang trái hay không
        });
    }, []);

    // Lấy danh sách thể loại phim khi component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/addMovie');
                setGenres(response.data.data); // Cập nhật dữ liệu thể loại phim
                setLoadingGenres(false); // Đặt trạng thái tải về false
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Lỗi khi tải thể loại phim.',
                    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                });
                setLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);

    // Lấy dữ liệu phim để chỉnh sửa nếu có id
    useEffect(() => {
        if (id) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/editMovie/${id}`);
                    const movieData = response.data.movie;
                    form.setFieldsValue({
                        ten_phim: movieData.ten_phim,
                        anh_phim: movieData.anh_phim
                            ? [
                                  {
                                      uid: '-1',
                                      name: movieData.anh_phim.split('/').pop(),
                                      status: 'done',
                                      url: `http://127.0.0.1:8000${movieData.anh_phim}`,
                                  },
                              ]
                            : [],
                        dao_dien: movieData.dao_dien,
                        dien_vien: movieData.dien_vien,
                        noi_dung: movieData.noi_dung,
                        trailer: movieData.trailer,
                        gia_ve: movieData.gia_ve,
                        thoi_gian_phim: movieData.thoi_gian_phim,
                        quoc_gia: movieData.quoc_gia,
                        hinh_thuc_phim: movieData.hinh_thuc_phim,
                        loaiphim_ids: movieData.movie_genres.map((genre) => genre.id) || [],
                    });
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Lỗi khi tải dữ liệu phim.',
                        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                    });
                }
            };

            fetchMovie();
        }
    }, [id, form]);

    // Hàm xử lý khi gửi form
    const onFinish = async (values) => {
        const formData = new FormData();

        // Xử lý thể loại phim
        const movieGenres = Array.isArray(values.loaiphim_ids) ? values.loaiphim_ids : [];
        movieGenres.forEach((genreId) => {
            formData.append('loaiphim_ids[]', genreId);
        });

        // Xử lý các trường khác
        Object.keys(values).forEach((key) => {
            if (key !== 'loaiphim_ids') {
                if (key === 'anh_phim') {
                    const file = values[key]?.[0]?.originFileObj;
                    if (file) {
                        // Nếu có tệp ảnh mới, thêm tệp đó vào formData
                        formData.append(key, file);
                    } else if (id) {
                        // Không thêm anh_phim nếu đang chỉnh sửa và không thay đổi ảnh
                        // Do đó, không làm gì ở đây
                    }
                } else {
                    formData.append(key, values[key]);
                }
            }
        });

        setLoadingSubmit(true); // Bật trạng thái gửi form

        try {
            if (id) {
                // Gửi yêu cầu cập nhật phim
                await axios.post(`http://127.0.0.1:8000/api/updateMovie/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật phim thành công.',
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                });
            } else {
                // Gửi yêu cầu thêm mới phim
                await axios.post('http://127.0.0.1:8000/api/storeMovie', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm mới phim thành công.',
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                });
            }
            navigate(config.routes.admin.movies); // Điều hướng về trang quản lý phim
        } catch (error) {
            // Kiểm tra lỗi cụ thể từ backend
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
                notification.error({
                    message: 'Lỗi',
                    description: 'Vui lòng kiểm tra lại các trường đã nhập.',
                    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                });
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi lưu phim.',
                    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
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
                padding: '30px',
                maxWidth: '1400px',
                margin: 'auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
                    >
                        Quay lại
                    </Button>
                </Col>
                <Col>
                    <Title level={2} style={{ color: '#333', margin: 0 }}>
                        {id ? 'Cập nhật thông tin phim' : 'Thêm phim mới'}
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
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Tên Phim"
                            name="ten_phim"
                            rules={[{ required: true, message: 'Nhập tên phim!' }]}
                        >
                            <Input
                                placeholder="Nhập tên phim"
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
                            label="Ảnh Phim"
                            name="anh_phim"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e?.fileList}
                            rules={[
                                {
                                    required: !id, // Bắt buộc khi thêm mới
                                    message: 'Chọn ảnh phim!',
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
                            label="Đạo Diễn"
                            name="dao_dien"
                            rules={[{ required: true, message: 'Nhập tên đạo diễn!' }]}
                        >
                            <Input
                                placeholder="Nhập tên đạo diễn"
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
                            label="Diễn Viên"
                            name="dien_vien"
                            rules={[{ required: true, message: 'Nhập tên diễn viên!' }]}
                        >
                            <Input
                                placeholder="Nhập tên diễn viên"
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
                            label="Quốc Gia"
                            name="quoc_gia"
                            rules={[{ required: true, message: 'Nhập quốc gia!' }]}
                        >
                            <Input
                                placeholder="Nhập quốc gia"
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
                            label="Nội Dung"
                            name="noi_dung"
                            rules={[{ required: true, message: 'Nhập nội dung phim!' }]}
                        >
                            <Input.TextArea
                                placeholder="Nhập nội dung phim"
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
                            label="Trailer"
                            name="trailer"
                            rules={[{ required: true, message: 'Nhập đường dẫn trailer!' }]}
                        >
                            <Input
                                placeholder="Nhập đường dẫn trailer"
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
                            label="Giá Vé"
                            name="gia_ve"
                            rules={[{ required: true, message: 'Nhập giá vé!' }]}
                        >
                            <Input
                                type="number"
                                placeholder="Nhập giá vé"
                                style={{
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '14px',
                                    border: '1px solid #d9d9d9',
                                }}
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Hình Thức Phim"
                            name="hinh_thuc_phim"
                            rules={[{ required: true, message: 'Chọn hình thức phim!' }]}
                        >
                            <Select
                                placeholder="Chọn hình thức chiếu"
                                style={{
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    border: '1px solid #d9d9d9',
                                }}
                                options={[
                                    { label: 'Đang Chiếu', value: '0' },
                                    { label: 'Sắp Công Chiếu', value: '1' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Thể Loại Phim"
                            name="loaiphim_ids"
                            rules={[{ required: true, message: 'Chọn thể loại phim!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn thể loại phim"
                                loading={loadingGenres}
                                style={{
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    border: '1px solid #d9d9d9',
                                }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {genres.map((genre) => (
                                    <Option key={genre.id} value={genre.id}>
                                        {genre.ten_loai_phim}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Thời Gian Phim"
                            name="thoi_gian_phim"
                            rules={[{ required: true, message: 'Nhập thời gian phim!' }]}
                        >
                            <Input
                                type="number"
                                placeholder="Nhập thời gian phim (phút)"
                                style={{
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '14px',
                                    border: '1px solid #d9d9d9',
                                }}
                                min={0}
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
                            backgroundColor: '#145da0',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '10px 30px',
                            fontSize: '16px',
                            marginRight: '15px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        loading={loadingSubmit} // Hiển thị trạng thái tải khi gửi form
                    >
                        {id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                    <Button
                        type="default"
                        onClick={() => navigate('/admin/movies')}
                        style={{
                            backgroundColor: '#f0f0f0',
                            color: '#333',
                            borderRadius: '8px',
                            padding: '10px 30px',
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default MovieFormPage;
