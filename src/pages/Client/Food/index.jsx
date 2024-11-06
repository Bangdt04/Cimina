import { useEffect, useState } from 'react';
import './food.scss';
import { useGetFoods } from '../../../hooks/api/useFoodApi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
const FoodMenu = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [movieDetail, setMovieDetail] = useState();
    const [showtime, setShowtime] = useState();
    const [ticketPrice, setTicketPrice] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedItems, setSelectedItems] = useState([]);
    const { data, isLoading } = useGetFoods();

    useEffect(() => {
        console.log(location.state)
        if (location.state) {
            setSelectedSeats(location.state.selectedSeats);
            setTotalAmount(location.state.totalAmount);
            setTicketPrice(location.state.totalAmount)
            setSelectedTime(location.state.selectedTime);
            setSelectedSeatIds(location.state.selectedSeatIds)
            setMovieDetail(location.state.movieDetail),
            setShowtime(location.state.showtimeState)

        }
    }, [id, location.state]);

    


    const handlePurchase = (item) => {
        const itemPrice = parseInt(item.gia.replace(/\./g, ''), 10); // Loại bỏ dấu chấm và chuyển đổi thành số nguyên


        setTotalAmount(prevTotal => {
            const currentTotal = typeof prevTotal === 'string' ? parseInt(prevTotal.replace(/\./g, ''), 10) : prevTotal;
            return currentTotal + itemPrice;
        });


        setSelectedItems(prevItems => [...prevItems, item]);
    };

    const handleRemoveItem = (itemToRemove) => {
        // Cập nhật danh sách các món ăn đã chọn
        setSelectedItems(prevItems => prevItems.filter(item => item !== itemToRemove));

        // Cập nhật tổng số tiền
        setTotalAmount(prevTotal => {
            const itemPrice = parseInt(itemToRemove.gia.replace(/\./g, ''), 10);
            const currentTotal = typeof prevTotal === 'string' ? parseInt(prevTotal.replace(/\./g, ''), 10) : prevTotal;
            return currentTotal - itemPrice; // Giảm giá trị
        });
    };

    const handlePayment = () => {
        navigate(`/payment`, {
            state: {
                selectedSeats,
                totalAmount,
                selectedTime,
                ticketPrice,
                selectedSeatIds,
                movieDetail,
                showtimeState: showtime,
                items: selectedItems
            }
        });
    };
    return (
        <>
            <div className="container mx-auto py-8 mt-16 px-32">
                <h1 className="text-center text-3xl font-bold mb-8 text-white">Thực Đơn</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Món ăn 1 */}
                    {data?.data?.map(item => (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-20%</div>
                            <div className="p-4">
                                <p className="text-sm line-through text-gray-400">Giá cũ: </p>
                                <p className="font-bold text-lg text-green-400">Giá mới: {item.gia}đ</p>
                                <p className="font-bold text-xl text-white">{item.ten_do_an}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                    <span className="text-sm ml-2 text-gray-400">(100 lượt đánh giá)</span>
                                </div>
                                <p className="text-sm text-gray-400">Đã bán: 200</p>

                                <button onClick={() => handlePurchase(item)} className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300">Mua</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 space-y-8">
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
                                    <th className="text-right py-2">Hành động</th>
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
                                        <td className="text-right py-2">
                                            <button
                                                onClick={() => handleRemoveItem(item)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </td>
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
                <div className="text-center mt-8">
                    <button onClick={handlePayment} className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-600 transition">Thanh Toán</button>
                </div>
            </div>
        </>
    );
};

export default FoodMenu;