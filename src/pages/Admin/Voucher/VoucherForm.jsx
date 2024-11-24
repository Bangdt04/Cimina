import {
    Button,
    Col,
    Form,
    Input,
    Row,
    notification,
    Typography,
    DatePicker,
    Tooltip,
    Divider,
  } from "antd";
  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect } from "react";
  import moment from "moment";
  import config from "../../../config";
  import { useCreateVoucher, useShowVoucher, useUpdateVoucher } from "../../../hooks/api/useVoucherApi";
  
  const { Title } = Typography;
  
  function VoucherFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isLoading, data: voucher } = id ? useShowVoucher(id) : { isLoading: null, data: null };
  
    const [form] = Form.useForm();
    const mutateAdd = useCreateVoucher({
      success: () => {
        notification.success({ message: "Thêm mới voucher thành công!" });
        navigate(config.routes.admin.voucher);
      },
      error: () => {
        notification.error({ message: "Thêm mới voucher thất bại!" });
      },
    });
  
    const mutateEdit = useUpdateVoucher({
      id,
      success: () => {
        notification.success({ message: "Cập nhật voucher thành công!" });
        navigate(config.routes.admin.voucher);
      },
      error: () => {
        notification.error({ message: "Cập nhật voucher thất bại!" });
      },
    });
  
    useEffect(() => {
      if (!voucher) return;
      form.setFieldsValue({
        ma_giam_gia: voucher?.data?.ma_giam_gia,
        muc_giam_gia: voucher?.data?.muc_giam_gia,
        gia_don_toi_thieu: voucher?.data?.gia_don_toi_thieu,
        mota: voucher?.data?.mota,
        ngay_het_han: voucher?.data?.ngay_het_han ? moment(voucher.data.ngay_het_han) : null,
        so_luong: voucher?.data?.so_luong,
      });
    }, [voucher]);
  
    const onFinish = async () => {
      const formData = {
        ma_giam_gia: form.getFieldValue("ma_giam_gia"),
        muc_giam_gia: form.getFieldValue("muc_giam_gia"),
        gia_don_toi_thieu: form.getFieldValue("gia_don_toi_thieu"),
        mota: form.getFieldValue("mota"),
        ngay_het_han: form.getFieldValue("ngay_het_han").format("YYYY-MM-DD"),
        so_luong: form.getFieldValue("so_luong"),
      };
  
      if (id) {
        await mutateEdit.mutateAsync({ id, body: formData });
      } else {
        await mutateAdd.mutateAsync(formData);
      }
    };
  
    return (
      <div
        style={{
          padding: "30px",
          maxWidth: "700px",
          margin: "auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          {id ? "Cập nhật voucher" : "Thêm voucher mới"}
        </Title>
  
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã giảm giá"
                name="ma_giam_gia"
                tooltip="Mã này sẽ dùng để áp dụng giảm giá cho đơn hàng."
                rules={[{ required: true, message: "Vui lòng nhập mã giảm giá!" }]}
              >
                <Input placeholder="Ví dụ: SALE2024" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mức giảm giá (%)"
                name="muc_giam_gia"
                tooltip="Nhập phần trăm giảm giá (VD: 10 cho 10%)."
                rules={[{ required: true, message: "Vui lòng nhập mức giảm giá!" }]}
              >
                <Input type="number" placeholder="Nhập mức giảm giá" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá đơn tối thiểu"
                name="gia_don_toi_thieu"
                tooltip="Đơn hàng phải đạt mức giá này để áp dụng voucher."
                rules={[{ required: true, message: "Vui lòng nhập giá đơn tối thiểu!" }]}
              >
                <Input type="number" placeholder="Nhập giá đơn tối thiểu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mô tả" name="mota">
                <Input placeholder="Nhập mô tả ngắn về voucher" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày hết hạn"
                name="ngay_het_han"
                tooltip="Chọn ngày cuối cùng voucher có hiệu lực."
                rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="so_luong"
                tooltip="Số lượng voucher có thể sử dụng."
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <Input type="number" placeholder="Nhập số lượng" />
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
            >
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
  
  export default VoucherFormPage;
  