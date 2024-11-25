import { Button, Form, Input, notification } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useLogin } from '../../../hooks/api/useAuthApi';
import config from '../../../config';
import { useState } from 'react';
import {saveToken, getRoles, isTokenStoraged} from '../../../utils/storage';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [processing, setProcessing] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleToken = (token) => {
        saveToken(token);
        notification.success({
            message: 'Đăng nhập thành công',
            description: 'Chào mừng bạn đến với hệ thống của chúng tôi',
        });
        let url = config.routes.admin.dashboard;
        navigate(url);
    };

    const mutationLogin = useLogin({
        success: (data) => {
            handleToken(data);
        },
        error: (err) => {
            console.log(err)
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


    if (isTokenStoraged()) {
        let url = config.routes.admin.login;
        return <Navigate to={url} replace />;
    }
    return (
        <>
            <section class="bg-gray-900 dark:bg-gray-900">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img class="w-20 h-16 mr-2" src="https://chieuphimquocgia.com.vn/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75" alt="logo" />
                    </a>
                    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Đăng nhập quản trị viên
                            </h1>
                            <Form form={form} onFinish={onLogin}>
                                <div className="mb-24">
                                    <FormItem
                                        name={'email'}
                                        layout="vertical"
                                        label={<label style={{ color: "black" }}>Email</label>}
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
                                        label={<label style={{ color: "black" }}>Mật khẩu</label>}
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
                                <button
                                    className="w-full bg-red-500 text-white py-2 rounded-lg hover-zoom"
                                    type="submit"
                                >
                                    Đăng Nhập
                                </button>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default LoginPage;