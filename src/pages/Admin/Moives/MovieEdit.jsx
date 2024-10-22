import { Button, Modal, Form, Input, Select, DatePicker, Typography } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { generateMovieData } from './MovieData';

const { Title } = Typography;

function MovieEdit({ isEditOpen, setIsEditOpen }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditOpen.isOpen) {
            const allMovies = generateMovieData();
            const selectedMovie = allMovies.find(movie => movie.id === isEditOpen.id);
            if (selectedMovie) {
                form.setFieldsValue({
                    ...selectedMovie,
                    releaseYear: moment(selectedMovie.releaseYear.toString()),
                });
            }
        }
    }, [isEditOpen, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            console.log('Updated values:', values);
            // Here you would typically send the updated data to your backend
            setIsEditOpen({ id: 0, isOpen: false });
        });
    };

    const handleCancel = () => {
        setIsEditOpen({ id: 0, isOpen: false });
    };

    return (
        <Modal
            title={<Title level={4} className="text-black">Chỉnh sửa phim</Title>}
            open={isEditOpen.isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            className="movie-edit-modal bg-white"
        >
            <Form form={form} layout="vertical" className="movie-edit-form">
                <Form.Item name="id" label="ID" hidden>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="title" label="Tên phim" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="releaseYear" label="Ngày phát hành" rules={[{ required: true }]}>
                    <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item name="director" label="Đạo diễn">
                    <Input />
                </Form.Item>
                <Form.Item name="cast" label="Diễn viên">
                    <Input />
                </Form.Item>
                <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Select.Option value="Đang chiếu">Đang chiếu</Select.Option>
                        <Select.Option value="Sắp chiếu">Sắp chiếu</Select.Option>
                        <Select.Option value="Đã chiếu">Đã chiếu</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default MovieEdit;