import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';

function MovieEdit({ isEditOpen, setIsEditOpen }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditOpen.isOpen) {
            // Fetch movie data based on isEditOpen.id
            // For now, we'll use dummy data
            form.setFieldsValue({
                id: '1',
                title: 'Avengers: Endgame',
                genre: 'Hành động, Khoa học viễn tưởng',
                releaseYear: moment('2019-04-26'),
                director: 'Anthony Russo, Joe Russo',
                cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
                duration: 181,
                description: 'Avengers: Endgame là bộ phim siêu anh hùng Mỹ...',
                status: 'Đã chiếu',
            });
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
            title="Chỉnh sửa phim"
            open={isEditOpen.isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
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
                    <DatePicker />
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
                    <Input.TextArea />
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