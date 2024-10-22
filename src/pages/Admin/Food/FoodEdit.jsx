import { Modal, Form, Input, Select, Button, InputNumber } from 'antd';
import { useEffect } from 'react';
import { generateFoodData } from './FoodData';

function FoodEdit({ isEditOpen, setIsEditOpen }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditOpen.isOpen) {
            const allFoods = generateFoodData();
            const selectedFood = allFoods.find(food => food.id === isEditOpen.id);
            if (selectedFood) {
                form.setFieldsValue(selectedFood);
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
            title={<h2 className="text-2xl font-bold bg-white text-gray-800">Chỉnh sửa món ăn</h2>}
            open={isEditOpen.isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Lưu
                </Button>,
            ]}
            className="food-edit-modal bg-white"
        >
            <Form form={form} layout="vertical" className="food-edit-form">
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="Tên món" rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
                    <Select>
                        <Select.Option value="Món chính">Món chính</Select.Option>
                        <Select.Option value="Món phụ">Món phụ</Select.Option>
                        <Select.Option value="Tráng miệng">Tráng miệng</Select.Option>
                        <Select.Option value="Đồ uống">Đồ uống</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                    <InputNumber
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                    <Select>
                        <Select.Option value="Còn hàng">Còn hàng</Select.Option>
                        <Select.Option value="Hết hàng">Hết hàng</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FoodEdit;