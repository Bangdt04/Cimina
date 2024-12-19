import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Contact = () => {
    // State để lưu trữ dữ liệu từ biểu mẫu
    const [formData, setFormData] = useState({
        noidung: '',
    });

    const [status, setStatus] = useState(null); // Để hiển thị trạng thái gửi form
    const [isSubmitting, setIsSubmitting] = useState(false); // Để hiển thị trạng thái đang gửi
    const [charCount, setCharCount] = useState(0); // Đếm ký tự

    const maxChars = 500; // Giới hạn ký tự tối đa

    // Lưu trữ dữ liệu biểu mẫu trong localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Ensure 'noidung' exists and is a string
                if (parsedData && typeof parsedData.noidung === 'string') {
                    setFormData(parsedData);
                    setCharCount(parsedData.noidung.length);
                } else {
                    // If data is malformed, reset to default state
                    setFormData({ noidung: '' });
                    setCharCount(0);
                    localStorage.removeItem('contactFormData');
                    console.warn('Malformed contactFormData found in localStorage. Resetting form data.');
                }
            } catch (error) {
                console.error('Error parsing contactFormData from localStorage:', error);
                // If JSON parsing fails, remove the corrupted data
                localStorage.removeItem('contactFormData');
            }
        }
    }, []);

    useEffect(() => {
        // Only save to localStorage if 'noidung' is a string
        if (typeof formData.noidung === 'string') {
            localStorage.setItem('contactFormData', JSON.stringify(formData));
        }
    }, [formData]);

    // Thêm hiệu ứng hover và focus bằng cách sử dụng CSS-in-JS
    useEffect(() => {
        const styleSheet = document.styleSheets[0];
        if (styleSheet) { // Kiểm tra nếu stylesheet tồn tại
            try {
                styleSheet.insertRule(`
                    textarea:focus {
                        border-color: #ffcc00;
                        box-shadow: 0 0 5px rgba(255, 204, 0, 0.5);
                        outline: none;
                    }
                `, styleSheet.cssRules.length);

                styleSheet.insertRule(`
                    button:hover {
                        background-color: #e6b800;
                        transform: translateY(-2px);
                    }
                `, styleSheet.cssRules.length);

                styleSheet.insertRule(`
                    button:disabled {
                        background-color: #ffe680;
                        cursor: not-allowed;
                    }
                `, styleSheet.cssRules.length);
            } catch (error) {
                console.warn('Could not insert CSS rules:', error);
            }
        } else {
            console.warn('No stylesheet found to insert CSS rules.');
        }
    }, []);

    // Xử lý thay đổi trong các trường của biểu mẫu
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'noidung') {
            if (value.length > maxChars) return; // Giới hạn ký tự
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
            setCharCount(value.length);
        }
    };

    // Xử lý gửi biểu mẫu
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ của dữ liệu
        if (!formData.noidung.trim()) {
            setStatus({ message: 'Vui lòng nhập nội dung.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setStatus(null);
        const tokenData = localStorage.getItem('token');
        const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;
        try {
            // Gửi dữ liệu dưới dạng JSON
            const response = await axios.post('http://127.0.0.1:8000/api/contacts', formData, {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`
                    // Thêm tiêu đề khác nếu cần, ví dụ: Authorization
                },
            });

            if (response.status === 200 || response.status === 201) { // Điều chỉnh dựa trên API của bạn
                setStatus({ message: 'Gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.', type: 'success' });
                // Reset biểu mẫu
                setFormData({   
                    noidung: '',
                });
                setCharCount(0);
                localStorage.removeItem('contactFormData');
            } else {
                setStatus({ message: 'Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau.', type: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({ message: 'Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Liên Hệ</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="noidung" style={styles.label}>Nội dung:</label>
                    <textarea
                        id="noidung"
                        name="noidung"
                        value={formData.noidung}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Nhập nội dung của bạn tại đây..."
                        required
                        aria-describedby="charCount"
                    />
                    <div id="charCount" style={styles.charCount}>
                        {charCount}/{maxChars} ký tự
                    </div>
                </div>
                <button type="submit" style={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
                            Đang gửi...
                        </>
                    ) : 'Gửi'}
                </button>
            </form>
            {status && (
                <div style={{ 
                    ...styles.status, 
                    backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: status.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: '1',
                    transition: 'opacity 0.5s ease-in-out',
                }}>
                    <FontAwesomeIcon icon={status.type === 'success' ? faCheckCircle : faExclamationCircle} style={{ marginRight: '8px' }} />
                    {status.message}
                </div>
            )}
        </div>
    );
};

// Các kiểu CSS cơ bản cải tiến
const styles = {
    container: {
        maxWidth: '800px',
        margin: '80px auto',
        padding: '40px',
        backgroundColor: '#fffbe6', // Màu vàng nhạt cho nền
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        width: '90%', // Đảm bảo linh hoạt trên thiết bị di động
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '2em',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '25px'
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: '500',
        color: '#333',
        fontSize: '1.1em'
    },
    textarea: {
        width: '100%',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        resize: 'vertical',
        fontSize: '16px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        minHeight: '150px',
        backgroundColor: '#fff', // Nền trắng cho textarea
        color: '#333', // Chữ đen cho textarea
        transition: 'border-color 0.3s, box-shadow 0.3s'
    },
    charCount: {
        textAlign: 'right',
        fontSize: '0.9em',
        color: '#666',
        marginTop: '5px'
    },
    button: {
        padding: '15px 20px',
        backgroundColor: '#ffcc00', // Màu vàng cho nút gửi
        color: '#000', // Chữ đen cho nút gửi
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    status: {
        marginTop: '20px',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '16px',
        textAlign: 'center'
    }
};

export default Contact;
