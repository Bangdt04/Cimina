import { faEdit, faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Table } from 'antd';
import { useState } from 'react';
import MovieDetail from './MovieDetail';
import MovieEdit from './MovieEdit';
import MovieActions from './MovieActions';
import { baseColumns, generateMovieData } from './MovieData';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';

function MovieList() {
    const [isDetailOpen, setIsDetailOpen] = useState({ id: 0, isOpen: false });
    const [isEditOpen, setIsEditOpen] = useState({ id: 0, isOpen: false });
    const [isDeleteOpen, setIsDeleteOpen] = useState({ id: 0, isOpen: false });
    const [rawData, setRawData] = useState(generateMovieData());
    const [data, setData] = useState(rawData);

    const onSearch = (value) => {
        const filterTable = rawData.filter((o) =>
            Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase())),
        );
        setData(filterTable);
    };

    const columns = [
        ...baseColumns,
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <MovieActions
                    record={record}
                    setIsDetailOpen={setIsDetailOpen}
                    setIsEditOpen={setIsEditOpen}
                    setIsDeleteOpen={setIsDeleteOpen}
                />
            ),
        },
    ];

    return (
        <div className="movie-container bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-6">
                <Input.Search
                    className="w-full md:w-1/2 lg:w-1/3"
                    allowClear
                    enterButton
                    placeholder="Nhập từ khoá tìm kiếm"
                    onSearch={onSearch}
                />
                <Button type="primary" icon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới
                </Button>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden flex-grow">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        className: 'bg-gray-800 text-gray-200',
                    }}
                    className="custom-table"
                    scroll={{ y: 'calc(100vh - 300px)' }}
                />
            </div>
            <MovieDetail isDetailOpen={isDetailOpen} setIsDetailOpen={setIsDetailOpen} />
            <MovieEdit isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
            <ConfirmPrompt
                content="Bạn có chắc chắn muốn xóa bộ phim này?"
                isDisableOpen={isDeleteOpen}
                setIsDisableOpen={setIsDeleteOpen}
            />
        </div>
    );
}

export default MovieList;