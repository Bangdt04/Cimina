import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Table, Tooltip, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { useDeleteGerne, useGetGernes } from '../../../hooks/api/useGenreApi';

const baseColumns = [
    {
        title: 'Tên thể loại',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
    },
];

function transformData(dt, navigate, setIsDisableOpen) {
    let id = 1;
    return dt?.map((item) => {
        id++;
        return {
            key: id - 1,
            name: item.ten_loai_phim,
            action: (
                <div className="action-btn flex gap-3">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white"
                            onClick={() =>
                                navigate(`${config.routes.admin.genres}/update/${item.id}`)
                            }
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    </Tooltip>
                    {/* <Tooltip title="Xóa">
                        <Button
                            className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Tooltip> */}
                </div>
            ),
        };
    });
}

function Data({ setProductCategoryIds, params, setParams }) {
    const [isDisableOpen, setIsDisableOpen] = useState({
        id: 0,
        isOpen: false,
    });
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetGernes();
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

    const onSearch = (value) => {
        const dt = transformData(data?.data, navigate, setIsDisableOpen);
        if (!value) return;
        const filterTable = dt.filter((o) =>
            Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase())),
        );

        setTData(filterTable);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            ...tableParams,
            pagination,
            ...sorter,
        });
        setParams({
            ...params,
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const mutationDelete = useDeleteGerne({
        success: () => {
            setIsDisableOpen({ ...isDisableOpen, isOpen: false });
            notification.success({
                message: 'Xóa thể loại thành công',
                placement: 'topRight', // Hiển thị ở góc trên bên phải
            });
            refetch();
        },
        error: () => {
            notification.error({
                message: 'Xóa thể loại thất bại',
                placement: 'topRight', // Hiển thị ở góc trên bên phải
            });
        },
        obj: {
            id: isDisableOpen.id,
            params: params,
        },
    });
    

    const onDelete = async (id) => {
        await mutationDelete.mutateAsync(id);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <Input.Search
                    className="xl:w-1/4 md:w-1/2"
                    allowClear
                    enterButton
                    placeholder="Tìm kiếm thể loại..."
                    onSearch={onSearch}
                    style={{ borderRadius: '8px' }}
                />
            </div>

            <Table
                loading={isLoading}
                columns={baseColumns}
                dataSource={tdata}
                pagination={{ ...tableParams.pagination, showSizeChanger: true }}
                onChange={handleTableChange}
                rowClassName="table-row"
                scroll={{ x: 'max-content' }}
                bordered
            />

            {isDisableOpen.id !== 0 && (
                <ConfirmPrompt
                    content="Bạn có muốn ẩn thể loại này?"
                    isDisableOpen={isDisableOpen}
                    setIsDisableOpen={setIsDisableOpen}
                    handleConfirm={onDelete}
                />
            )}
        </div>
    );
}

export default Data;
