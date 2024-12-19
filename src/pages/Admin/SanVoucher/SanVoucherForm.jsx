import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, TimePicker, InputNumber, Button, notification, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;

const CountdownVoucherForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupons, setCoupons] = useState([]);

  // Fetch available discount codes
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/show/coupons')
      .then((response) => {
        setCoupons(response.data);
      })
      .catch(() => {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách mã giảm giá.',
          placement: 'topRight',
        });
      });
  }, []);

  // Fetch data if updating (edit mode)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/countdown_vouchers/${id}`)
        .then((response) => {
          const data = response.data;
          form.setFieldsValue({
            magiamgia_id: data.magiamgia_id,
            ngay: moment(data.ngay, 'YYYY-MM-DD'),
            thoi_gian_bat_dau: moment(data.thoi_gian_bat_dau, 'HH:mm:ss'),
            thoi_gian_ket_thuc: moment(data.thoi_gian_ket_thuc, 'HH:mm:ss'),
            so_luong: data.so_luong,
            so_luong_con_lai: data.so_luong_con_lai,
          });
        })
        .catch(() => {
          notification.error({
            message: 'Lỗi',
            description: 'Không thể tải dữ liệu voucher.',
            placement: 'topRight',
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, form]);

  const onFinish = (values) => {
    if (values.thoi_gian_bat_dau >= values.thoi_gian_ket_thuc) {
      notification.error({
        message: 'Lỗi',
        description: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
        placement: 'topRight',
      });
      return;
    }

    const payload = {
      magiamgia_id: values.magiamgia_id,
      ngay: values.ngay.format('YYYY-MM-DD'),
      thoi_gian_bat_dau: values.thoi_gian_bat_dau.format('HH:mm:ss'),
      thoi_gian_ket_thuc: values.thoi_gian_ket_thuc.format('HH:mm:ss'),
      so_luong: values.so_luong,
      so_luong_con_lai: values.so_luong_con_lai,
    };

    setIsSubmitting(true);

    const request = id
      ? axios.put(`http://127.0.0.1:8000/api/countdown_vouchers/${id}`, payload)
      : axios.post('http://127.0.0.1:8000/api/countdown_vouchers', payload);

    request
      .then(() => {
        notification.success({
          message: id ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
          placement: 'topRight',
        });
        navigate('/admin/sanvoucher');
      })
      .catch((error) => {
        const apiErrors = error.response?.data?.errors || {};
        // Map API field errors to form fields if available
        if (Object.keys(apiErrors).length > 0) {
            Object.keys(apiErrors).forEach((field) => {
                form.setFields([
                    {
                        name: field,
                        errors: apiErrors[field], // Assuming errors are an array of messages
                    },
                ]);
            });
        } else {
            // General error message handling
            const errorMessage = error.response?.data?.error || 
                                 error.response?.data?.message || 
                                 'Đã xảy ra lỗi không xác định';
            notification.error({
                message: 'Lỗi',
                description: errorMessage,
                placement: 'topRight',
            });
        }
    })
    .finally(() => setIsSubmitting(false));
    
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {id ? 'Cập nhật Countdown Voucher' : 'Thêm Countdown Voucher'}
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ngay: moment(),
          thoi_gian_bat_dau: moment('00:00:00', 'HH:mm:ss'),
          thoi_gian_ket_thuc: moment('23:59:59', 'HH:mm:ss'),
        }}
      >
        <Form.Item
          label="Chọn mã giảm giá"
          name="magiamgia_id"
          rules={[{ required: true, message: 'Vui lòng chọn mã giảm giá!' }]}
        >
          <Select placeholder="Chọn mã giảm giá">
            {coupons.map((coupon) => (
              <Option key={coupon.id} value={coupon.id}>
                {coupon.ma_giam_gia}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ngày áp dụng"
          name="ngay"
          rules={[{ required: true, message: 'Vui lòng chọn ngày áp dụng!' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Thời gian bắt đầu"
          name="thoi_gian_bat_dau"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
        >
          <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Thời gian kết thúc"
          name="thoi_gian_ket_thuc"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
        >
          <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="so_luong"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="default" danger onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {id ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CountdownVoucherForm;
