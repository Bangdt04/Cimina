import React, { useState, useEffect } from 'react';
import { Form, InputNumber, DatePicker, TimePicker, Button, notification, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

const CountdownVoucherForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data nếu có `id` (chế độ cập nhật)
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

  // Xử lý khi submit form
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
        Object.keys(apiErrors).forEach((field) => {
          form.setFields([
            {
              name: field,
              errors: apiErrors[field],
            },
          ]);
        });
        notification.error({
          message: 'Lỗi',
          description: 'Không thể lưu dữ liệu voucher.',
          placement: 'topRight',
        });
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
          label="Mã giảm giá ID"
          name="magiamgia_id"
          rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá ID!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập ID mã giảm giá" />
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
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0.' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
        </Form.Item>
        <Form.Item
          label="Số lượng còn lại"
          name="so_luong_con_lai"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng còn lại!' },
            { type: 'number', min: 0, message: 'Số lượng còn lại phải lớn hơn hoặc bằng 0.' },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng còn lại" />
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
