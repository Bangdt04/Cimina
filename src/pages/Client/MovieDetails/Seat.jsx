import { useState, useEffect } from 'react';
import { useGetMovieDetailById } from '../../../hooks/api/useMovieApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { getTokenOfUser } from '../../../utils/storage';

const Seat = ({ selectedDate, selectedTime }) => {
    const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
    const { id } = useParams();
    const { data, isLoading } = useGetMovieDetailById(id);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [movieDetail, setMovieDetail] = useState(data?.['movie-detail']);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [notification, setNotification] = useState('');
    const accessToken = getTokenOfUser();
    const navigate = useNavigate();

    console.log("Access Token", accessToken)

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const seatPrice = {
        "Thường": 100000, // Giá ghế thường
        "VIP": 200000, // Giá ghế VIP
        "Double": 300000 // Giá ghế đôi
    };

    if (isLoading) {
        return <Spin size="large" className='flex items-center justify-center'></Spin>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const room = data?.['movie-detail']?.showtimes.find(showtime => showtime.gio_chieu === selectedTime)?.room;
    const showtime = data?.['movie-detail']?.showtimes.find(showtime => showtime.gio_chieu === selectedTime);
    if (!room) {
        return <div>Không có phòng đang chiếu phim này.</div>;
    }

    const toggleSeatSelection = (seat) => {
        // Kiểm tra nếu ghế đã được đặt
        if (seat.trang_thai === 1) {
            setNotification(`Ghế ${seat.so_ghe_ngoi} đã được đặt!`);
            return; // Không cho phép chọn ghế đã đặt
        }

        setNotification(''); // Xóa thông báo nếu ghế chưa đặt
        setSelectedSeats((prev) => {
            const isSelected = prev.includes(seat.id);
            const updatedSeats = isSelected ? prev.filter(id => id !== seat.id) : [...prev, seat.id];

            // Cập nhật tổng tiền
            const priceChange = isSelected ? -seatPrice[seat.loai_ghe_ngoi] : seatPrice[seat.loai_ghe_ngoi];
            setTotalPrice(prevPrice => prevPrice + priceChange);

            return updatedSeats;
        });

        setSelectedSeatIds((prev) => {
            const isSelected = prev.includes(seat.id);
            const updatedSeats = isSelected ? prev.filter(id => id !== seat.id).so_ghe_ngoi : [...prev, seat.so_ghe_ngoi];

            return updatedSeats;
        });
    };

    const renderSeat = (seat) => {
        let seatClass = 'flex items-center justify-center text-white font-bold cursor-pointer';

        // Determine the seat status
        if (seat.trang_thai === 1) {
            seatClass += ' bg-gray-700'; // Ghế đã đặt
            return (
                <div key={seat.id} className={`w-10 h-10 m-1 text-xs font-bold rounded ${seatClass}`}>
                    X
                </div>
            );
        }

        // Ghế chưa đặt
        if (selectedSeats.includes(seat.id)) {
            seatClass += ' bg-blue-500'; // Ghế đã chọn
        } else {
            // Ghế còn lại
            if (seat.loai_ghe_ngoi === "Thường") {
                seatClass += ' bg-gray-600'; // Ghế thường
            } else if (seat.loai_ghe_ngoi === "VIP") {
                seatClass += ' bg-orange-400'; // Ghế VIP
            } else if (seat.loai_ghe_ngoi === "Double") {
                seatClass += ' bg-red-400'; // Ghế đôi
            }
        }

        return (
            <div key={seat.id} className={`w-10 h-10 m-1 text-xs font-bold rounded ${seatClass}`} onClick={() => toggleSeatSelection(seat)}>
                {seat.so_ghe_ngoi}
            </div>
        );
    };

    const handleFood = () => {
        navigate(`/food/${id}`, {
            state: {
                selectedSeats,
                totalAmount: totalPrice,
                selectedDate,
                selectedTime,
                selectedSeatIds,
                movieDetail,
                showtimeState: showtime
            }
        });
    };

    
    return (
        <div className="bg-gray-900 text-white p-6 relative">
            {notification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 mt-20 rounded-md shadow-lg z-50">
                    {notification}
                </div>
            )}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between mb-6 text-lg">
                    <div>Giờ chiếu: <span className="font-bold">{selectedTime}</span></div>
                    <div className="bg-red-600 px-3 py-1 rounded-full">Thời gian chọn ghế: <span className="font-bold">{formatTime(remainingTime)}</span></div>
                </div>
                <div className='w-full h-40 relative'>
                    <img
                        src="https://chieuphimquocgia.com.vn/_next/image?url=%2Fimages%2Fscreen.png&w=1920&q=75"
                        alt="Movie Screen"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
                </div>
                <h2 className="text-center text-2xl font-bold mb-8">{room.ten_phong_chieu}</h2>
                <div className="mb-12 bg-gray-800 p-8 rounded-lg shadow-xl overflow-x-auto">
                    {room?.seat?.reduce((acc, seat, index) => {
                        if ((index + 1) % 10 === 0) {
                            acc.push(
                                <div key={index} className="flex justify-center mb-2">
                                    {room?.seat?.slice(index - 9, index + 1).map(seat => renderSeat(seat))}
                                </div>
                            );
                        }
                        return acc;
                    }, [])}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-700 mr-2 flex items-center justify-center text-white font-bold">X</div>
                        <span>Đã đặt</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-500 mr-2"></div>
                        <span>Ghế bạn chọn</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-600 mr-2"></div>
                        <span>Ghế thường</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-orange-400 mr-2"></div>
                        <span>Ghế VIP</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-400 mr-2"></div>
                        <span>Ghế đôi</span>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-lg mb-2">Ghế đã chọn: <span className="font-bold">
                                {selectedSeats.map(seatId => (
                                    <span key={seatId}>{room.seat.find(seat => seat.id === seatId).so_ghe_ngoi} </span>
                                ))}
                            </span></p>
                            <p className="text-lg">Tổng tiền: <span className="font-bold text-green-400">{totalPrice.toLocaleString()}đ</span></p>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300">Quay lại</button>

                            {accessToken && (
                                <button
                                    className={`px-6 py-2 rounded-full transition duration-300 ${selectedSeats.length > 0
                                        ? 'bg-red-600 text-white hover:bg-red-500 cursor-pointer'
                                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                        }`}
                                    disabled={selectedSeats.length === 0}
                                    onClick={handleFood}
                                >
                                    Chọn Đồ Ăn
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seat;