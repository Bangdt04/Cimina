import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetMovies, useUpdateMovie } from '../../../hooks/api/useMovieApi';
import { Button, Input, notification } from 'antd';

const MovieEdit = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const { data: movieData, isLoading } = useGetMovies(id); // Lấy thông tin phim
    const [formData, setFormData] = useState({
        ten_phim: '',
        dao_dien: '',
        dien_vien: '',
        gia_ve: '',
        danh_gia: '',
    });

    const mutationUpdate = useUpdateMovie({
        success: () => {
            notification.success({
                message: 'Cập nhật phim thành công',
            });
            navigate('/admin/movies'); // Quay lại danh sách phim
        },
        error: (err) => {
            notification.error({
                message: 'Cập nhật phim thất bại',
            });
        },
    });

    useEffect(() => {
        if (movieData) {
            setFormData({
                ten_phim: movieData.ten_phim,
                dao_dien: movieData.dao_dien,
                dien_vien: movieData.dien_vien,
                gia_ve: movieData.gia_ve,
                danh_gia: movieData.danh_gia,
            });
        }
    }, [movieData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutationUpdate.mutate({ id, ...formData }); // Gửi yêu cầu cập nhật
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Chỉnh sửa phim</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên phim:</label>
                    <Input
                        name="ten_phim"
                        value={formData.ten_phim}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Đạo diễn:</label>
                    <Input
                        name="dao_dien"
                        value={formData.dao_dien}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Diễn viên:</label>
                    <Input
                        name="dien_vien"
                        value={formData.dien_vien}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Giá vé:</label>
                    <Input
                        name="gia_ve"
                        value={formData.gia_ve}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Đánh giá:</label>
                    <Input
                        name="danh_gia"
                        value={formData.danh_gia}
                        onChange={handleChange}
                    />
                </div>
                <Button type="primary" htmlType="submit">Cập nhật</Button>
            </form>
        </div>
    );
};

export default MovieEdit;