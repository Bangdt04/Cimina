import React from 'react';
import { Modal } from 'antd';

const MovieDetail = ({ visible, onClose, movie }) => {
    return (
        <Modal
            title="Movie Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <div>
                <h3>{movie.ten_phim}</h3>
                <p><strong>Đạo diễn:</strong> {movie.dao_dien}</p>
                <p><strong>Diễn viên:</strong> {movie.dien_vien}</p>
                <p><strong>Giá vé:</strong> {movie.gia_ve}</p>
                <p><strong>Đánh giá:</strong> {movie.danh_gia}</p>
            </div>
        </Modal>
    );
}

export default MovieDetail;