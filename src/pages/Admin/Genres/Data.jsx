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
                            className="text-green-500 border border-green-500"
                            onClick={() =>
                                navigate(`${config.routes.admin.genres}/update/${item.id}`)
                            }
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            className="text-red-500 border border-red-500"
                            onClick={() => setIsDisableOpen({ id: item.id, isOpen: true })}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Tooltip>
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
            });
            refetch();
        },
        error: () => {
            notification.error({
                message: 'Xóa thể loại thất bại',
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
        <div>
            <div className="p-4 bg-white mb-3 flex items-center rounded-lg">
                <Input.Search
                    className="xl:w-1/4 md:w-1/2"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
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
