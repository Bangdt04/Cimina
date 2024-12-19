import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Table,
  notification,
  Input,
  Space,
  Tooltip,
  Modal,
  Tag,
  Row,
  Col,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const { confirm } = Modal;

// Cấu hình các cột của bảng
const baseColumns = (navigate, showDeleteConfirm) => [
  {
    title: "Mã Giảm Giá",
    dataIndex: "ma_giam_gia",
    sorter: (a, b) => a.ma_giam_gia.localeCompare(b.ma_giam_gia),
    ellipsis: true,
  },
  {
    title: "Giá Trị (%)",
    dataIndex: "muc_giam_gia",
    sorter: (a, b) => a.muc_giam_gia - b.muc_giam_gia,
    ellipsis: true,
  },
  {
    title: "Giá Đơn Tối Thiểu",
    dataIndex: "gia_don_toi_thieu",
    sorter: (a, b) => parseInt(a.gia_don_toi_thieu.replace(/,/g, '')) - parseInt(b.gia_don_toi_thieu.replace(/,/g, '')),
    ellipsis: true,
  },
  {
    title: "Giảm Tối Đa",
    dataIndex: "Giam_max",
    sorter: (a, b) => {
      const aValue = a.Giam_max === "Không giới hạn" ? Infinity : parseInt(a.Giam_max.replace(/,/g, ""));
      const bValue = b.Giam_max === "Không giới hạn" ? Infinity : parseInt(b.Giam_max.replace(/,/g, ""));
      return aValue - bValue;
    },
    ellipsis: true,
  },
  {
    title: "Mô Tả",
    dataIndex: "mota",
    ellipsis: true,
  },
  {
    title: "Trạng Thái",
    dataIndex: "trang_thai",
    filters: [
      { text: "Hoạt động", value: "Hoạt động" },
      { text: "Hết hạn", value: "Hết hạn" },
    ],
    onFilter: (value, record) => record.trang_thai === value,
    render: (status) => {
      let color = "default";
      let tooltip = "";
      if (status === "Hoạt động") {
        color = "green";
        tooltip = "Voucher đang hoạt động và có thể sử dụng.";
      } else if (status === "Hết hạn") {
        color = "orange";
        tooltip = "Voucher đã hết hạn sử dụng.";
      }
      return (
        <Tooltip title={tooltip}>
          <Tag color={color}>{status}</Tag>
        </Tooltip>
      );
    },
  },
  {
    title: "Đã Sử Dụng",
    dataIndex: "so_luong_da_su_dung",
    sorter: (a, b) => a.so_luong_da_su_dung - b.so_luong_da_su_dung,
    ellipsis: true,
  },
  {
    title: "Ngày Tạo",
    dataIndex: "created_at",
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    ellipsis: true,
  },
  {
    title: "Thao Tác",
    dataIndex: "action",
    fixed: 'right',
    width: 150,
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Sửa voucher">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/admin/voucher/update/${record.key}`)}
          >
            Sửa
          </Button>
        </Tooltip>
        {/* <Tooltip title="Xóa voucher">
          <Button
            type="danger"
            size="small"
            onClick={() => showDeleteConfirm(record.key)}
          >
            Xóa
          </Button>
        </Tooltip> */}
      </Space>
    ),
  },
];

// Hàm chuyển đổi dữ liệu từ API
function transformData(dt) {
  const currentDate = new Date();
  if (!Array.isArray(dt)) return [];

  return dt.map((item) => {
    // Xác định trạng thái "Hết hạn" dựa trên ngày hết hạn
    let status = "Hoạt động";
    if (item.ngay_het_han) {
      const expirationDate = new Date(item.ngay_het_han);
      // So sánh ngày hết hạn với ngày hiện tại
      if (expirationDate < currentDate) {
        status = "Hết hạn";
      }
    }

    return {
      key: item.id,
      ma_giam_gia: item.ma_giam_gia,
      muc_giam_gia: `${item.muc_giam_gia}%`,
      gia_don_toi_thieu: `${Number(item.gia_don_toi_thieu).toLocaleString()} VND`,
      Giam_max: item.Giam_max ? `${Number(item.Giam_max).toLocaleString()} VND` : "Không giới hạn",
      mota: item.mota || "Không có mô tả",
      so_luong: item.so_luong,
      so_luong_da_su_dung: item.so_luong_da_su_dung !== null ? item.so_luong_da_su_dung : 0,
      trang_thai: status,
      created_at: item.created_at ? new Date(item.created_at).toLocaleString() : "Chưa xác định",
      updated_at: item.updated_at ? new Date(item.updated_at).toLocaleString() : "Chưa cập nhật",
    };
  });
}

function VoucherData() {
  const [isLoading, setIsLoading] = useState(false);
  const [tdata, setTData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  // Hàm lấy dữ liệu vouchers
  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/coupons");
      if (response.data && Array.isArray(response.data.data)) {
        const transformedData = transformData(response.data.data);
        setTData(transformedData);
        setFilteredData(transformedData);
      } else {
        // Nếu API trả về data không phải là mảng, đặt bảng thành trống và hiển thị thông báo lỗi
        setTData([]);
        setFilteredData([]);
        notification.error({ message: "Không có dữ liệu!", placement: 'topRight' });
      }
    } catch (error) {
      notification.error({ message: "Đã xảy ra lỗi khi lấy dữ liệu!", placement: 'topRight' });
      console.error(error);
      setTData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Hàm xóa từng voucher
  const handleDelete = async (id, silent = false) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/coupons/${id}`);
      if (!silent) {
        notification.success({ message: "Xóa thành công!", placement: 'topRight' });
      }
    } catch (error) {
      if (!silent) {
        notification.error({ message: "Xóa thất bại!", placement: 'topRight' });
      }
      console.error(error);
      throw error; // Để Promise.allSettled có thể bắt lỗi nếu cần
    }
  };

  // Hàm xác nhận xóa đơn lẻ
  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa voucher này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Voucher sẽ bị xóa vĩnh viễn và không thể khôi phục.',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        handleDelete(id)
          .then(() => {
            fetchVouchers(); // Tải lại danh sách sau khi xóa thành công
          })
          .catch(() => {
            // Đã thông báo lỗi trong handleDelete
          });
      },
      onCancel() {
        // Hủy xóa
      },
    });
  };

  // Hàm tìm kiếm với debounce
  const handleSearch = useCallback(
    debounce((value) => {
      const lowerCaseValue = value.toLowerCase();
      const filtered = tdata.filter((item) =>
        item.ma_giam_gia.toLowerCase().includes(lowerCaseValue) ||
        item.mota.toLowerCase().includes(lowerCaseValue)
      );
      setFilteredData(filtered);
    }, 300),
    [tdata]
  );

  // Hàm xử lý chọn hàng
  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Hàm xóa hàng loạt
  const handleBulkDelete = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa những voucher đã chọn?',
      icon: <ExclamationCircleOutlined />,
      content: 'Các voucher này sẽ bị xóa vĩnh viễn và không thể khôi phục.',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      async onOk() {
        try {
          const results = await Promise.allSettled(selectedRowKeys.map(id => handleDelete(id, true)));
          const fulfilled = results.filter(result => result.status === 'fulfilled').length;
          const rejected = results.filter(result => result.status === 'rejected').length;

          if (fulfilled > 0) {
            notification.success({ message: `Đã xóa thành công ${fulfilled} voucher.`, placement: 'topRight' });
          }

          if (rejected > 0) {
            notification.error({ message: `Không thể xóa ${rejected} voucher.`, placement: 'topRight' });
          }

          // Cập nhật lại danh sách voucher
          fetchVouchers();
          // Đặt lại các khóa hàng đã chọn
          setSelectedRowKeys([]);
        } catch (error) {
          // Đã thông báo lỗi trong handleDelete
        }
      },
      onCancel() {
        // Hủy xóa
      },
    });
  };

  // Hàm xuất dữ liệu dưới dạng Excel
  const exportToExcel = () => {
    // Implement xuất Excel nếu cần
    notification.info({ message: "Tính năng này đang được phát triển!", placement: 'topRight' });
  };

  // Menu cho dropdown hành động hàng loạt
  const bulkMenu = (
    <Menu>
      <Menu.Item key="delete" onClick={handleBulkDelete} icon={<ExclamationCircleOutlined />}>
        Xóa Chọn
      </Menu.Item>
      <Menu.Item key="export" onClick={exportToExcel} icon={<PlusOutlined />}>
        Xuất Excel
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: "16px" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Tìm kiếm mã hoặc mô tả"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={16} lg={18} style={{ textAlign: "right" }}>
          <Space>
            {selectedRowKeys.length > 0 && (
              <Dropdown overlay={bulkMenu}>
                <Button>
                  Hành động <DownOutlined />
                </Button>
              </Dropdown>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate('/admin/voucher/create')}
            >
              Thêm Mới
            </Button>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              size="large"
              onClick={fetchVouchers}
            >
              Làm Mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        loading={isLoading}
        columns={baseColumns(navigate, showDeleteConfirm)}
        dataSource={filteredData}
        pagination={{ showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
        rowKey="key"
        style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
        locale={{ emptyText: "Không có dữ liệu" }} // Thêm locale để hiển thị thông báo khi không có dữ liệu
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        scroll={{ x: 1500, y: 600 }}
        bordered
        size="middle"
      />
    </div>
  );
}

export default VoucherData;
