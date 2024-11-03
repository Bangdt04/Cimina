import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetMovie, useUpdateMovie } from '../../../hooks/api/useMovieApi';
import { Button, Input, notification } from 'antd';
import './movie.scss'; // Import the styles

const MovieEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading } = useGetMovie(id);
    const [formData, setFormData] = useState({
        ten_phim: '',
        dao_dien: '',
        dien_vien: '',
        gia_ve: '',
        danh_gia: '',
    });

    const mutationUpdate = useUpdateMovie(id);

    useEffect(() => {
        if (response && response.data) {
            const movieData = response.data;
            setFormData({
                ten_phim: movieData.ten_phim,
                dao_dien: movieData.dao_dien,
                dien_vien: movieData.dien_vien,
                gia_ve: movieData.gia_ve,
                danh_gia: movieData.danh_gia,
            });
        }
    }, [response]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await mutationUpdate.mutateAsync(formData);
            notification.success({
                message: 'Cập nhật phim thành công',
            });
            navigate('/admin/movies');
        } catch (error) {
            notification.error({
                message: 'Cập nhật phim thất bại',
            });
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="movie-edit max-w-full mx-auto p-4 bg-gray-800 text-white rounded-lg">
            <h2 className="text-center text-xl mb-4">Chỉnh sửa phim</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Tên phim:</label>
                    <Input
                        name="ten_phim"
                        value={formData.ten_phim}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Đạo diễn:</label>
                    <Input
                        name="dao_dien"
                        value={formData.dao_dien}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Diễn viên:</label>
                    <Input
                        name="dien_vien"
                        value={formData.dien_vien}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Giá vé:</label>
                    <Input
                        name="gia_ve"
                        value={formData.gia_ve}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Đánh giá:</label>
                    <Input
                        name="danh_gia"
                        value={formData.danh_gia}
                        onChange={handleChange}
                    />
                </div>
                <Button type="primary" htmlType="submit" className="w-full">Cập nhật</Button>
            </form>
        </div>
    );
};

export default MovieEdit;