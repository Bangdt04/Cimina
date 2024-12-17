import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Luky.css'; // Đảm bảo tạo file CSS này cho các kiểu dáng bổ sung

const Luky = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [prize, setPrize] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(0); // Số lượt quay còn lại
  const [spinHistory, setSpinHistory] = useState([]); // Lịch sử quay thưởng

  // URL API
  const ROTATIONS_API_URL = 'http://localhost:8000/api/rotations';
  const SPIN_API_URL = 'http://localhost:8000/api/auth/quay-thuong';
  const PROFILE_API_URL = 'http://localhost:8000/api/auth/profile'; // Lấy profile
  const SPIN_HISTORY_API_URL = 'http://localhost:8000/api/available-rotations'; // Lấy lịch sử quay thưởng

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rotations
        const responseRotations = await fetch(ROTATIONS_API_URL);
        if (!responseRotations.ok) {
          throw new Error('Failed to fetch rotations data.');
        }
        const resultRotations = await responseRotations.json();
        const mappedData = resultRotations.map(item => ({
          option: item.ten_phan_thuong,
          isWin: item.ten_phan_thuong !== 'Chúc bạn may mắn lần sau',
        }));
        console.log('Fetched Data:', mappedData); // Debugging Line
        setData(mappedData);

        // Fetch profile để lấy số lượt quay còn lại
        const tokenData = localStorage.getItem('token');
        const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

        if (!token) {
          throw new Error('User is not authenticated.');
        }

        // Fetch profile
        const responseProfile = await fetch(PROFILE_API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!responseProfile.ok) {
          throw new Error('Failed to fetch profile data.');
        }

        const resultProfile = await responseProfile.json();
        console.log('Profile Data:', resultProfile); // Debugging Line

        // Giả sử API trả về { data: { user: { so_luot_quay: number } } }
        const spins = resultProfile.data?.user?.so_luot_quay || 0;
        setSpinsLeft(spins);

        // Fetch spin history
        const responseSpinHistory = await fetch(SPIN_HISTORY_API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!responseSpinHistory.ok) {
          throw new Error('Failed to fetch spin history.');
        }

        const resultSpinHistory = await responseSpinHistory.json();
        console.log('Spin History:', resultSpinHistory); // Debugging Line

        // Map và sắp xếp spin history để có lượt quay mới nhất ở đầu
        const history = resultSpinHistory
          .map(item => ({
            id: item.id,
            prize: item.ket_qua,
            date: item.created_at, // Sử dụng 'created_at' để đảm bảo chính xác
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sắp xếp giảm dần

        setSpinHistory(history);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý khi dừng quay
  const onStopSpinning = () => {
    console.log('Spinning stopped'); // Debugging Line
    setMustSpin(false);
    setSpinning(false);
    if (prizeNumber !== null && data[prizeNumber]) {
      const selectedPrize = data[prizeNumber].option;
      const isWin = data[prizeNumber].isWin;
      setPrize(selectedPrize);

      if (isWin) {
        // Giải thưởng thắng
        toast.success(`Chúc mừng! Bạn đã trúng: ${selectedPrize}`);
        // Có thể thêm logic thêm ở đây nếu cần
      } else {
        // Giải thưởng thua
        toast.info('Chúc bạn may mắn lần sau!');
      }

      // Tùy chọn: reset giải thưởng sau một thời gian
      setTimeout(() => {
        setPrize(null);
      }, 5000);
    }
  };

  // Xử lý khi nhấn nút quay
  const handleSpinClick = async () => {
    if (data.length === 0 || spinning || spinsLeft <= 0) return;
    setSpinning(true);

    try {
      const tokenData = localStorage.getItem('token');
      const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

      if (!token) {
        throw new Error('User is not authenticated.');
      }

      const response = await fetch(SPIN_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Nếu phản hồi không ok, phân tích thông báo lỗi
        const errorData = await response.json();
        if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Quay thưởng không thành công. Vui lòng thử lại.');
        }
        setSpinning(false);
        return;
      }

      const prizeData = await response.json();
      console.log('Prize Data:', prizeData); // Debugging Line

      const index = data.findIndex(item => item.option === prizeData.ket_qua);
      console.log('Prize Index:', index); // Debugging Line

      if (index !== -1) {
        setPrizeNumber(index);
        setMustSpin(true);
        console.log('Spinning initiated with prizeNumber:', index); // Debugging Line

        // Cập nhật số lượt quay còn lại
        const updatedSpins = prizeData.so_luot_quay;
        if (updatedSpins !== undefined) {
          setSpinsLeft(updatedSpins);
        } else {
          // Nếu API không trả về số lượt quay còn lại, giảm đi 1 lượt
          setSpinsLeft(prev => prev - 1);
        }

        // Cập nhật lịch sử quay thưởng
        const newSpin = {
          id: prizeData.id || Date.now(), // Sử dụng id từ API hoặc tạo id tạm
          prize: prizeData.ket_qua,
          date: prizeData.created_at || new Date().toISOString(), // Sử dụng 'created_at' nếu có
        };
        setSpinHistory(prevHistory => [newSpin, ...prevHistory]);

      } else {
        console.error('Phần thưởng từ API không có trong danh sách data');
        toast.error('Phần thưởng không hợp lệ. Vui lòng thử lại.');
        setSpinning(false);
      }
    } catch (error) {
      console.error('Error spinning the wheel:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi quay thưởng. Vui lòng thử lại.');
      setSpinning(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vòng Quay May Mắn</h1>
      <p style={styles.instruction}>Nhấn "Quay Ngay" để thử vận may của bạn!</p>

      <div style={styles.contentWrapper}>
        {/* Phần Vòng Quay và Nút Quay */}
        <div style={styles.wheelSection}>
          {/* Hiển thị số lượt quay còn lại */}
          <p style={styles.spinsLeft}>
            Bạn còn <strong>{spinsLeft}</strong> lượt quay
          </p>

          <div style={styles.wheelWrapper}>
            {loading ? (
              <ClipLoader color="#FF5722" loading={loading} size={50} />
            ) : (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={['#4A90E2', '#50E3C2', '#B8E986', '#F8E71C', '#F5A623', '#D0021B']}
                textColors={['#fff']}
                onStopSpinning={onStopSpinning}
                radiusLineColor={'#fff'}
                radiusLineWidth={2}
                fontSize={16}
                perpendicularText={false}
                outerBorderColor="#fff"
                outerBorderWidth={8}
                innerRadius={10}
                spinDuration={0.5} // Thời gian quay
              />
            )}
          </div>
          <button
            onClick={handleSpinClick}
            style={{
              ...styles.button,
              cursor: spinning || loading || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
              opacity: spinning || loading || spinsLeft <= 0 ? 0.6 : 1,
            }}
            disabled={spinning || loading || spinsLeft <= 0}
            aria-label="Quay Vòng Quay May Mắn"
          >
            {spinning ? 'Đang quay...' : 'Quay Ngay'}
          </button>
          {prize && (
            <div style={styles.resultBox}>
              <h2 style={styles.resultText}>
                {data[prizeNumber].isWin
                  ? `Bạn đã trúng: ${prize}`
                  : 'Chúc bạn may mắn lần sau!'}
              </h2>
            </div>
          )}
        </div>

        {/* Phần Lịch Sử Quay Thưởng */}
        <div style={styles.historySection}>
          <h2 style={styles.historyTitle}>Lịch Sử Quay Thưởng</h2>
          {spinHistory.length === 0 ? (
            <p style={styles.noHistory}>Chưa có lịch sử quay thưởng.</p>
          ) : (
            <ul style={styles.historyList}>
              {spinHistory.map((spin) => (
                <li key={spin.id} style={styles.historyItem}>
                  <span style={styles.spinPrize}>{spin.prize}</span>
                  <span style={styles.spinDate}>
                    {new Date(spin.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Montserrat', sans-serif",
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #262525 0%, #353a38 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  title: {
    margin: '0 0 10px',
    fontWeight: '700',
    fontSize: '2.5rem',
    color: '#fff',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  instruction: {
    fontSize: '16px',
    color: '#f0f0f0',
    margin: '0 0 30px',
    textAlign: 'center',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: '1000px',
    gap: '40px',
    justifyContent: 'center',
  },
  wheelSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  historySection: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '10px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  historyTitle: {
    fontSize: '1.5rem',
    color: '#FFD700',
    marginBottom: '20px',
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  noHistory: {
    color: '#ccc',
    textAlign: 'center',
  },
  historyList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    marginBottom: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
  },
  spinPrize: {
    color: '#fff',
    fontWeight: '600',
  },
  spinDate: {
    color: '#ccc',
    fontSize: '0.9rem',
  },
  spinsLeft: {
    fontSize: '18px',
    color: '#FFD700',
    marginBottom: '20px',
    textAlign: 'center',
  },
  wheelWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '500px',
  },
  button: {
    padding: '14px 28px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#FF5722',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontWeight: '600',
    fontFamily: 'Montserrat, sans-serif',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    marginBottom: '20px',
  },
  resultBox: {
    marginTop: '30px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.1)',
    padding: '20px 25px',
    borderRadius: '10px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  resultText: {
    margin: '0',
    fontSize: '20px',
    color: '#fff',
    fontWeight: '600',
  },
};

export default Luky;
