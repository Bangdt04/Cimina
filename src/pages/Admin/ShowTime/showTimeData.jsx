import {
  Button,
  Table,
  notification,
  Typography,
  Input,
  DatePicker,
  Row,
  Col,
  Spin,
  Modal,
  Collapse,
  Card,
  Descriptions,
  Space,
  Tag,
  Divider
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  CalendarOutlined, 
  VideoCameraOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import config from '../../../config';
import { useDeleteShowtime, useShowtimes } from '../../../hooks/api/useShowtimeApi';
import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Panel } = Collapse;

/** 
* Hàm chuyển đổi dữ liệu phân cấp, đồng thời sắp xếp ngày tăng dần và giờ chiếu tăng dần 
*/
const transformDataHierarchical = (data) => {
  const moviesMap = {};

  data.forEach((item) => {
      const movieId = item.movie.id;
      const movieName = item.movie.ten_phim;
      const showDate = item.ngay_chieu;
      const showTime = item.gio_chieu;
      const room = item.room;
      const showtimeId = item.id;

      if (!moviesMap[movieId]) {
          moviesMap[movieId] = {
              key: `movie-${movieId}`,
              ten_phim: movieName,
              children: {},
          };
      }

      if (!moviesMap[movieId].children[showDate]) {
          moviesMap[movieId].children[showDate] = {
              key: `date-${movieId}-${showDate}`,
              ngay_chieu: dayjs(showDate).format('DD/MM/YYYY'),
              originalDate: showDate,
              children: {},
          };
      }

      if (!moviesMap[movieId].children[showDate].children[showTime]) {
          moviesMap[movieId].children[showDate].children[showTime] = {
              key: `time-${movieId}-${showDate}-${showTime}`,
              gio_chieu: dayjs(showTime, 'HH:mm:ss').format('HH:mm'),
              originalTime: showTime,
              children: [],
          };
      }

      moviesMap[movieId].children[showDate].children[showTime].children.push({
          key: `showtime-${showtimeId}`,
          id: showtimeId,
          ten_phong_chieu: room.ten_phong_chieu,
      });
  });

  // Chuyển đổi map thành mảng và sắp xếp dữ liệu
  const hierarchicalData = Object.values(moviesMap).map((movie) => {
      const dateChildren = Object.values(movie.children)
          // Sắp xếp ngày chiếu tăng dần
          .sort((a, b) => dayjs(a.originalDate).valueOf() - dayjs(b.originalDate).valueOf())
          .map((date) => {
              const timeChildren = Object.values(date.children)
                  // Sắp xếp giờ chiếu tăng dần
                  .sort((a, b) => dayjs(a.originalTime, 'HH:mm:ss').valueOf() - dayjs(b.originalTime, 'HH:mm:ss').valueOf())
                  .map((time) => ({
                      ...time,
                      children: time.children,
                  }));

              return {
                  ...date,
                  children: timeChildren,
              };
          });

      return {
          ...movie,
          children: dateChildren,
      };
  });

  return hierarchicalData;
};

const ShowTimeData = () => {
  const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
  const [filters, setFilters] = useState({ movie: '', showDate: '' });
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useShowtimes(filters);
  const [hierarchicalData, setHierarchicalData] = useState([]);

  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
      if (data && data.data) {
          const transformedData = transformDataHierarchical(data.data);
          setHierarchicalData(transformedData);
      }
  }, [data]);

  useEffect(() => {
      refetch();
  }, [filters, refetch]);

  const mutationDelete = useDeleteShowtime({
      onSuccess: () => {
          setIsDisableOpen({ ...isDisableOpen, isOpen: false });
          notification.success({ message: 'Xóa thành công', placement: 'topRight' });
          refetch();
      },
      onError: () => {
          notification.error({ message: 'Xóa thất bại', placement: 'topRight' });
      },
  });

  const handleDelete = async (id) => {
      await mutationDelete.mutateAsync(id);
  };

  const handleEdit = (id) => {
      navigate(`${config.routes.admin.showTime}/update/${id}`);
  };

  const handleFilterChange = (value, field) => {
      setFilters((prevFilters) => ({
          ...prevFilters,
          [field]: value,
      }));
  };

  const handleOpenModal = (record) => {
      setSelectedMovie(record);
      setIsModalVisible(true);
  };

  const handleCloseModal = () => {
      setIsModalVisible(false);
      setSelectedMovie(null);
  };

  const modalColumns = [
      {
          title: 'Giờ Chiếu',
          dataIndex: 'gio_chieu',
          key: 'gio_chieu',
          render: (text) => (
              <Tag icon={<ClockCircleOutlined />} color="blue">
                  {text}
              </Tag>
          ),
      },
      {
          title: 'Phòng Chiếu',
          dataIndex: 'ten_phong_chieu',
          key: 'ten_phong_chieu',
          render: (text) => <Text strong>{text}</Text>,
      },
      {
          title: 'Thao Tác',
          key: 'action',
          render: (_, record) => (
              <Space size="middle">
                  <Button
                      icon={<EditOutlined />}
                      type="primary"
                      shape="circle"
                      onClick={() => handleEdit(record.id)}
                      size="small"
                      title="Sửa"
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  />
                  <Button
                      icon={<DeleteOutlined />}
                      type="primary"
                      danger
                      shape="circle"
                      onClick={() => handleDelete(record.id)}
                      size="small"
                      title="Xóa"
                  />
              </Space>
          ),
      },
  ];

  const mainColumns = [
      {
          title: 'Tên Phim',
          dataIndex: 'ten_phim',
          key: 'ten_phim',
          render: (text, record) => (
              <Space size="middle">
                  <Text strong style={{ fontSize: '16px' }}>{text}</Text>
              </Space>
          ),
      },
      {
          title: 'Thao Tác',
          key: 'action',
          render: (_, record) => (
              <Button
                  type="link"
                  onClick={() => handleOpenModal(record)}
                  icon={<VideoCameraOutlined />}
                  style={{ color: '#1890ff', fontWeight: 'bold' }}
              >
                  Chi Tiết
              </Button>
          ),
      },
  ];

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Filter Section */}
          <Card
              title={<Title level={4} style={{ marginBottom: 0 }}>Lọc Suất Chiếu</Title>}
              bordered={false}
              style={{ marginBottom: '24px', background: '#fafafa', borderRadius: '8px' }}
          >
              <Row gutter={16} align="middle">
                  <Col span={8}>
                      <Input
                          prefix={<SearchOutlined />}
                          placeholder="Nhập tên phim"
                          value={filters.movie}
                          onChange={(e) => handleFilterChange(e.target.value, 'movie')}
                          allowClear
                      />
                  </Col>
                  <Col span={8}>
                      <DatePicker
                          prefix={<CalendarOutlined />}
                          placeholder="Chọn ngày chiếu"
                          value={filters.showDate ? dayjs(filters.showDate) : null}
                          onChange={(date) =>
                              handleFilterChange(date ? date.format('YYYY-MM-DD') : '', 'showDate')
                          }
                          style={{ width: '100%' }}
                          allowClear
                      />
                  </Col>
                  <Col span={8}>
                      <Button
                          type="primary"
                          onClick={() => refetch()}
                          style={{ width: '100%' }}
                          icon={<SearchOutlined />}
                      >
                          Lọc
                      </Button>
                  </Col>
              </Row>
          </Card>

          {/* Loading Spinner */}
          {isLoading ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Spin size="large" />
              </div>
          ) : (
              <Table
                  columns={mainColumns}
                  dataSource={hierarchicalData}
                  pagination={{ pageSize: 10 }}
                  rowKey="key"
                  expandable={{
                      expandedRowRender: (record) => (
                          <Collapse accordion>
                              {record.children.map((date) => (
                                  <Panel
                                      header={
                                          <Tag color="green" style={{ fontSize: '14px' }}>
                                              {date.ngay_chieu}
                                          </Tag>
                                      }
                                      key={date.key}
                                      style={{
                                          backgroundColor: '#f7f7f7',
                                          borderRadius: '4px',
                                          marginBottom: '8px',
                                      }}
                                  >
                                      <Table
                                          columns={modalColumns}
                                          dataSource={date.children.flatMap((time) =>
                                              time.children.map((room) => ({
                                                  key: room.key,
                                                  id: room.id,
                                                  gio_chieu: time.gio_chieu,
                                                  ten_phong_chieu: room.ten_phong_chieu,
                                              }))
                                          )}
                                          pagination={false}
                                          size="small"
                                          rowKey="id"
                                      />
                                  </Panel>
                              ))}
                          </Collapse>
                      ),
                      rowExpandable: (record) => record.children && record.children.length > 0,
                  }}
                  style={{ borderRadius: '8px', overflow: 'hidden' }}
              />
          )}

          {/* Modal Chi Tiết */}
          <Modal
              title={
                  <Space>
                      <Text strong style={{ fontSize: '18px' }}>
                          {selectedMovie ? selectedMovie.ten_phim : 'Chi Tiết'}
                      </Text>
                  </Space>
              }
              visible={isModalVisible}
              onCancel={handleCloseModal}
              footer={null}
              width={800}
              bodyStyle={{ padding: '24px' }}
              destroyOnClose
          >
              {selectedMovie ? (
                  <Card
                      hoverable
                      bordered={false}
                      style={{ background: '#fafafa' }}
                  >
                      <Descriptions
                          bordered
                          column={1}
                          labelStyle={{ width: '120px', fontWeight: 'bold', background: '#f0f2f5' }}
                          contentStyle={{ background: '#ffffff' }}
                          style={{ marginBottom: '24px' }}
                      >
                          <Descriptions.Item label="Tên Phim">{selectedMovie.ten_phim}</Descriptions.Item>
                      </Descriptions>
                      <Divider orientation="left" orientationMargin={0}>
                          <Text strong style={{ fontSize: '16px' }}>Suất Chiếu</Text>
                      </Divider>
                      {selectedMovie.children.map((date) => (
                          <Card
                              key={date.key}
                              style={{ marginBottom: '16px', background: '#ffffff' }}
                              bodyStyle={{ padding: '16px' }}
                          >
                              <Title level={5}>
                                  Ngày chiếu: <Tag color="green">{date.ngay_chieu}</Tag>
                              </Title>
                              <Collapse accordion>
                                  {date.children.map((time) => (
                                      <Panel
                                          header={
                                              <Tag icon={<ClockCircleOutlined />} color="blue">
                                                  {time.gio_chieu}
                                              </Tag>
                                          }
                                          key={time.key}
                                          style={{
                                              backgroundColor: '#f0f2f5',
                                              borderRadius: '4px',
                                              marginBottom: '8px',
                                          }}
                                      >
                                          <Table
                                              columns={modalColumns}
                                              dataSource={time.children.map((room) => ({
                                                  key: room.key,
                                                  id: room.id,
                                                  gio_chieu: time.gio_chieu,
                                                  ten_phong_chieu: room.ten_phong_chieu,
                                              }))}
                                              pagination={false}
                                              size="small"
                                              rowKey="id"
                                          />
                                      </Panel>
                                  ))}
                              </Collapse>
                          </Card>
                      ))}
                  </Card>
              ) : (
                  <Text>Không có dữ liệu</Text>
              )}
          </Modal>

          {isDisableOpen.isOpen && (
              <ConfirmPrompt
                  content="Bạn có muốn xóa thời gian chiếu này?"
                  isDisableOpen={isDisableOpen}
                  setIsDisableOpen={setIsDisableOpen}
                  handleConfirm={() => handleDelete(isDisableOpen.id)}
              />
          )}
      </div>
  );

};

export default ShowTimeData;
