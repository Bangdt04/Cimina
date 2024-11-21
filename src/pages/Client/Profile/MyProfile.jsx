import React, { useEffect, useState } from "react";
import { Form, Input, message } from "antd";
import axios from "axios";

const MyProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const tokenData = localStorage.getItem('token');
        const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

        if (!token) {
            message.error("Bạn cần đăng nhập để truy cập trang này.");
            window.location.href = '/'; 
            return;
        } else {
            setIsAuthenticated(true);
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/auth/profile", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = response.data.data.user;
                form.setFieldsValue({
                    ho_ten: data.ho_ten || "",
                    so_dien_thoai: data.so_dien_thoai || "",
                    dia_chi: data.dia_chi || "",
                    gioi_tinh: data.gioi_tinh || "",
                    email: data.email || "",
                });
            } catch (error) {
                message.error("Không thể tải thông tin người dùng.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [form]);

    const onFinish = async (values) => {
        try {
            await axios.put("http://127.0.0.1:8000/api/auth/profile", values);
            message.success("Cập nhật thông tin thành công!");
        } catch (error) {
            message.error("Cập nhật thông tin thất bại.");
        }
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <Form
                form={form}
                className="grid grid-cols-2 gap-4 w-1/2"
                initialValues={{
                    ho_ten: "",
                    so_dien_thoai: "",
                    dia_chi: "",
                    gioi_tinh: "",
                    email: "",
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Họ và tên</label>}
                    layout="vertical"
                    name="ho_ten"
                    rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                >
                    <Input className="text-black rounded-full" />
                </Form.Item>
              
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Số điện thoại</label>}
                    layout="vertical"
                    name="so_dien_thoai"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                    <Input className="text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Địa chỉ</label>}
                    layout="vertical"
                    name="dia_chi"
                >
                    <Input className="text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Giới tính</label>}
                    layout="vertical"
                    name="gioi_tinh"
                >
                    <Input className="text-black rounded-full" />
                </Form.Item>
                <Form.Item
                    className="mb-16"
                    label={<label style={{ color: "white" }}>Email</label>}
                    layout="vertical"
                    name="email"
                >
                    <Input className="w-full p-2 bg-black text-white rounded-full" disabled />
                </Form.Item>
                <div className="flex justify-end space-x-4 mt-6 w-full col-span-2">
                    <button
                        className="bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700"
                        type="button"
                    >
                        Đổi mật khẩu
                    </button>
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "Lưu thông tin"}
                    </button>
                </div>
            </Form>
        </>
    );
};

export default MyProfile;