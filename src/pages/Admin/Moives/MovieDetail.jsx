import { Modal, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { generateMovieData } from './MovieData';

function MovieDetail({ isDetailOpen, setIsDetailOpen }) {
    const [movieData, setMovieData] = useState({});

    useEffect(() => {
        if (isDetailOpen.isOpen) {
            const allMovies = generateMovieData();
            const selectedMovie = allMovies.find(movie => movie.id === isDetailOpen.id);
            setMovieData(selectedMovie || {});
        }
    }, [isDetailOpen]);

    const columns = [
        { title: 'Thuộc tính', dataIndex: 'property', key: 'property' },
        { title: 'Giá trị', dataIndex: 'value', key: 'value' },
    ];

    const data = Object.entries(movieData).map(([key, value], index) => ({
        key: index,
        property: key.charAt(0).toUpperCase() + key.slice(1),
        value: key === 'poster' ? <img src={value} alt="Movie Poster" className="w-32 h-48 rounded" /> :
               key === 'status' ? <Tag color={value === 'Đang chiếu' ? 'green' : value === 'Sắp chiếu' ? 'blue' : 'red'}>{value}</Tag> :
               value,
    }));

    return (
        <Modal className='movie-detail-modal bg-white'
            title="Chi tiết phim"
            open={isDetailOpen.isOpen}
            onCancel={() => setIsDetailOpen({ id: 0, isOpen: false })}
            footer={null}
            width={600}
        >
            <Table columns={columns} dataSource={data} pagination={false} />
        </Modal>
    );
}

export default MovieDetail;