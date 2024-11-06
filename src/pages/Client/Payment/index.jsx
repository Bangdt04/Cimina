import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { moviesData } from "../MovieDetails/moviesData";
import { Spin } from "antd";

const Payment = () => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [movieDetail, setMovieDetail] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [ticketPrice, setTicketPrice] = useState();
  const [showtime, setShowtime] = useState();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0); 

  const handleApplyPromoCode = () => {
      // Kiểm tra mã khuyến mãi (ví dụ: mã "DISCOUNT10" giảm 10%)
      if (promoCode === "DISCOUNT10") {
          setDiscount(totalAmount * 0.1); // Giảm 10% tổng số tiền
      } else {
          alert("Mã khuyến mãi không hợp lệ");
      }
  };

  const finalAmount = totalAmount - discount;

  useEffect(() => {

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
  }, [id, location.state]);

  const handlePayment = () => {
    alert("Thanh toán thành công!");
    navigate("/");
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
                <p><span className="font-semibold">Ngày chiếu:</span> {showtime?.ngay_chieu}</p>
                <p><span className="font-semibold">Phòng chiếu:</span> {showtime?.gio_chieu}</p>
                <p><span className="font-semibold">Phòng chiếu số:</span> {showtime?.room?.rapphim_id}</p>
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
                  {selectedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.ten_do_an}</td>
                      <td className="py-2">1</td>
                      <td className="text-right py-2">{item.gia}đ</td>
                    </tr>

                  ))}
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
              {["VietQR", "VNPAY", "Viettel Money", "Payoo"].map((method) => (
                <label key={method} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-600">
                  <input type="radio" name="paymentMethod" className="form-radio text-red-500" />
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

            {/* Input mã khuyến mãi */}
            <div className="mb-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
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
    </div>
  );
};

export default Payment;