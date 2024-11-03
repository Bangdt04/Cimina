import { Button, Input, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { useDeleteSeat, useGetSeats } from '../../../hooks/api/useSeatApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

const baseColumns = [
    {
        title: 'Id',
        dataIndex: 'id',
        sorter: true,
        width: 50,
    },
    {
        title: 'Số ghế ngồi',
        dataIndex: 'so_ghe_ngoi',
    },
    {
        title: 'Loại ghế ngồi',
        dataIndex: 'loai_ghe_ngoi',
    },
    {
        title: 'Giá ghế',
        dataIndex: 'gia_ghe',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

function transformData(dt, navigate, setIsDisableOpen) {
    return dt?.map((item) => {
        return {
            key: item.id,
            id: item.id,
            so_ghe_ngoi: item.so_ghe_ngoi,
            loai_ghe_ngoi: item.loai_ghe_ngoi,
            gia_ghe: item.gia_ghe,
            action: (
                <div className="action-btn flex gap-3">
                    <Button
                        className="text-green-500 border border-green-500"
                        onClick={() => navigate(`${config.routes.admin.seat}/update/${item.id}`)}
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

function SeatData({ setParams, params }) {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetSeats();
    const [tdata, setTData] = useState([]);

    useEffect(() => {
        if (isLoading || !data) return;
        let dt = transformData(data?.data, navigate, setIsDisableOpen);
        setTData(dt);
    }, [isLoading, data]);

    const mutationDelete = useDeleteSeat({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({ message: 'Xóa thành công' });
            refetch();
        },
        error: () => {
            notification.error({ message: 'Xóa thất bại' });
        },
        obj: { id: isDisableOpen.id },
    });

    const onDelete = async (id) => {
        await mutationDelete.mutateAsync(id);
    };

    return (
        <div>
            <div className="p-4 bg-white mb-3 flex items-center rounded-lg">
                <Input.Search
                    className="xl:w-1/4 md:w-1/2"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
                />
            </div>
            <Table
                loading={isLoading}
                columns={baseColumns}
                dataSource={tdata}
                pagination={{ showSizeChanger: true }}
            />
            {isDisableOpen.id !== 0 && (
                <ConfirmPrompt
                    content="Bạn có muốn xóa ghế này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}
        </div>
    );
}

export default SeatData;