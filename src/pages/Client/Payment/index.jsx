import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { moviesData } from "../MovieDetails/moviesData";

const Payment = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedTime, setSelectedTime] = useState("");
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const movie = moviesData.find(movie => movie.id === parseInt(id));
        setMovieDetails(movie);

        if (location.state) {
            setSelectedSeats(location.state.selectedSeats);
            setTotalAmount(location.state.totalAmount);
            setSelectedTime(location.state.selectedTime);
        }
    }, [id, location.state]);

    const handlePayment = () => {
        alert("Thanh toán thành công!");
        navigate("/"); 
    };

    if (!movieDetails) {
        return <div>Đang tải...</div>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white ">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Thanh toán</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin phim</h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">Phim:</span> {movieDetails.title}</p>
                  <p><span className="font-semibold">Ghế:</span> {selectedSeats.join(", ")}</p>
                  <p><span className="font-semibold">Giờ chiếu:</span> {selectedTime}</p>
                  <p><span className="font-semibold">Ngày chiếu:</span> {movieDetails.room||"24/10/2024"}</p>
                  <p><span className="font-semibold">Phòng chiếu:</span> {movieDetails.room || "12"}</p>
                  <p><span className="font-semibold">Định dạng:</span> {movieDetails.format || "2D"}</p>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
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
                      <td className="py-2">Ghế ({selectedSeats.join(", ")})</td>
                      <td className="py-2">{selectedSeats.length}</td>
                      <td className="text-right py-2">{totalAmount.toLocaleString()}đ</td>
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
                <p className="flex justify-between font-bold text-xl"><span>Tổng cộng</span><span>{totalAmount.toLocaleString()}đ</span></p>
              </div>

              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mb-4"
                onClick={handlePayment}
              >
                Thanh toán
              </button>
              <button 
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
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