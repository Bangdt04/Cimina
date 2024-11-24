import { Button, Table, notification, Input, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteVoucher, useGetVouchers } from "../../../hooks/api/useVoucherApi";
import ConfirmPrompt from "../../../layouts/Admin/components/ConfirmPrompt";
import { SearchOutlined } from "@ant-design/icons";

const baseColumns = (navigate, setIsDisableOpen) => [
  {
    title: "Mã Giảm Giá",
    dataIndex: "ma_giam_gia",
    sorter: true,
    filtered: true,
  },
  {
    title: "Giá Trị (%)",
    dataIndex: "muc_giam_gia",
  },
  {
    title: "Giá Đơn Tối Thiểu",
    dataIndex: "gia_don_toi_thieu",
  },
  {
    title: "Mô Tả",
    dataIndex: "mota",
  },
  {
    title: "Hạn Sử Dụng",
    dataIndex: "ngay_het_han",
  },
  {
    title: "Số Lượng",
    dataIndex: "so_luong",
  },
  {
    title: "Đã Sử Dụng",
    dataIndex: "so_luong_da_su_dung",
  },
  {
    title: "Thao Tác",
    dataIndex: "action",
    render: (_, record) => (
      <Space>
        <Tooltip title="Sửa voucher">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/voucher/update/${record.key}`)}
          >
            Sửa
          </Button>
        </Tooltip>
        <Tooltip title="Xóa voucher">
          <Button
            type="danger"
            onClick={() => setIsDisableOpen({ id: record.key, isOpen: true })}
          >
            Xóa
          </Button>
        </Tooltip>
      </Space>
    ),
  },
];

function transformData(dt) {
  return dt?.map((item) => ({
    key: item.id,
    ma_giam_gia: item.ma_giam_gia,
    muc_giam_gia: `${item.muc_giam_gia}%`,
    gia_don_toi_thieu: `${item.gia_don_toi_thieu} VND`,
    mota: item.mota || "Không có mô tả",
    ngay_het_han: item.ngay_het_han,
    so_luong: item.so_luong,
    so_luong_da_su_dung: item.so_luong_da_su_dung,
  }));
}

function VoucherData() {
  const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetVouchers();
  const [tdata, setTData] = useState([]);

  useEffect(() => {
    if (isLoading || !data) return;
    const transformedData = transformData(data?.data);
    setTData(transformedData);
    setFilteredData(transformedData);
  }, [isLoading, data]);

  const mutationDelete = useDeleteVoucher({
    success: () => {
      setIsDisableOpen({ ...isDisableOpen, isOpen: false });
      notification.success({ message: "Xóa thành công!" });
      refetch();
    },
    error: () => {
      notification.error({ message: "Xóa thất bại!" });
    },
  });

  const onDelete = async () => {
    await mutationDelete.mutateAsync(isDisableOpen.id);
  };

  const handleSearch = (value) => {
    const filtered = tdata.filter((item) =>
      item.ma_giam_gia.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm mã giảm giá"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "300px" }}
          prefix={<SearchOutlined />}
        />

      </div>
      <Table
        loading={isLoading}
        columns={baseColumns(navigate, setIsDisableOpen)}
        dataSource={filteredData}
        pagination={{ showSizeChanger: true }}
        style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
      />
      {isDisableOpen.isOpen && (
        <ConfirmPrompt
          content="Bạn có chắc chắn muốn xóa voucher này?"
          isDisableOpen={isDisableOpen}
          setIsDisableOpen={setIsDisableOpen}
          handleConfirm={onDelete}
        />
      )}
    </div>
  );
}

export default VoucherData;
