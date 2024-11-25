import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import config from '../../../config';
import { Form, Button, notification, Input } from 'antd';

import { isTokenStoraged } from '../../../utils/storage';
import { OTPProps } from 'antd/es/input/OTP';
import Title from 'antd/es/typography/Title';
import axios from 'axios';

interface VerifyOtpModalProps {
    closeModal: () => void;
    openLoginModal: () => void;
    email: string;
}

const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({ closeModal, openLoginModal, email }) => {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [otp, setOtp] = useState<string>();

    console.log("EMAIL", email)
    const onChange: OTPProps['onChange'] = (text) => {
        setOtp(text);
    };

    const onInput: OTPProps['onInput'] = (value) => {
        console.log('onInput:', value);
    };

    const sharedProps: OTPProps = {
        onChange,
        onInput,
    };

    const onVerifyOtp = async (values: any) => {
        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('otp', otp);

            const response = await axios.post('http://127.0.0.1:8000/api/email/verify-otp', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                notification.success({ message: response.data.message});
                closeModal(); 
                openLoginModal();
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        } finally {
            setProcessing(false);
        }
    };

    if (isTokenStoraged()) {
        const url = config.routes.web.home;
        return <Navigate to={url} replace />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-50 mt-12" id="registerModal">
            <div className="bg-black bg-opacity-90 p-8 rounded-lg shadow-lg w-120 relative">
                <button className="absolute top-2 right-2 text-white" onClick={closeModal}>
                    X
                </button>
                <h2 className="text-white text-2xl mb-2">
                    Xác thực OTP
                </h2>

                <Form form={form} onFinish={onVerifyOtp}>
                    <div className="mb-14">
                        <Title level={5}>With custom display character</Title>
                        <Input.OTP mask="🔒" {...sharedProps} />
                    </div>
                    <Button
                        className="w-full bg-red-600 text-white p-2 rounded-lg hover-zoom"
                        type="primary"
                        htmlType="submit"
                        loading={processing}
                        disabled={processing}
                    >
                        Xác thực tài khoản
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default VerifyOtpModal;