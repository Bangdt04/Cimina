import { Button, Input, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { useDeleteMovie, useGetMovies } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

const baseColumns = [
    {
        title: 'Id',
        dataIndex: 'id',
        sorter: true,
        width: 50,
    },
    {
        title: 'Tên Phim',
        dataIndex: 'ten_phim',
    },
    {
        title: 'Đạo Diễn',
        dataIndex: 'dao_dien',
    },
    {
        title: 'Diễn Viên',
        dataIndex: 'dien_vien',
    },
    {
        title: 'Giá Vé',
        dataIndex: 'gia_ve',
    },
    {
        title: 'Thao Tác',
        dataIndex: 'action',
        render: (text) => <div style={{ display: 'flex', gap: '8px' }}>{text}</div>,
    },
];

function transformData(dt, navigate, setIsDisableOpen) {
    return dt?.map((item) => {
        return {
            key: item.id,
            id: item.id,
            ten_phim: item.ten_phim,
            dao_dien: item.dao_dien,
            dien_vien: item.dien_vien,
            gia_ve: item.gia_ve,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-green-500 border border-green-500"
                        onClick={() => navigate(`${config.routes.admin.movies}/update/${item.id}`)}
                    >
                        Sửa
                    </Button>
                    <Button
                        className={'text-red-500 border border-red-500'}
                        onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        };
    });
}

function MovieData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetMovies();
    const [tdata, setTData] = useState([]);

    useEffect(() => {
        if (isLoading || !data) return;
        const dt = transformData(data.data, navigate, setIsDisableOpen);
        setTData(dt);
    }, [isLoading, data]);

    const mutationDelete = useDeleteMovie({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({ message: 'Xóa phim thành công' });
            refetch();
        },
        error: () => {
            notification.error({ message: 'Xóa phim thất bại' });
        },
        obj: { id: isDisableOpen.id },
    });

    const onDelete = async () => {
        await mutationDelete.mutateAsync(isDisableOpen.id);
    };

    const onSearch = (value) => {
        const filteredData = data.data.filter((item) =>
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
        </div>
    );
}

export default MovieData;