import { Modal, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';

function MovieDetail({ isDetailOpen, setIsDetailOpen }) {
    const [movieData, setMovieData] = useState({});

    useEffect(() => {
        if (isDetailOpen.isOpen) {
            // Fetch movie data based on isDetailOpen.id
            // For now, we'll use dummy data
            setMovieData({
                id: '1',
                title: 'Avengers: Endgame',
                genre: 'Hành động, Khoa học viễn tưởng',
                releaseYear: 2019,
                director: 'Anthony Russo, Joe Russo',
                cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
                duration: '181 phút',
                description: 'Avengers: Endgame là bộ phim siêu anh hùng Mỹ...',
                poster: 'https://example.com/movie1.jpg',
                status: 'Đã chiếu',
            });
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
        <Modal
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