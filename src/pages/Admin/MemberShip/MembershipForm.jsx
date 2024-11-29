import { Button, Form, Input, notification, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';

const { Title } = Typography;

function MembershipFormPage() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            const fetchMember = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:8000/api/members/${id}`);
                    form.setFieldsValue(data.data);
                } catch (error) {
                    notification.error({
                        message: 'Không thể tải dữ liệu',
                        description: 'Vui lòng thử lại sau!',
                    });
                }
            };
            fetchMember();
        }
    }, [id, form]);

    const onFinish = async (values) => {
        try {
            const url = id
                ? `http://localhost:8000/api/members/${id}`
                : 'http://localhost:8000/api/members';
            const method = id ? 'put' : 'post';
            await axios[method](url, values);
            notification.success({
                message: id ? 'Cập nhật thành viên thành công' : 'Thêm mới thành viên thành công',
            });
            navigate(config.routes.admin.membership);
        } catch (error) {
            notification.error({
                message: id ? 'Cập nhật thành viên thất bại' : 'Thêm mới thành viên thất bại',
            });
        }
    };

    return (
        <div className="form-container">
            <Title level={2}>
                {id ? 'Cập nhật thông tin thành viên' : 'Thêm thành viên mới'}
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tên thành viên"
                    name="ten_thanh_vien"
                    rules={[{ required: true, message: 'Nhập tên thành viên!' }]}
                >
                    <Input placeholder="Nhập tên thành viên" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Nhập email!' }]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="so_dien_thoai"
                    rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    {id ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </Form>
        </div>
    );
}

export default MembershipFormPage;