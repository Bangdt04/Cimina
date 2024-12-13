import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  notification,
  Typography,
  DatePicker,
  Tooltip,
  Divider,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import config from "../../../config";

const { Title } = Typography;

function VoucherFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/coupons/${id}`)
        .then((response) => {
          const data = response.data.data;
          form.setFieldsValue({
            ma_giam_gia: data.ma_giam_gia,
            muc_giam_gia: data.muc_giam_gia,
            gia_don_toi_thieu: Number(data.gia_don_toi_thieu),
            Giam_max: Number(data.Giam_max),
            mota: data.mota,
            so_luong: data.so_luong,
          });
        })
        .catch((error) => {
          if (error.response && error.response.message) {
            const errorMessage = error.response.message || 'Đã xảy ra lỗi không xác định';
            notification.error({
              message: 'Lỗi',
              description: errorMessage,
              placement: 'topRight',
            });
          } else {
            notification.error({ message: 'Đã xảy ra lỗi không xác định', placement: 'topRight' });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, form]);

  const onFinish = (values) => {
    const formData = {
      ma_giam_gia: values.ma_giam_gia.trim(),
      muc_giam_gia: values.muc_giam_gia,
      gia_don_toi_thieu: values.gia_don_toi_thieu,
      Giam_max: values.Giam_max, // Trường Giam_max
      mota: values.mota ? values.mota.trim() : "",
      so_luong: values.so_luong,
    };

    const request = id
      ? axios.put(`http://127.0.0.1:8000/api/coupons/${id}`, formData)
      : axios.post("http://127.0.0.1:8000/api/coupons", formData);

    setIsLoading(true);
    request
      .then(() => {
        notification.success({
          message: id
            ? "Cập nhật voucher thành công!"
            : "Thêm mới voucher thành công!",
          placement: "topRight",
        });
        navigate(config.routes.admin.voucher);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          const errorMessage = error.response.data.message || 'Đã xảy ra lỗi không xác định';
          notification.error({
            message: 'Lỗi',
            description: errorMessage,
            placement: 'topRight',
          });
        } else {
          notification.error({ message: 'Đã xảy ra lỗi không xác định', placement: 'topRight' });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const handleBeforeUnload = (e) => {
    if (isFormDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        {id ? "Cập nhật voucher" : "Thêm voucher mới"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange} // Đánh dấu form đã thay đổi
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  Mã giảm giá&nbsp;
                  <Tooltip title="Mã này sẽ dùng để áp dụng giảm giá cho đơn hàng.">
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </span>
              }
              name="ma_giam_gia"
              rules={[
                { required: true, message: "Vui lòng nhập mã giảm giá!" },
                {
                  pattern: /^[A-Z0-9]{3,10}$/,
                  message:
                    "Mã giảm giá chỉ chứa chữ hoa và số, dài từ 3 đến 10 ký tự.",
                },
              ]}
            >
              <Input placeholder="Ví dụ: SALE2024" maxLength={10} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  Mức giảm giá (%)&nbsp;
                  <Tooltip title="Nhập phần trăm giảm giá (VD: 10 cho 10%).">
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </span>
              }
              name="muc_giam_gia"
              rules={[
                { required: true, message: "Vui lòng nhập mức giảm giá!" },
                {
                  type: "number",
                  min: 1,
                  max: 100,
                  message: "Mức giảm giá phải từ 1% đến 100%.",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập mức giảm giá"
                style={{ width: "100%" }}
                min={1}
                max={100}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  Giá đơn tối thiểu&nbsp;
                  <Tooltip title="Đơn hàng phải đạt mức giá này để áp dụng voucher.">
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </span>
              }
              name="gia_don_toi_thieu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá đơn tối thiểu!",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Giá đơn tối thiểu không thể nhỏ hơn 0.",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập giá đơn tối thiểu"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  Giảm tối đa&nbsp;
                  <Tooltip title="Giảm giá tối đa có thể áp dụng cho đơn hàng.">
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </span>
              }
              name="Giam_max"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Giảm tối đa không thể nhỏ hơn 0.",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập giảm tối đa (tuỳ chọn)"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  value
                    ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : ""
                }
                parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label={
                <span>
                  Mô tả&nbsp;
                  <Tooltip title="Nhập mô tả ngắn về voucher.">
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </span>
              }
              name="mota"
              rules={[
                {
                  max: 200,
                  message: "Mô tả không được vượt quá 200 ký tự.",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả ngắn về voucher"
                rows={3}
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  Số lượng&nbsp;
                  <Tooltip title="Số lượng voucher có thể sử dụng.">
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </span>
              }
              name="so_luong"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng!" },
                {
                  type: "number",
                  min: 1,
                  message: "Số lượng phải ít nhất là 1.",
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập số lượng"
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="default"
            danger
            onClick={() => navigate(-1)}
            style={{ width: "48%" }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "48%" }}
            loading={isLoading}
          >
            {id ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default VoucherFormPage;
