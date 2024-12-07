import { Button, Col, Form, Input, Row, notification, Typography, Select, Upload } from 'antd';
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
    const [genres, setGenres] = useState([]); // State to store genres
    const [loadingGenres, setLoadingGenres] = useState(true); // Loading state for genres
    
    // Fetch movie genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/addMovie');
                setGenres(response.data.data); // Update genres data
                setLoadingGenres(false); // Set loading to false after fetching genres
            } catch (error) {
                notification.error({ message: 'Lỗi khi tải thể loại phim' });
                setLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);

    // Fetch movie data for editing
    useEffect(() => {
        if (id) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/editMovie/${id}`);
                    const movieData = response.data.movie;
                    form.setFieldsValue({
                        ten_phim: movieData.ten_phim,
                        anh_phim: [
                            {
                                uid: '-1',
                                name: movieData.anh_phim.split('/').pop(),
                                status: 'done',
                                url: `http://127.0.0.1:8000${movieData.anh_phim}`,
                            },
                        ],
                        dao_dien: movieData.dao_dien,
                        dien_vien: movieData.dien_vien,
                        noi_dung: movieData.noi_dung,
                        trailer: movieData.trailer,
                        gia_ve: movieData.gia_ve,
                        thoi_gian_phim: movieData.thoi_gian_phim,
                        hinh_thuc_phim: movieData.hinh_thuc_phim, 
                        loaiphim_ids: movieData.movie_genres.map(genre => genre.id) || [], // Ensure this captures the genre IDs
                    });
                } catch (error) {
                    notification.error({ message: 'Lỗi khi tải dữ liệu phim' });
                }
            };

            fetchMovie();
        }
    }, [id, form]);

    const onFinish = async (values) => {
        const formData = new FormData();
        
        // Log the value of loaiphim_ids
        console.log('loaiphim_ids:', values.loaiphim_ids); // Log the value of loaiphim_ids

        // Kiểm tra nếu loaiphim_ids là mảng và nếu không, khởi tạo nó là mảng rỗng
        const movieGenres = Array.isArray(values.loaiphim_ids) ? values.loaiphim_ids : [];
    
        // Duyệt qua các thể loại phim và thêm vào formData
        movieGenres.forEach((genreId) => {
            formData.append('loaiphim_ids[]', genreId); // Append each genre ID as an array
        });
    
        // Duyệt qua các trường còn lại và thêm vào formData
        Object.keys(values).forEach((key) => {
            if (key !== 'loaiphim_ids') { // Tránh lặp lại loaiphim_ids đã xử lý
                if (key === 'anh_phim') {
                    if (values[key] && values[key][0]?.originFileObj) {
                        // Case for new uploaded image
                        formData.append(key, values[key][0].originFileObj);
                    } else if (id && Array.isArray(values[key]) && values[key][0]?.url) {
                        // Case for existing image
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
                notification.success({ message: 'Cập nhật phim thành công' });
            } else {
                await axios.post('http://127.0.0.1:8000/api/storeMovie', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notification.success({ message: 'Thêm mới phim thành công' });
            }
            navigate(config.routes.admin.movies);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi lưu phim' });
        }
    };

    return (
        <div className="form-container" style={{ padding: '30px', maxWidth: '1400px', margin: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', fontFamily: 'Arial, sans-serif' }}>
            <Title level={2} style={{ textAlign: 'center', color: '#333' }}>
                {id ? 'Cập nhật thông tin phim' : 'Thêm phim mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Tên Phim" name="ten_phim" rules={[{ required: true, message: 'Nhập tên phim!' }]}>
                            <Input placeholder="Nhập tên phim" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Ảnh Phim" name="anh_phim" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true, message: 'Chọn ảnh phim!' }]}>
                            <Upload beforeUpload={() => false} listType="picture-card" accept=".jpg,.jpeg,.png,.gif" maxCount={1} showUploadList={{ showRemoveIcon: true }}>
                                <Button icon={<UploadOutlined />} style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Đạo Diễn" name="dao_dien" rules={[{ required: true, message: 'Nhập tên đạo diễn!' }]}>
                            <Input placeholder="Nhập tên đạo diễn" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Diễn Viên" name="dien_vien" rules={[{ required: true, message: 'Nhập tên diễn viên!' }]}>
                            <Input placeholder="Nhập tên diễn viên" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Nội Dung" name="noi_dung" rules={[{ required: true, message: 'Nhập nội dung phim!' }]}>
                            <Input.TextArea placeholder="Nhập nội dung phim" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Trailer" name="trailer" rules={[{ required: true, message: 'Nhập đường dẫn trailer!' }]}>
                            <Input placeholder="Nhập đường dẫn trailer" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giá Vé" name="gia_ve" rules={[{ required: true, message: 'Nhập giá vé!' }]}>
                            <Input type="number" placeholder="Nhập giá vé" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Hình Thức Phim" name="hinh_thuc_phim" rules={[{ required: true, message: 'Chọn hình thức phim!' }]}>
                            <Select placeholder="Chọn hình thức chiếu" style={{ borderRadius: '8px', fontSize: '14px' }}>
                                <Option value="Đang chiếu">Đang chiếu</Option>
                                <Option value="Sắp Công Chiếu">Sắp công chiếu</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Thể Loại Phim" name="loaiphim_ids" rules={[{ required: true, message: 'Chọn thể loại phim!' }]}>
                        <Select mode="multiple" placeholder="Chọn thể loại phim" loading={loadingGenres} style={{ borderRadius: '8px', fontSize: '14px' }}>
                            {genres.map((genre) => (
                                <Option key={genre.id} value={genre.id}>{genre.ten_loai_phim}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Thời Gian Phim" name="thoi_gian_phim" rules={[{ required: true, message: 'Nhập thời gian phim!' }]}>
                    <Input type="number" placeholder="Nhập thời gian phim (phút)" style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
                        loading={false} // Set to true if the form is being submitted
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
