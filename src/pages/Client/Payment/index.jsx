import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import axios from "axios";
import { getInfoAuth, getTokenOfUser } from "../../../utils/storage";
import PromoCodeModal from "./modal";

const Payment = () => {
  const [remainingTime, setRemainingTime] = useState(360); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [movieDetail, setMovieDetail] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [showtime, setShowtime] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const accessToken = getTokenOfUser();
  const info = getInfoAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!accessToken) {
    window.location.href = '/';
  }

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleApplyPromoCode = () => {
    const voucher = savedVouchers.find(voucher => promoCode === voucher.ma_giam_gia);

    if (voucher) {
      const minOrderValue = parseInt(voucher.gia_don_toi_thieu, 10);
      const maxDiscount = parseInt(voucher.Giam_max, 10);
      if (totalAmount >= minOrderValue) {
        const calculatedDiscount = totalAmount * (voucher.muc_giam_gia / 100);
        const finalDiscount = Math.min(calculatedDiscount, maxDiscount);
        setDiscount(finalDiscount);
        setPromoError('');
        message.success(`Mã giảm giá "${promoCode}" đã được áp dụng. Giảm giá: ${finalDiscount.toLocaleString()}đ`);
      } else {
        setDiscount(0);
        setPromoError(`Tổng tiền phải trả tối thiểu là ${minOrderValue.toLocaleString()}đ để sử dụng mã này.`);
        message.error(`Mã khuyến mãi không hợp lệ. Tổng tiền phải trả tối thiểu là ${minOrderValue.toLocaleString()}đ.`);
      }
    } else {
      setDiscount(0);
      setPromoError('Mã khuyến mãi không hợp lệ.');
      message.error('Mã khuyến mãi không hợp lệ.');
    }
  };

  const finalAmount = totalAmount - discount;

  useEffect(() => {
    fetchSavedVouchers();
    if (location.state) {
      setSelectedSeats(location.state.selectedSeats || []);
      setTotalAmount(location.state.totalAmount || 0);
      setTicketPrice(location.state.ticketPrice || 0);
      setSelectedTime(location.state.selectedTime || "");
      setSelectedSeatIds(location.state.selectedSeatIds || []);
      setMovieDetail(location.state.movieDetail || {});
      setShowtime(location.state.showtimeState || {});
      // Ensure selectedItems is an array
      const items = location.state.items;
      if (Array.isArray(items)) {
        setSelectedItems(items);
      } else if (items && typeof items === 'object') {
        setSelectedItems(Object.values(items));
      } else {
        setSelectedItems([]);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          notification.error({
            message: `Cảnh báo`,
            description:
              `Quý khách đã hết thời gian chọn ghế vui lòng thử lại`,
            placement: "topRight",
          });
          navigate('/')
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const fetchSavedVouchers = async () => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }

    try {
      const path = `http://127.0.0.1:8000/api/auth/user/voucher-codes`;
      const response = await fetch(path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSavedVouchers(data);
    } catch (error) {
      console.error('Error fetching saved vouchers:', error);
    }
  };

  const processDoan = () => {
    return selectedItems.map((item) => ({
      doan_id: item.id,
      so_luong_do_an: item.quantity,
    }));
  };

  const data = {
    thongtinchieu_id: location.state?.timeId || "",
    ghe_ngoi: selectedSeats,
    doan: processDoan(),
    ma_giam_gia: promoCode || null,
    ghi_chu: "BOOKING"
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      message.error('Vui lòng chọn phương thức thanh toán.');
      return;
    }

    const sendData = async () => {
      try {
        const path = info['vai_tro'] === 'admin' ? `book-ticket` : `booking`;
        const result = await axios.post(`http://127.0.0.1:8000/api/${path}`, data, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        callPaymentMethod(result?.data);
      } catch (error) {
        console.error('Error:', error);
        message.error('Thanh toán thất bại. Vui lòng thử lại sau.');
      }
    };

    await sendData();
  };

  const handleSelectPromoCode = (code) => {
    setPromoCode(code);
    setIsModalOpen(false);
    const voucher = savedVouchers.find(voucher => code === voucher.ma_giam_gia);
    if (voucher) {
      const minOrderValue = parseInt(voucher.gia_don_toi_thieu, 10);
      const maxDiscount = parseInt(voucher.Giam_max, 10);
      if (totalAmount >= minOrderValue) {
        const calculatedDiscount = totalAmount * (voucher.muc_giam_gia / 100);
        const finalDiscount = Math.min(calculatedDiscount, maxDiscount);
        setDiscount(finalDiscount);
        setPromoError('');
        message.success(`Mã giảm giá "${promoCode}" đã được áp dụng. Giảm giá: ${finalDiscount.toLocaleString()}đ`);
      } else {
        setDiscount(0);
        setPromoError(`Tổng tiền phải trả tối thiểu là ${minOrderValue.toLocaleString()}đ để sử dụng mã này.`);
        message.error(`Tổng tiền phải trả tối thiểu là ${minOrderValue.toLocaleString()}đ để sử dụng mã này.`);
      }
    } else {
      setDiscount(0);
      setPromoError('Mã khuyến mãi không hợp lệ.');
      message.error('Mã khuyến mãi không hợp lệ.');
    }
  };

  const callPaymentMethod = async (data) => {
    try {
      const pathPayment = info['vai_tro'] === 'admin' ? 'paymentBookTicket' : 'payment';
      let payment = selectedPaymentMethod === "Thanh toán tại quầy" ? 'thanh_toan_tien_tai_quay' : 'vnpay';

      const result = await axios.post(`http://127.0.0.1:8000/api/${pathPayment}/${data?.data.id}/${payment}`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (info['vai_tro'] === 'admin') {
        navigate('/admin/bookings');
      } else {
        window.location.href = result?.data.url;
      }

    } catch (error) {
      console.error('Error:', error);
      message.error('Xử lý thanh toán thất bại.');
    }
  };

  if (!movieDetail) {
    return <Spin size="large" className='flex items-center justify-center mt-20'></Spin>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white mt-10">
      <div className="container mx-auto px-4 py-12">
      
        <div className="flex justify-between mb-6 text-lg">
          <div><h1 className="text-4xl font-bold text-center">Thanh toán</h1></div>
          <div className="bg-red-600 px-3 py-1 rounded-full">Thời gian chọn ghế: <span className="font-bold">{formatTime(remainingTime)}</span></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin phim</h2>
              <div className="space-y-2">
                <p><strong>Phim:</strong> {movieDetail?.ten_phim}</p>
                <p><strong>Giờ chiếu:</strong> {selectedTime}</p>
                <p><strong>Ngày chiếu:</strong> {location.state?.date}</p>
                <p><strong>Phòng chiếu:</strong> {showtime?.room?.ten_phong_chieu}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl mt-6">
              <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin thanh toán</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Danh mục</th>
                    <th className="text-left py-2">Số lượng</th>
                    <th className="text-right py-2">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Ghế ({selectedSeatIds.join(', ')})</td>
                    <td className="py-2">{selectedSeats.length}</td>
                    <td className="text-right py-2">{ticketPrice.toLocaleString()}đ</td>
                  </tr>
                  {selectedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.ten_do_an}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="text-right py-2">{(item.quantity * item.gia).toLocaleString()}đ</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 font-bold">Tổng cộng</td>
                    <td className="py-2"></td>
                    <td className="text-right py-2 font-bold">{totalAmount.toLocaleString()}đ</td>
                  </tr>
                  {discount > 0 && (
                    <tr>
                      <td className="py-2 font-bold">Giảm giá</td>
                      <td className="py-2"></td>
                      <td className="text-right py-2 font-bold">- {discount.toLocaleString()}đ</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 font-bold">Tổng cộng</td>
                    <td className="py-2"></td>
                    <td className="text-right py-2 font-bold">{finalAmount.toLocaleString()}đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-red-500">Phương thức thanh toán</h2>
            <div className="space-y-4 mb-6">
              {(info['vai_tro'] === 'admin' ? ["Thanh toán tại quầy"] : ["VnPay"]).map((method) => (
                <label key={method} className={`flex items-center space-x-3 p-3 ${selectedPaymentMethod === method ? 'bg-red-600' : 'bg-gray-700'} rounded-lg cursor-pointer transition duration-300 hover:bg-red-600`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    className="form-radio text-red-500"
                    checked={selectedPaymentMethod === method}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="text-lg">{method}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <p className="flex justify-between"><span>Chi phí</span><span>{totalAmount.toLocaleString()}đ</span></p>
              <p className="flex justify-between"><span>Phí</span><span>0đ</span></p>
              {discount > 0 && (
                <p className="flex justify-between"><span>Giảm giá</span><span>-{discount.toLocaleString()}đ</span></p>
              )}
              <p className="flex justify-between font-bold text-xl"><span>Tổng cộng</span><span>{finalAmount.toLocaleString()}đ</span></p>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoError('');
                }}
                onClick={() => setIsModalOpen(true)}
                placeholder="Nhập mã khuyến mãi"
                className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              />
              {promoError && (
                <div className="text-red-500 mt-2">
                  {promoError}
                </div>
              )}
              {promoCode && !promoError && (
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg mt-2">
                  <span>Mã giảm giá đã áp dụng: <strong>{promoCode}</strong></span>
                  <button
                    className="text-red-500 hover:text-red-700 font-semibold"
                    onClick={() => {
                      setPromoCode('');
                      setDiscount(0);
                      setPromoError('');
                    }}
                  >
                    Bỏ chọn
                  </button>
                </div>
              )}
            </div>

            <button
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 mb-4 ${selectedPaymentMethod && (promoCode ? (discount > 0 ? '' : 'opacity-50 cursor-not-allowed') : '')}`}
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || (promoCode && discount === 0)}
            >
              Thanh toán
            </button>
            <button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition duration-300"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>

            <p className="text-yellow-400 text-sm mt-6">
              Lưu ý: Không mua vé cho trẻ em dưới 13 tuổi đối với các suất chiếu phim kết thúc sau 22h00 và không mua vé cho trẻ em dưới 16 tuổi đối với các suất chiếu phim kết thúc sau 23h00.
            </p>
          </div>
        </div>
      </div>

      <PromoCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promoCodes={savedVouchers}
        onSelectPromoCode={handleSelectPromoCode}
        totalAmount={finalAmount} // Pass totalAmount as a prop
      />
    </div>
  );
};

export default Payment;
