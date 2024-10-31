import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteMovie, useGetMovies } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { Button, Input, Table, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons'; // Import the eye icon

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
        title: 'Giá vé',
        dataIndex: 'gia_ve',
    },
    {
        title: 'Đánh giá',
        dataIndex: 'danh_gia',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

function transformData(dt, navigate, setIsDisableOpen) {
    let id = 1; // Initialize the id variable
    return dt?.map((item) => {
        id++;
        return {
            key: id - 1, // Use the current id as the key
            id: item.id, // Use the actual id from the item
            ten_phim: item.ten_phim,
            dao_dien: item.dao_dien,
            dien_vien: item.dien_vien,
            gia_ve: item.gia_ve,
            danh_gia: item.danh_gia,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-blue-500 border border-blue-500" // Change color for view button
                        onClick={() => navigate(`/admin/movies/detail/${item.id}`)} // Navigate to MovieDetail
                    >
                        <FontAwesomeIcon icon={faEye} /> {/* Eye icon for viewing details */}
                    </Button>
                    <Button
                        className="text-green-500 border border-green-500"
                        onClick={() =>
                            navigate(`/admin/movies/update/${item.id}`)
                        }
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
        let dt = transformData(data?.data, navigate, setIsDisableOpen);
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
                message: 'Thành công',
            });
            refetch();
        },
        error: (err) => {
            notification.error({
                message: 'Thất bại',
            });
        },
        obj: {
            id: isDisableOpen.id,
        },
    });

    const onDelete = async (id) => {
        await mutationDelete.mutateAsync(id);
    };

    const onSearch = (value) => {
        const filteredData = data?.data.filter((item) =>
            item.ten_phim.toLowerCase().includes(value.toLowerCase())
        );
        setTData(transformData(filteredData, navigate, setIsDisableOpen));
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
            />

            {isDisableOpen.id !== 0 && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa phim này ?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}
        </div>
    );
}

export default MovieList;