import { Button, Col, Form, Input, Row, notification, Typography, Select, Upload, Breadcrumb, Spin, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function MovieFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/addMovie');
                setGenres(response.data.data);
                setLoadingGenres(false);
            } catch (error) {
                notification.error({ message: 'Lỗi khi tải thể loại phim' });
                setLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/editMovie/${id}`);
                    const movieData = response.data.movie;
                    form.setFieldsValue({
                        ten_phim: movieData.ten_phim,
                        anh_phim: movieData.anh_phim,
                        dao_dien: movieData.dao_dien,
                        dien_vien: movieData.dien_vien,
                        noi_dung: movieData.noi_dung,
                        trailer: movieData.trailer,
                        gia_ve: movieData.gia_ve,
                        thoi_gian_phim: movieData.thoi_gian_phim,
                        hinh_thuc_phim: movieData.hinh_thuc_phim,
                        loaiphim_ids: movieData.movie_genres.map(genre => genre.id) || [],
                    });
                } catch (error) {
                    notification.error({ message: 'Lỗi khi tải dữ liệu phim' });
                }
            };

            fetchMovie();
        }
    }, [id, form]);

    const onFinish = async (values) => {
        setIsLoading(true);

        const formData = new FormData();
        
        const movieGenres = Array.isArray(values.loaiphim_ids) ? values.loaiphim_ids : [];
    
        movieGenres.forEach((genreId) => {
            formData.append('loaiphim_ids[]', genreId);
        });

        Object.keys(values).forEach((key) => {
            if (key !== 'loaiphim_ids') {
                if (key === 'anh_phim') {
                    if (values[key] && values[key][0]?.originFileObj) {
                        formData.append(key, values[key][0].originFileObj);
                    } else if (id && Array.isArray(values[key]) && values[key][0]?.url) {
                        formData.append(key, values[key][0].url.replace('http://127.0.0.1:8000', ''));
                    }
                } else {
                    formData.append(key, values[key]);
                }
            }
        });

        try {
            if (id) {
                await axios.post(`http://127.0.0.1:8000/api/updateMovie/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({ message: 'Cập nhật phim thành công', duration: 2 });
            } else {
                await axios.post('http://127.0.0.1:8000/api/storeMovie', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({ message: 'Thêm mới phim thành công', duration: 2 });
            }
            navigate(config.routes.admin.movies);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi lưu phim', duration: 2 });
        } finally {
            setIsLoading(false);
        }
    };

    const onCancel = () => {
        navigate(-1); // Quay lại trang trước
    };

    return (
        <div className="form-container" style={{
            padding: '40px', 
            maxWidth: '1800px', 
            margin: 'auto', 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        }}>
            {/* Breadcrumbs for navigation */}
            <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                <Breadcrumb.Item>Movies</Breadcrumb.Item>
                <Breadcrumb.Item>{id ? 'Cập nhật phim' : 'Thêm phim mới'}</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2} style={{
                textAlign: 'center',
                marginBottom: '40px',
                fontWeight: 700,
                fontSize: '32px',
                color: '#1890ff',
                textTransform: 'uppercase',
                letterSpacing: '2px'
            }}>
                {id ? 'Cập nhật thông tin phim' : 'Thêm phim mới'}
            </Title>

            {isLoading && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Spin size="large" />
                </div>
            )}

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Row gutter={[16, 24]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Tên Phim" name="ten_phim" rules={[{ required: true, message: 'Nhập tên phim!' }]} style={{ fontWeight: 700 }}>
                                <Input placeholder="Nhập tên phim" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Ảnh Phim" name="anh_phim" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true, message: 'Chọn ảnh phim!' }]} style={{ fontWeight: 700 }}>
                                <Upload beforeUpload={() => false} listType="picture-card" accept=".jpg,.jpeg,.png,.gif" maxCount={1} showUploadList={{ showRemoveIcon: true }}>
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Đạo Diễn" name="dao_dien" rules={[{ required: true, message: 'Nhập tên đạo diễn!' }]} style={{ fontWeight: 700 }}>
                                <Input placeholder="Nhập tên đạo diễn" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Diễn Viên" name="dien_vien" rules={[{ required: true, message: 'Nhập tên diễn viên!' }]} style={{ fontWeight: 700 }}>
                                <Input placeholder="Nhập tên diễn viên" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Nội Dung" name="noi_dung" rules={[{ required: true, message: 'Nhập nội dung phim!' }]} style={{ fontWeight: 700 }}>
                                <Input.TextArea placeholder="Nhập nội dung phim" rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Trailer" name="trailer" rules={[{ required: true, message: 'Nhập đường dẫn trailer!' }]} style={{ fontWeight: 700 }}>
                                <Input placeholder="Nhập đường dẫn trailer" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Giá Vé" name="gia_ve" rules={[{ required: true, message: 'Nhập giá vé!' }]} style={{ fontWeight: 700 }}>
                                <Input type="number" placeholder="Nhập giá vé" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Hình Thức Phim" name="hinh_thuc_phim" rules={[{ required: true, message: 'Chọn hình thức phim!' }]} style={{ fontWeight: 700 }}>
                                <Select placeholder="Chọn hình thức phim">
                                    <Option value="Đang Chiếu">Đang Chiếu</Option>
                                    <Option value="Sắp Công Chiếu">Sắp Công Chiếu</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Thể Loại Phim" name="loaiphim_ids" rules={[{ required: true, message: 'Chọn thể loại phim!' }]} style={{ fontWeight: 700 }}>
                                <Select mode="multiple" placeholder="Chọn thể loại phim">
                                    {genres.map(genre => (
                                        <Option key={genre.id} value={genre.id}>{genre.ten_loaiphim}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <div style={{ textAlign: 'center' }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        style={{ 
                            backgroundColor: '#1890ff', 
                            borderColor: '#1890ff', 
                            color: '#fff', 
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        {isLoading ? <Spin /> : 'Lưu Thông Tin'}
                    </Button>
                    <Button 
                        type="default" 
                        onClick={onCancel} 
                        style={{ marginLeft: '20px', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold'}}
                    >
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default MovieFormPage;
