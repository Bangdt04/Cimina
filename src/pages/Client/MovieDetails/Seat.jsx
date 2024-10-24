import { useState, useEffect } from 'react';

const Seat = ({ selectedTime }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
    const [notification, setNotification] = useState(null);

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

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
    };

    const getSeatPrice = (seatType) => {
        switch (seatType) {
            case 'vip': return 150000;
            case 'double': return 200000;
            default: return 100000;
        }
    };

    const getPairedSeatId = (seatId) => {
        const row = seatId.charAt(0);
        const number = parseInt(seatId.slice(1));
        if (number % 2 === 0) {
            return `${row}${(number - 1).toString().padStart(2, '0')}`;
        } else {
            return `${row}${(number + 1).toString().padStart(2, '0')}`;
        }
    };

    const toggleSeat = (seatId) => {
        const seatType = getSeatType(seatId);
        if (seatType === 'double') {
            const pairSeatId = getPairedSeatId(seatId);
            setSelectedSeats(prevSeats => {
                if (prevSeats.includes(seatId)) {
                    return prevSeats.filter(id => id !== seatId && id !== pairSeatId);
                } else {
                    if (isBooked(seatId) || isBooked(pairSeatId)) {
                        showNotification("Một hoặc cả hai ghế đôi đã được đặt.");
                        return prevSeats;
                    }
                    return [...prevSeats, seatId, pairSeatId];
                }
            });
        } else {
            setSelectedSeats(prevSeats => {
                if (prevSeats.includes(seatId)) {
                    if (wouldCreateGap(seatId, prevSeats)) {
                        showNotification("Sẽ tạo ghế trống ở giữa hai ghế. Quý khách nên hủy ghế lần lượt theo thứ tự.");
                        return prevSeats;
                    }
                    return prevSeats.filter(id => id !== seatId);
                } else if (isValidSelection(seatId, prevSeats)) {
                    return [...prevSeats, seatId];
                } else {
                    showNotification("Không thể chọn ghế này. Vui lòng chọn ghế liền kề hoặc không để trống 1 ghế.");
                    return prevSeats;
                }
            });
        }
    };
    
    const wouldCreateGap = (seatId, currentSeats) => {
        const row = seatId.charAt(0);
        const number = parseInt(seatId.slice(1));
        const maxSeatNumber = row === 'K' ? 12 : 14;
    
        const leftSeat = number > 1 ? `${row}${(number - 1).toString().padStart(2, '0')}` : null;
        const rightSeat = number < maxSeatNumber ? `${row}${(number + 1).toString().padStart(2, '0')}` : null;
    
        const isLeftmostSelected = !leftSeat || !currentSeats.includes(leftSeat);
        const isRightmostSelected = !rightSeat || !currentSeats.includes(rightSeat);
    
        if (!isLeftmostSelected && !isRightmostSelected) {
            return true;
        }
    
        return false;
    };

    const isValidSelection = (seatId, currentSeats) => {
        const row = seatId.charAt(0);
        const number = parseInt(seatId.slice(1));
        const maxSeatNumber = row === 'K' ? 12 : 14;

        const leftSeat = number > 1 ? `${row}${(number - 1).toString().padStart(2, '0')}` : null;
        const rightSeat = number < maxSeatNumber ? `${row}${(number + 1).toString().padStart(2, '0')}` : null;

        const hasAdjacentSelected = (leftSeat && currentSeats.includes(leftSeat)) || (rightSeat && currentSeats.includes(rightSeat));

        const isSecondSeat = number === 2;
        const isSecondToLastSeat = number === maxSeatNumber - 1;

        if (isSecondSeat && !currentSeats.includes(`${row}01`) && !hasAdjacentSelected) {
            return false;
        }

        if (isSecondToLastSeat && !currentSeats.includes(`${row}${maxSeatNumber.toString().padStart(2, '0')}`) && !hasAdjacentSelected) {
            return false;
        }

        for (let i = 1; i <= maxSeatNumber; i++) {
            const currentSeatId = `${row}${i.toString().padStart(2, '0')}`;
            const nextSeatId = `${row}${(i + 1).toString().padStart(2, '0')}`;
            const nextNextSeatId = `${row}${(i + 2).toString().padStart(2, '0')}`;

            if (currentSeats.includes(currentSeatId) && currentSeats.includes(nextNextSeatId) && !currentSeats.includes(nextSeatId)) {
                if (seatId === nextSeatId) {
                    return true;
                }
            }
        }

        if (hasAdjacentSelected) {
            return true;
        }

        const leftLeftSeat = number > 2 ? `${row}${(number - 2).toString().padStart(2, '0')}` : null;
        const rightRightSeat = number < maxSeatNumber - 1 ? `${row}${(number + 2).toString().padStart(2, '0')}` : null;

        const createsGap = (leftLeftSeat && currentSeats.includes(leftLeftSeat) && !currentSeats.includes(leftSeat)) ||
                           (rightRightSeat && currentSeats.includes(rightRightSeat) && !currentSeats.includes(rightSeat));

        return !createsGap;
    };

    const getSeatType = (seatId) => {
        const row = seatId.charAt(0);
        const number = parseInt(seatId.slice(1));
        if (row === 'K') return 'double';
        if (['D', 'E', 'F', 'G', 'H', 'I'].includes(row) && number >= 3 && number <= 12) return 'vip';
        return 'regular';
    };

    const isBooked = (seatId) => {
        const bookedSeats = ['D4', 'D5', 'E6', 'E7', 'E8', 'E9', 'E10', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'H6', 'H7', 'H8', 'H9', 'I6', 'I7', 'I8', 'I9', 'J6', 'J7', 'K5', 'K6'];
        return bookedSeats.includes(seatId);
    };

    const renderSeat = (seatId) => {
        const isSelected = selectedSeats.includes(seatId);
        const seatType = getSeatType(seatId);
        const booked = isBooked(seatId);

        let bgColor = 'bg-gray-700';
        if (isSelected) bgColor = 'bg-blue-500';
        else if (seatType === 'vip') bgColor = 'bg-orange-400';
        else if (seatType === 'double') bgColor = 'bg-red-400';
        else if (!booked) bgColor = 'bg-gray-600';

        return (
            <button
                key={seatId}
                className={`w-10 h-10 m-1 text-xs font-bold rounded ${bgColor} ${booked ? 'cursor-not-allowed' : 'hover:opacity-80'}`}
                onClick={() => !booked && toggleSeat(seatId)}
                disabled={booked}
            >
                {booked ? 'X' : seatId}
            </button>
        );
    };

    const renderRow = (row, seats) => (
        <div key={row} className="flex justify-center">
            {seats.map(seat => renderSeat(`${row}${seat.toString().padStart(2, '0')}`))}
        </div>
    );

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seatId) => {
            return total + getSeatPrice(getSeatType(seatId));
        }, 0);
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
                <h2 className="text-center text-2xl font-bold mb-8">Phòng chiếu số 7</h2>
                <div className="mb-12 bg-gray-800 p-8 rounded-lg shadow-xl overflow-x-auto">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => 
                        renderRow(row, Array.from({length: 14}, (_, i) => i + 1))
                    )}
                    {renderRow('K', Array.from({length: 12}, (_, i) => i + 1))}
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
                            <p className="text-lg mb-2">Ghế đã chọn: <span className="font-bold">{selectedSeats.join(', ')}</span></p>
                            <p className="text-lg">Tổng tiền: <span className="font-bold text-green-400">{calculateTotal().toLocaleString()}đ</span></p>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300">Quay lại</button>
                            <button 
                                className={`px-6 py-2 rounded-full transition duration-300 ${
                                    selectedSeats.length > 0 
                                    ? 'bg-red-600 text-white hover:bg-red-500 cursor-pointer' 
                                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                }`}
                                disabled={selectedSeats.length === 0}
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seat;