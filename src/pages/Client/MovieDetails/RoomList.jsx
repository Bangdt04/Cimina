import React, { useState } from 'react';

const RoomList = ({ rooms, renderSeat, handleRoomChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1; 
    const totalPages = Math.ceil(rooms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

    const handlePreviousRoom = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            handleRoomChange(); 
        }
    };

    const handleNextRoom = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            handleRoomChange(); 
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {currentRooms.length > 0 ? (
                currentRooms.map((room) => {
                    // Calculate seats and assign rows
                    const seatsWithRows = room.seats.map((seat, index) => ({
                        ...seat,
                        row: Math.floor(index / 10) + 1 // Assuming 10 seats per row
                    }));

                    // Group seats by row
                    const seatsByRow = seatsWithRows.reduce((acc, seat) => {
                        const row = seat.row;
                        if (!acc[row]) {
                            acc[row] = [];
                        }
                        acc[row].push(seat);
                        return acc;
                    }, {});

                    return (
                        <div key={room.id} className="room mb-8">
                            <h2 className="text-center text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
                                {room.room?.ten_phong_chieu}
                            </h2>
                            <div className="mb-8 sm:mb-12 bg-gray-800 p-4 sm:p-8 rounded-lg shadow-xl overflow-x-auto">
                                <div className="flex flex-col items-center space-y-2">
                                    {Object.keys(seatsByRow).map(row => (
                                        <div 
                                            key={row} 
                                            className="flex justify-center space-x-1 sm:space-x-2"
                                        >
                                            {seatsByRow[row].map(seat => renderSeat(seat, room))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center text-gray-500">Không có phòng chiếu nào</div>
            )}

            {/* Responsive Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                <button
                    onClick={handlePreviousRoom}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="text-center">
                    Phòng {currentPage} / {totalPages}
                </span>
                <button
                    onClick={handleNextRoom}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default RoomList;