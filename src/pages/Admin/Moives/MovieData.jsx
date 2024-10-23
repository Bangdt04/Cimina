import { Tag } from 'antd';

export const baseColumns = [
    {
        title: 'Poster',
        dataIndex: 'poster',
        key: 'poster',
        render: (poster) => <img src={poster} alt="Movie Poster" className="w-16 h-24 rounded" />,
    },
    {
        title: 'Tên phim',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
        title: 'Thể loại',
        dataIndex: 'genre',
        key: 'genre',
    },
    {
        title: 'Năm phát hành',
        dataIndex: 'releaseYear',
        key: 'releaseYear',
        sorter: (a, b) => a.releaseYear - b.releaseYear,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
            <Tag color={status === 'Đang chiếu' ? 'green' : status === 'Sắp chiếu' ? 'blue' : 'red'}>
                {status}
            </Tag>
        ),
    },
];

export function generateMovieData() {
    return [
        {
            id: '1',
            poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
            title: 'Avengers: Endgame',
            genre: 'Hành động, Khoa học viễn tưởng',
            releaseYear: 2019,
            status: 'Đã chiếu',
        },
        {
            id: '2',
            poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
            title: 'Parasite',
            genre: 'Hài kịch đen, Ly kỳ',
            releaseYear: 2019,
            status: 'Đang chiếu',
        },
        {
            id: '3',
            poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
            title: 'The Dark Knight',
            genre: 'Hành động, Tội phạm, Kịch tính',
            releaseYear: 2008,
            status: 'Đã chiếu',
        },
        {
            id: '4',
            poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
            title: 'The Matrix',
            genre: 'Hành động, Khoa học viễn tưởng',
            releaseYear: 1999,
            status: 'Đã chiếu',
        },
        {
            id: '5',
            poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
            title: 'Pulp Fiction',
            genre: 'Tội phạm, Kịch tính',
            releaseYear: 1994,
            status: 'Đã chiếu',
        },
        {
            id: '6',
            poster: "https://m.media-amazon.com/images/M/MV5BMTM0MDgwNjMyMl5BMl5BanBnXkFtZTcwNTg3NzAzMw@@._V1_SX300.jpg",
            title: 'Iron Man 2',
            genre: 'Hành động, Phiêu lưu, Khoa học viễn tưởng',
            releaseYear: 2010,
            status: 'Đã chiếu',
        },
        {
            id: '7',
            poster: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
            title: 'Batman Begins',
            genre: 'Hành động, Phiêu lưu',
            releaseYear: 2005,
            status: 'Đã chiếu',
        },
        {
            id: '8',
            poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
            title: 'The Dark Knight',
            genre: 'Hành động, Tội phạm, Kịch tính',
            releaseYear: 2008,
            status: 'Đã chiếu',
        },
        {
            id: '9',
            poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
            title: 'Fight Club',
            genre: 'Kịch tính',
            releaseYear: 1999,
            status: 'Đã chiếu',
        },
        {
            id: '10',
            poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
            title: 'Forrest Gump',
            genre: 'Kịch, Lãng mạn',
            releaseYear: 1994,
            status: 'Đã chiếu',
        },
    ];
}