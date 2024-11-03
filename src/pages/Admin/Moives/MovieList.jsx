import { Tag, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteMovie, useGetMovies } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { Button, Input, Table, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import MovieDetail from './MovieDetail';

const baseColumns = [
    {
        title: 'Id',
        dataIndex: 'id',
        sorter: true,
        width: 50,
    },
    {
        title: 'Tên phim',
        dataIndex: 'ten_phim',
        render: (text) => <div style={{ fontWeight: 'bold' }}>{text}</div>,
    },
    {
        title: 'Ảnh phim',
        dataIndex: 'anh_phim',
        render: (text) => <img src={text} alt="Movie" style={{ width: 50, height: 75 }} />,
    },
    {
        title: 'Đạo diễn',
        dataIndex: 'dao_dien',
    },
    {
        title: 'Diễn viên',
        dataIndex: 'dien_vien',
    },
    {
        title: 'Nội dung',
        dataIndex: 'noi_dung',
        render: (text) => <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>,
    },
    {
        title: 'Trailer',
        dataIndex: 'trailer',
        render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Xem Trailer</a>,
    },
    {
        title: 'Giá vé',
        dataIndex: 'gia_ve',
    },
    {
        title: 'Đánh giá',
        dataIndex: 'danh_gia',
    },
    {
        title: 'Thể loại phim',
        dataIndex: 'movie_genres',
        render: (genres) => genres.map(genre => <Tag key={genre.id}>{genre.ten_loai_phim}</Tag>),
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
];

function transformData(dt, navigate, setIsDisableOpen, setSelectedMovie, setIsModalVisible) {
    let id = 1;
    return dt?.map((item) => {
        id++;
        return {
            key: id - 1,
            id: item.id,
            ten_phim: item.ten_phim,
            anh_phim: item.anh_phim,
            dao_dien: item.dao_dien,
            dien_vien: item.dien_vien,
            noi_dung: item.noi_dung,
            trailer: item.trailer,
            gia_ve: item.gia_ve,
            danh_gia: item.danh_gia,
            movie_genres: item.movie_genres,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-blue-500 border border-blue-500"
                        onClick={() => {
                            setSelectedMovie(item);
                            setIsModalVisible(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button
                        className="text-green-500 border border-green-500"
                        onClick={() => navigate(`/admin/movies/update/${item.id}`)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                        className={'text-red-500 border border-red-500'}
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            ),
        };
    });
}

function MovieList() {
    const [isDisableOpen, setIsDisableOpen] = useState({
        id: 0,
        isOpen: false,
    });
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetMovies();
    const [tdata, setTData] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: data?.totalElements,
        },
    });

    useEffect(() => {
        if (isLoading || !data) return;
        let dt = transformData(data?.data, navigate, setIsDisableOpen, setSelectedMovie, setIsModalVisible);
        setTData(dt);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: data?.totalElements,
            },
        });
    }, [isLoading, data]);

    const mutationDelete = useDeleteMovie({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({
                message: 'Xóa phim thành công',
            });
            refetch();
        },
        error: (err) => {
            notification.error({
                message: 'Xóa phim thất bại',
            });
        },
        obj: {
            id: isDisableOpen.id,
        },
    });

    const onDelete = async () => {
        try {
            const response = await mutationDelete.mutateAsync(isDisableOpen.id);
            console.log("Response from delete API:", response);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const onSearch = (value) => {
        const filteredData = data?.data.filter((item) =>
            item.ten_phim.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, navigate, setIsDisableOpen, setSelectedMovie, setIsModalVisible));
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <div className="p-4 bg-white mb-3 flex items-center rounded-lg">
                <Input.Search
                    className="xl:w-1/4 md:w-1/2"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
                    onSearch={onSearch}
                />
            </div>

            <Table
                loading={isLoading}
                columns={baseColumns}
                dataSource={tdata}
                pagination={{ ...tableParams.pagination, showSizeChanger: true }}
                rowKey="key"
            />

            {isDisableOpen.isOpen && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa phim này ?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}

            <MovieDetail 
                visible={isModalVisible} 
                onClose={handleCancel} 
                movie={selectedMovie} 
            />
        </div>
    );
}

export default MovieList;