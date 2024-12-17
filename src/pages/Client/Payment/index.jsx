import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";
import { getInfoAuth, getTokenOfUser } from "../../../utils/storage";
import PromoCodeModal from "./modal";

const Payment = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [movieDetail, setMovieDetail] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [ticketPrice, setTicketPrice] = useState();
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


  if (!accessToken) {
    window.location.href = '/';
  }

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
    console.log("Payment", selectedPaymentMethod)
  };
  const handleApplyPromoCode = () => {
    savedVouchers.map((voucher, index) => {
      console.log(totalAmount, promoCode, voucher.ma_giam_gia);
      if (promoCode === voucher.ma_giam_gia) {
        setDiscount(totalAmount * (voucher.muc_giam_gia / 100))
      }
    })
  };

  const finalAmount = totalAmount - discount;

  useEffect(() => {
    fetchSavedVouchers();
    if (location.state) {
      setSelectedSeats(location.state.selectedSeats);
      setTotalAmount(location.state.totalAmount);
      setTicketPrice(location.state.totalAmount)
      setSelectedTime(location.state.selectedTime);
      setSelectedSeatIds(location.state.selectedSeatIds)
      setMovieDetail(location.state.movieDetail),
        setShowtime(location.state.showtimeState),
        setSelectedItems(location.state.items),
        setTicketPrice(location.state.ticketPrice)
    }
  }, [location.state]);

  const fetchSavedVouchers = async () => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }

    try {
      const path = info['vai_tro'] === 'admin' ? `http://127.0.0.1:8000/api/auth/user/voucher-codes` : `http://127.0.0.1:8000/api/auth/user/voucher-codes`;
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
      setSavedVouchers(data); // Use 'data' instead of 'vocher'
    } catch (error) {
      console.error('Error fetching saved vouchers:', error); // Log the error for debugging
    }
  };
  const processDoan = () => {
    const doanArray = Object.keys(selectedItems).map((key) => ({
      doan_id: selectedItems[key].id,
      so_luong_do_an: selectedItems[key].quantity,
    }));
    return doanArray;
  };






  const data = {
    thongtinchieu_id: location.state.timeId,
    ghe_ngoi: selectedSeats,
    doan: processDoan(),
    ma_giam_gia: promoCode,
    ghi_chu: "BOOKING"
  };


  const handlePayment = async () => {
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
        // usePaymentMethod(result?.data?.id, "ncb")
        console.log(result?.data)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    await sendData();
  };

  const handleSelectPromoCode = (code) => {
    setPromoCode(code);
    setIsModalOpen(false);
  };

  const callPaymentMethod = async (data) => {
    try {
      const pathPayment =  info['vai_tro'] === 'admin' ? 'paymentBookTicket'  : 'payment';
      let payment = null;
      switch(selectedPaymentMethod){
        case "Thanh toán tại quầy":
          payment = 'thanh_toan_tien_tai_quay';
          break;
        case "vnpay":
          payment = 'vnpay';
          break;
      }

      console.log("METHOD", payment)

      const result = await axios.post(`http://127.0.0.1:8000/api/${pathPayment}/${data?.data.id}/vnpay`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Add the bearer token here
          'Content-Type': 'application/json',
        },
      });

      if( info['vai_tro'] === 'admin') {
        navigate('/admin/bookings')
      } else {
        window.location.href = result?.data.url;
      }
      

    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!movieDetail) {
    return <Spin size="large" className='flex items-center justify-center mt-20'></Spin>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white  mt-10">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Thanh toán</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin phim</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Phim:</span> {movieDetail?.ten_phim}</p>
                <p><span className="font-semibold">Giờ chiếu:</span> {selectedTime}</p>
                <p><span className="font-semibold">Ngày chiếu:</span> {location.state.date}</p>
                <p><span className="font-semibold">Phòng chiếu:</span> {showtime?.room?.ten_phong_chieu}</p>
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
                  <td className="py-2">Ghế ({selectedSeatIds.join(', ')})</td>
                  <td className="py-2">{selectedSeats.length}</td>
                  <td className="text-right py-2">{ticketPrice}đ</td>
                  {Object.keys(selectedItems).map((key, index) => {
                    const item = selectedItems[key]; // Lấy món ăn từ selectedItems
                    return (
                      <tr key={index}>
                        <td className="py-2">{item.ten_do_an}</td>
                        <td className="py-2">{item.quantity}</td> {/* Hiển thị số lượng */}
                        <td className="text-right py-2">{item.quantity * item.gia}đ</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="py-2 font-bold">Tổng cộng</td>
                    <td className="py-2"></td>
                    <td className="text-right py-2 font-bold">{totalAmount.toLocaleString()}đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-red-500">Phương thức thanh toán</h2>
            <div className="space-y-4 mb-6">
              {(info['vai_tro'] === 'admin' ?
                [ "Thanh toán tại quầy"] :
                ["VnPay"]
              ).map((method) => (
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
              <p className="flex justify-between"><span>Giảm giá</span><span>-{discount.toLocaleString()}đ</span></p> {/* Hiển thị giảm giá */}
              <p className="flex justify-between font-bold text-xl"><span>Tổng cộng</span><span>{finalAmount.toLocaleString()}đ</span></p> {/* Hiển thị tổng cộng sau khi giảm giá */}
            </div>

           
            <div className="mb-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onClick={() => setIsModalOpen(true)}
                placeholder="Nhập mã khuyến mãi"
                className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              />
              <button
                className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 mt-2 mb-10"
                onClick={handleApplyPromoCode}
              >
                Áp dụng
              </button>
            </div>
     
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 mb-4"
              onClick={handlePayment}
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
        promoCodes={savedVouchers}f
        onSelectPromoCode={handleSelectPromoCode}
      />
    </div >


  );
};

export default Payment;


