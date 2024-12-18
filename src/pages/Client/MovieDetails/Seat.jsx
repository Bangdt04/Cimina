import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notification, Spin } from 'antd';
import { getInfoAuth, getTokenOfUser } from '../../../utils/storage';
import RoomList from './RoomList';
import axios from 'axios';


const Seat = ({ timeId, availableShowtimes, selectedDate, selectedTime, detail }) => {
    const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [movieDetail, setMovieDetail] = useState(detail);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const accessToken = getTokenOfUser();
    const info = getInfoAuth();
    const navigate = useNavigate();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [api, contextHolder] = notification.useNotification();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`http://127.0.0.1:8000/api/movie-detail/${id}/showtime-date/${availableShowtimes}/${selectedTime}`);
                console.log(result)
                setData(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);
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

    if (!data) {
        return <Spin size="large" className='flex items-center justify-center'></Spin>;
    }

    const rooms = data?.roomsWithSeats;

    if (!rooms) {
        return <center className='mb-4'>Không có phòng đang chiếu phim này.</center>;
    }

    const toggleSeatSelection = async (seat) => {

        if (!accessToken) {
            notification.error({
                message: `Cảnh báo`,
                description:
                    `Vui lòng đăng nhập để có thể chọn ghế`,
                placement: "topRight",
            });
            return;
        }


        if (seat.trang_thai === 1) {
            notification.error({
                message: `Cảnh báo`,
                description:
                    `Ghế ${seat.ten_ghe_ngoi} đã được đặt!`,
                placement: "topRight",
            });
            return;
        }


        const seatData = {
            ghengoi_id: seat.id,
            thongtinchieu_id: timeId
        };
        console.log(seatData);
        setSelectedSeats((prev) => {
            const isSelected = prev.includes(seat.id);
            const updatedSeats = isSelected ? prev.filter(id => id !== seat.id) : [...prev, seat.id];
            const seatAdditionalPrice = Number(seat.gia_ghe) || 0;
            const priceChange = isSelected ? -( seatAdditionalPrice) : (seatAdditionalPrice);

            console.log("TICKET PRICE", priceChange);

            setTotalPrice(prevPrice => prevPrice + priceChange);

            return updatedSeats;
        });


        setSelectedSeatIds((prev) => {
            const isSelected = prev.includes(seat.id); 
            const updatedSeats = isSelected 
                ? prev.filter(id => id !== seat.id) 
                : [...prev, seat.ten_ghe_ngoi]; 
        
            return updatedSeats; 
        });

        try {

            await axios.post(`http://127.0.0.1:8000/api/select-seat`, seatData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });


           
        } catch (error) {
            console.error("Error selecting seat:", error);
            notification.error({
                message: `Cảnh báo`,
                description:
                    `Đã xảy ra lỗi khi chọn ghế. Vui lòng thử lại.`,
                placement: "topRight",
            });
        }
    };

    const renderSeat = (seat, room) => {
        setSelectedRoom(room);
        let seatClass = 'flex items-center justify-center text-white font-bold cursor-pointer';

        if (seat.trang_thai === "Đã đặt" ) {
            seatClass += ' bg-gray-700';
            return (
                <div key={seat.id} className={`w-10 h-10 m-1 text-xs font-bold rounded  ${seatClass}`}>
                    X
                </div>
            );
        }

        console.log(seat , info?.id)
        if (seat?.user_id !== info?.id) {
            if (seat.trang_thai === "Ghế đang trong hàng đợi") {
                seatClass += ' bg-gray-700';
                return (
                    <div key={seat.id} className={`w-10 h-10 m-1 text-xs font-bold rounded  ${seatClass}`}>
                        ...
                    </div>
                );
            }
        }

        if (seat.trang_thai === "Bảo trì") {
            seatClass += ' bg-red-700';
            return (
                <div key={seat.id} className={`w-10 h-10 m-1 text-xs font-bold rounded  ${seatClass}`}>
                   🛠️
                </div>
            );
        }
        switch (seat.loai_ghe_ngoi?.toLowerCase()) { // Chuyển tất cả về chữ thường
            case 'vip': // Ghế VIP
                seatClass += ' bg-orange-400';
                break;
            case 'thường': // Ghế thường
                seatClass += ' bg-gray-600';
                break;
            case 'đôi': // Ghế đôi
                seatClass += ' bg-red-400';
                break;
            default: // Mặc định là ghế thường
                seatClass += ' bg-gray-600';
        }



        if (selectedSeats.includes(seat.id)|| seat?.user_id === info?.id) {
            seatClass = seatClass.replace(/bg-\w+-\d+/, 'bg-blue-500 ');
        }

        return (
            <div key={seat.id} className={`w-10 h-10 m-1 text-xs font-bold rounded ${seatClass}`} onClick={() => toggleSeatSelection(seat)}>
                {seat.ten_ghe_ngoi}
            </div>
        );
    };

    const handleRoomChange = () => {
        setTotalPrice(0);
        setSelectedSeats([])
        setSelectedSeatIds([])
    };
    const handleFood = () => {
        const path = info['vai_tro'] === 'admin' ? `/admin/bookings/food/${id}` : `/food/${id}`;
   
        navigate(path, {
            state: {
                selectedSeats,
                totalAmount: totalPrice,
                selectedDate,
                selectedTime,
                selectedSeatIds,
                movieDetail,
                showtimeState: selectedRoom,
                availableShowtimes: availableShowtimes,
                timeId
            }
        });
    };

    return (
        <div className="bg-gray-900 text-white p-6 relative">
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
                <RoomList rooms={rooms} renderSeat={renderSeat} handleRoomChange={handleRoomChange} />
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-700 mr-2 flex items-center justify-center text-white font-bold">X</div>
                        <span>Đã đặt</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-700 mr-2 flex items-center justify-center text-white font-bold">...</div>
                        <span>Đang được chọn</span>
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
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-700 mr-2 text-white font-bold"  >🛠️</div>
                        <span>Ghế bảo trì</span>
                    </div>
                    
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-lg mb-2">Ghế đã chọn: <span className="font-bold">
                                {selectedSeats.map(seatId => (
                                    <span key={seatId}>{selectedRoom.seats?.find(seat => seat.id === seatId)?.ten_ghe_ngoi} </span>
                                ))}
                            </span></p>
                            <p className="text-lg">Tổng tiền: <span className="font-bold text-green-400">{totalPrice.toLocaleString()}đ</span></p>
                        </div>
                        <div className="flex space-x-4">
                            {accessToken ? (
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
                            ) : (
                                <p className="text-red-500">Vui lòng đăng nhập trước khi đặt vé.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seat;