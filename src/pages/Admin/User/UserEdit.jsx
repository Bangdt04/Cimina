import { Button, Modal, Form, Input, Select } from 'antd';
import { useState, useEffect } from 'react';

function UserEdit({ isEditOpen, setIsEditOpen }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditOpen.isOpen) {
            // Fetch user data based on isEditOpen.id
            // For now, we'll use dummy data
            form.setFieldsValue({
                id: '1',
                name: 'T',
                email: 't@t.com',
                phone: '1243143434',
                zalo: 'zalo',
                facebook: 'fb',
                address: 'TPHCM',
                status: 'Chưa duyệt',
                confirmed: 'Đã xác nhận',
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
            title="Chỉnh sửa người dùng"
            open={isEditOpen.isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="id" label="ID" hidden>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                    <Input />
                </Form.Item>
                <Form.Item name="zalo" label="Zalo">
                    <Input />
                </Form.Item>
                <Form.Item name="facebook" label="Facebook">
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ">
                    <Input />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Select.Option value="Hoạt động">Hoạt động</Select.Option>
                        <Select.Option value="Không hoạt động">Không hoạt động</Select.Option>
                        <Select.Option value="Chưa duyệt">Chưa duyệt</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="confirmed" label="Xác nhận">
                    <Select>
                        <Select.Option value="Đã xác nhận">Đã xác nhận</Select.Option>
                        <Select.Option value="Chưa xác nhận">Chưa xác nhận</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default UserEdit;