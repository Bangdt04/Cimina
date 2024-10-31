import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const MovieEdit = ({ visible, onClose, movie, onSave }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSave(values);
        onClose();
    };

    return (
        <Modal
            title="Edit Movie"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={movie}
                onFinish={handleFinish}
            >
                <Form.Item
                    name="ten_phim"
                    label="Tên phim"
                    rules={[{ required: true, message: 'Please input the movie name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="dao_dien"
                    label="Đạo diễn"
                    rules={[{ required: true, message: 'Please input the director!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="dien_vien"
                    label="Diễn viên"
                    rules={[{ required: true, message: 'Please input the actors!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="gia_ve"
                    label="Giá vé"
                    rules={[{ required: true, message: 'Please input the ticket price!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="danh_gia"
                    label="Đánh giá"
                    rules={[{ required: true, message: 'Please input the rating!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default MovieEdit;