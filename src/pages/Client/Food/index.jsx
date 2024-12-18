import { useEffect, useState, useMemo } from 'react';
import './food.scss';
import { useGetFoods } from '../../../hooks/api/useFoodApi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getInfoAuth } from '../../../utils/storage';

const FoodMenu = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [movieDetail, setMovieDetail] = useState({});
    const [showtime, setShowtime] = useState({});
    const [ticketPrice, setTicketPrice] = useState(0);
    const info = getInfoAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedItems, setSelectedItems] = useState({});
    const { data, isLoading } = useGetFoods();

    useEffect(() => {
        if (location.state) {
            const {
                selectedSeats = [],
                totalAmount = 0,
                selectedTime = "",
                selectedSeatIds = [],
                movieDetail = {},
                showtimeState = {}
            } = location.state;

            setSelectedSeats(selectedSeats);
            setTotalAmount(totalAmount);
            setTicketPrice(totalAmount);
            setSelectedTime(selectedTime);
            setSelectedSeatIds(selectedSeatIds);
            setMovieDetail(movieDetail);
            setShowtime(showtimeState);
        }
    }, [id, location.state]);

    function convertDateString(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return day + "-" + month + "-" + year;
    }

    const handlePurchase = (item, action) => {
        const itemPrice = parseInt(item.gia.replace(/\./g, ''), 10);
    
        setSelectedItems((prevItems) => {
            const newItems = { ...prevItems };
    
            if (action === 'add') {
                if (!newItems[item.id]) {
                    newItems[item.id] = { ...item, quantity: 1 };
                } else {
                    newItems[item.id] = {
                        ...newItems[item.id],
                        quantity: newItems[item.id].quantity + 1,
                    };
                }
            } else if (action === 'remove' && newItems[item.id]) {
                if (newItems[item.id].quantity > 1) {
                    newItems[item.id] = {
                        ...newItems[item.id],
                        quantity: newItems[item.id].quantity - 1,
                    };
                } else {
                    delete newItems[item.id];
                }
            }
            return newItems;
        });
    };
    

    // Recalculate totalAmount when selectedItems or ticketPrice changes
    useEffect(() => {
        const updatedTotal = Object.values(selectedItems).reduce((total, item) => {
            const itemPrice = parseInt(item.gia.replace(/\./g, ''), 10);
            return total + item.quantity * itemPrice;
        }, ticketPrice); // Include ticket price in the calculation
        setTotalAmount(updatedTotal);
    }, [selectedItems, ticketPrice]);

    const handlePayment = () => {
        const path = info['vai_tro'] === 'admin' ? `/admin/bookings/payment/${id}` : `/payment`;
        navigate(path, {
            state: {
                selectedSeats,
                totalAmount,
                selectedTime,
                ticketPrice,
                selectedSeatIds,
                movieDetail: location.state?.movieDetail || {},
                showtimeState: showtime,
                items: selectedItems,
                date: convertDateString(location.state?.availableShowtimes || "1970-01-01"),
                timeId: location.state?.timeId || ""
            }
        });
    };

    const processSelectedSeats = (seats) => {
        const seatCount = seats.reduce((acc, seat) => {
            acc[seat] = (acc[seat] || 0) + 1;
            return acc;
        }, {});

        const processedSeats = seats.filter(seat => {
            const count = seatCount[seat];
            return count % 2 !== 0; // Loại bỏ ghế có số lần xuất hiện chia hết cho 2
        });

        const uniqueSeats = Array.from(new Set(processedSeats)); // Ensure unique seat list
        return uniqueSeats;
    };

    const displayedSeats = useMemo(() => processSelectedSeats(selectedSeatIds), [selectedSeatIds]);

    return (
        <div className="container mx-auto py-8 mt-16 px-32">
            <h1 className="text-center text-3xl font-bold mb-8 text-white">Thực Đơn</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data?.data?.map(item => (
                    <div key={item.ten_do_an} className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                        <img src={`http://127.0.0.1:8000${item?.anh_do_an}`} alt={item.ten_do_an} style={{ width: '500px', height: '300px' }} />
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-20%</div>
                        <div className="p-4">
                            <p className="font-bold text-lg text-green-400">Giá: {Number(item.gia).toLocaleString()}đ</p>
                            <p className="font-bold text-xl text-white">{item.ten_do_an}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                <span className="text-sm ml-2 text-gray-400">(100 lượt đánh giá)</span>
                            </div>
                            <p className="text-sm text-gray-400">Đã bán: 200</p>
                            <div className="flex items-center mt-4">
                                <button
                                    onClick={() => handlePurchase(item, 'remove')}
                                    className={`px-2 py-1 bg-gray-600 text-white rounded ${!selectedItems[item.id]?.quantity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'}`}
                                    disabled={!selectedItems[item.id]?.quantity}
                                >
                                    -
                                </button>
                                <span className="mx-2">{selectedItems[item.id]?.quantity || 0}</span>
                                <button
                                    onClick={() => handlePurchase(item, 'add')}
                                    className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin phim</h2>
                    <div className="space-y-2">
                        <p><span className="font-semibold">Phim:</span> {movieDetail.ten_phim}</p>
                        <p><span className="font-semibold">Giờ chiếu:</span> {selectedTime}</p>
                        <p><span className="font-semibold">Ngày chiếu:</span> {convertDateString(location.state?.availableShowtimes || "1970-01-01")}</p>
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
                            <tr>
                                <td className="py-2">Ghế ({displayedSeats.join(', ')})</td>
                                <td className="py-2">{selectedSeats.length}</td>
                                <td className="text-right py-2">{ticketPrice.toLocaleString()}đ</td>
                            </tr>
                            {Object.keys(selectedItems).map((key, index) => {
                                const item = selectedItems[key];
                                return (
                                    <tr key={index}>
                                        <td className="py-2">{item.ten_do_an}</td>
                                        <td className="py-2">{item.quantity}</td>
                                        <td className="text-right py-2">{(item.quantity * parseInt(item.gia.replace(/\./g, ''), 10)).toLocaleString()}đ</td>
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
            <div className="text-center mt-8">
                <button onClick={handlePayment} className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition">
                    Thanh Toán
                </button>
            </div>
        </div>
    );
};

export default FoodMenu;