import { Button, Form, Input, notification, Modal } from 'antd'; // Thêm import Modal từ antd
import FormItem from 'antd/es/form/FormItem';
import { useLogin } from '../../../hooks/api/useAuthApi';
import config from '../../../config';
import { useState } from 'react';
import { saveToken, getRoles, isTokenStoraged } from '../../../utils/storage';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Thêm import axios để gọi API

const LoginModal = ({ closeModal, openRegisterModal }) => {
    const [processing, setProcessing] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleToken = (token) => {
        saveToken(token);
        let url = '/';
        notification.success({
            message: 'Đăng nhập thành công',
            description: 'Chào mừng bạn đến với hệ thống của chúng tôi',
        });
        window.location.reload();
    };

    const mutationLogin = useLogin({
        success: (data) => {
            handleToken(data);
        },
        error: (err) => {
            console.log(err);
            let description = 'Không thể đăng nhập, vui lòng thử lại.';
            let detail = err?.response?.data?.message;
            if (detail) {
                description = detail;
            }
            notification.error({
                message: 'Đăng nhập thất bại',
                description,
            });
        },
        mutate: (data) => {
            setProcessing(true);
        },
        settled: (data) => {
            setProcessing(false);
        },
    });

    const onLogin = async () => {
        await mutationLogin.mutateAsync({
            email: form.getFieldValue('email'),
            password: form.getFieldValue('password'),
        });
    };

    // Thêm state cho modal quên mật khẩu
    const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
    const [email, setEmail] = useState(''); // Thêm state cho email

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/forget_password', { email });
            notification.success({
                message: 'Thành công',
                description: 'Đã gửi yêu cầu khôi phục mật khẩu.',
            });
            setForgotPasswordModalVisible(false); // Đóng modal sau khi gửi yêu cầu
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể gửi yêu cầu khôi phục mật khẩu.',
            });
        }
    };

    if (isTokenStoraged()) {
        let url = config.routes.web.home;
        return <Navigate to={url} replace />;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-50" id="loginModal">
                <div className="bg-black bg-opacity-90 p-8 rounded-lg shadow-lg w-96 relative border border-slate-700">
                    <button className="absolute top-4 right-4 text-white" onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                    <h2 className="text-white text-2xl mb-6">
                        Đăng nhập
                    </h2>
                    <Form form={form} onFinish={onLogin}>
                        <div className="mb-24">
                            <FormItem
                                name={'email'}
                                layout="vertical"
                                label={<label style={{ color: "white" }}>Email</label>}
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Email không hợp lý!',
                                    },
                                    {
                                        required: true,
                                        message: "Vui lòng nhập email."
                                    },
                                ]}
                            >
                                <Input
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                    id="email"
                                    placeholder="Email"
                                    type="email"
                                />
                            </FormItem>
                        </div>
                        <div className="mb-24">
                            <FormItem
                                name={'password'}
                                layout="vertical"
                                label={<label style={{ color: "white" }}>Mật khẩu</label>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu."
                                    },
                                ]}
                            >
                                <Input.Password
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                    id="password"
                                    placeholder="Mật khẩu"
                                    type="password"
                                />
                            </FormItem>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <a className="text-red-500" onClick={() => setForgotPasswordModalVisible(true)}>
                                Quên mật khẩu?
                            </a>
                        </div>
                        <button
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover-zoom"
                            type="submit"
                        >
                            Đăng Nhập
                        </button>
                    </Form>
                    <p className="text-white mt-4 text-center">
                        Bạn chưa có tài khoản?
                        <a className="text-red-500" href="#" onClick={openRegisterModal}>
                            Đăng kí
                        </a>
                    </p>
                </div>
            </div>

            {/* Modal quên mật khẩu */}
            <Modal
                title="Khôi phục mật khẩu"
                visible={isForgotPasswordModalVisible}
                onCancel={() => setForgotPasswordModalVisible(false)}
                onOk={handleForgotPassword}
            >
                <Input
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Modal>
        </>
    );
}

export default LoginModal;