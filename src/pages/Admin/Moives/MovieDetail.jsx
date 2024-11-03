import React from 'react';
import { Modal, Typography, Row, Col } from 'antd';
import './movie.scss'; // Import the styles

const { Title, Text } = Typography;

const MovieDetail = ({ visible, onClose, movie }) => {
    return (
        <Modal
            title="Chi tiết phim"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="movie-detail max-w-full mx-auto p-4 bg-gray-800 text-white rounded-lg"
        >
            {movie && (
                <div>
                    <Row gutter={16}>
                        <Col span={8}>
                            <img 
                                src={movie.anh_phim} 
                                alt="Movie" 
                                className="w-full rounded-lg" 
                            />
                        </Col>
                        <Col span={16}>
                            <Title level={4}>{movie.ten_phim}</Title>
                            <Text strong>Đạo diễn:</Text> <Text>{movie.dao_dien}</Text>
                            <br />
                            <Text strong>Diễn viên:</Text> <Text>{movie.dien_vien}</Text>
                            <br />
                            <Text strong>Giá vé:</Text> <Text>{movie.gia_ve}</Text>
                            <br />
                            <Text strong>Đánh giá:</Text> <Text>{movie.danh_gia}</Text>
                            <br />
                            <Text strong>Nội dung:</Text>
                            <p>{movie.noi_dung}</p>
                            <Text strong>Trailer:</Text> <a href={movie.trailer} target="_blank" rel="noopener noreferrer">Xem Trailer</a>
                            <br />
                            <Text strong>Thể loại phim:</Text> 
                            <Text>{movie.movie_genres.map(genre => genre.ten_loai_phim).join(', ')}</Text>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
}

export default MovieDetail;