import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteMovie, useGetMovies } from '../../../hooks/api/useMovieApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import { Button, Input, Table, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
        title: 'Ngày tạo',
        dataIndex: 'created_at',
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updated_at',
    },
    {
        title: 'Ngày xóa',
        dataIndex: 'deleted_at',
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
            ten_phim: item.ten_phim,
            anh_phim: item.anh_phim,
            dao_dien: item.dao_dien,
            dien_vien: item.dien_vien,
            noi_dung: item.noi_dung,
            trailer: item.trailer,
            gia_ve: item.gia_ve,
            danh_gia: item.danh_gia,
            created_at: item.created_at,
            updated_at: item.updated_at,
            deleted_at: item.deleted_at,
            action: (
                <div className="action-btn flex gap-3">
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

export default MovieData;