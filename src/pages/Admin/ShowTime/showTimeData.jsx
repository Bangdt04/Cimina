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
  } from 'antd';
  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
  import config from '../../../config';
  import { useDeleteShowtime, useShowtimes } from '../../../hooks/api/useShowtimeApi';
  import ConfirmPrompt from '../../../layouts/Admin/components/ConfirmPrompt';
  import dayjs from 'dayjs';
  
  const { Text } = Typography;
  const { Panel } = Collapse;
  
  // Hàm chuyển đổi dữ liệu phân cấp với trường id rõ ràng
  const transformDataHierarchical = (data) => {
    const moviesMap = {};
  
    data.forEach((item) => {
      const movieId = item.movie.id;
      const movieName = item.movie.ten_phim;
      const showDate = item.ngay_chieu;
      const showTime = item.gio_chieu;
      const room = item.room;
      const showtimeId = item.id; // Giả sử mỗi item có trường id đại diện cho showtime
  
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
          children: {},
        };
      }
  
      if (!moviesMap[movieId].children[showDate].children[showTime]) {
        moviesMap[movieId].children[showDate].children[showTime] = {
          key: `time-${movieId}-${showDate}-${showTime}`,
          gio_chieu: dayjs(showTime, 'HH:mm:ss').format('HH:mm'),
          children: [],
        };
      }
  
      moviesMap[movieId].children[showDate].children[showTime].children.push({
        key: `showtime-${showtimeId}`, // Sử dụng showtimeId để tạo key duy nhất
        id: showtimeId, // Thêm trường id cho showtime
        ten_phong_chieu: room.ten_phong_chieu,
      });
    });
  
    // Chuyển đổi map thành mảng phù hợp với Ant Design Table
    const hierarchicalData = Object.values(moviesMap).map((movie) => ({
      ...movie,
      children: Object.values(movie.children).map((date) => ({
        ...date,
        children: Object.values(date.children).map((time) => ({
          ...time,
          children: time.children,
        })),
      })),
    }));
  
    return hierarchicalData;
  };
  
  const ShowTimeData = ({ setParams, params }) => {
    const [isDisableOpen, setIsDisableOpen] = useState({ id: 0, isOpen: false });
    const [filters, setFilters] = useState({ movie: '', showDate: '' });
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useShowtimes(filters); // Fetch data based on filters
    const [hierarchicalData, setHierarchicalData] = useState([]);
    const [movies, setMovies] = useState([]);
    const [dates, setDates] = useState([]);
  
    // State cho Modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
  
    useEffect(() => {
      if (data && data.data) {
        // Biến đổi dữ liệu thành cấu trúc phân cấp
        const transformedData = transformDataHierarchical(data.data);
        setHierarchicalData(transformedData);
  
        // Lấy danh sách phim và ngày chiếu duy nhất (nếu cần)
        const moviesList = [...new Set(data.data.map((item) => item.movie.ten_phim))];
        const datesList = [...new Set(data.data.map((item) => item.ngay_chieu))];
        setMovies(moviesList);
        setDates(datesList);
      }
    }, [data]);
  
    useEffect(() => {
      refetch(); // Trigger API call khi filters thay đổi
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
  
    // Cập nhật hàm handleDelete sử dụng id trực tiếp
    const handleDelete = async (id) => {
      await mutationDelete.mutateAsync(id);
    };
  
    // Cập nhật hàm handleEdit sử dụng id trực tiếp
    const handleEdit = (id) => {
      navigate(`${config.routes.admin.showTime}/update/${id}`);
    };
  
    const handleFilterChange = (value, field) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [field]: value,
      }));
    };
  
    // Hàm mở Modal và chọn phim
    const handleOpenModal = (record) => {
      setSelectedMovie(record);
      setIsModalVisible(true);
    };
  
    // Hàm đóng Modal
    const handleCloseModal = () => {
      setIsModalVisible(false);
      setSelectedMovie(null);
    };
  
    // Định nghĩa cột cho Modal (Giờ, Phòng)
    const modalColumns = [
      {
        title: 'Giờ Chiếu',
        dataIndex: 'gio_chieu',
        key: 'gio_chieu',
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: 'Phòng Chiếu',
        dataIndex: 'ten_phong_chieu',
        key: 'ten_phong_chieu',
      },
      {
        title: 'Thao Tác',
        key: 'action',
        render: (_, record) => (
          <div className="action-btn flex gap-3">
            <Button
              icon={<EditOutlined />}
              className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white transition-all"
              onClick={() => handleEdit(record.id)}
              size="small"
            >
              Sửa
            </Button>
            <Button
              icon={<DeleteOutlined />}
              className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all"
              onClick={() => handleDelete(record.id)}
              size="small"
            >
              Xóa
            </Button>
          </div>
        ),
      },
    ];
  
    // Định nghĩa cột cho Bảng Chính (Phim)
    const mainColumns = [
      {
        title: 'Tên Phim',
        dataIndex: 'ten_phim',
        key: 'ten_phim',
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: 'Thao Tác',
        key: 'action',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => handleOpenModal(record)}
          >
            Xem Chi Tiết
          </Button>
        ),
      },
    ];
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filter Section */}
        <div className="filter-section mb-6 border-b-2 pb-4">
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Input
                placeholder="Nhập tên phim"
                value={filters.movie}
                onChange={(e) => handleFilterChange(e.target.value, 'movie')}
                allowClear
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={8}>
              <DatePicker
                placeholder="Chọn ngày chiếu"
                value={filters.showDate ? dayjs(filters.showDate) : null}
                onChange={(date) =>
                  handleFilterChange(date ? date.format('YYYY-MM-DD') : '', 'showDate')
                }
                style={{ width: '100%' }}
                allowClear
                className="custom-datepicker"
              />
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                onClick={() => refetch()} // Trigger refetch manually nếu cần
                style={{ width: '100%', height: '100%' }}
                icon={<SearchOutlined />}
              >
                Lọc
              </Button>
            </Col>
          </Row>
        </div>
  
        {/* Loading Spinner */}
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          // Bảng Chính (Phim)
          <Table
            columns={mainColumns}
            dataSource={hierarchicalData}
            pagination={{ pageSize: 10 }}
            rowKey="key" // Sử dụng key duy nhất của phim
          />
        )}
  
        {/* Modal Chi Tiết */}
        <Modal
          title={selectedMovie ? selectedMovie.ten_phim : 'Chi Tiết'}
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          {selectedMovie ? (
            <Collapse accordion>
              {selectedMovie.children.map((date) => (
                <Panel header={date.ngay_chieu} key={date.key}>
                  <Table
                    columns={modalColumns}
                    dataSource={date.children.flatMap((time) =>
                      time.children.map((room) => ({
                        key: room.key,
                        id: room.id, // Sử dụng id của showtime
                        gio_chieu: time.gio_chieu,
                        ten_phong_chieu: room.ten_phong_chieu,
                      }))
                    )}
                    pagination={false}
                    size="small"
                    rowKey="id" // Sử dụng id của showtime làm rowKey
                  />
                </Panel>
              ))}
            </Collapse>
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
  