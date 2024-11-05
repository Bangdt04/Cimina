
const Time = ({ selectedDate, onTimeSelect, selectedTime, availableShowtimes }) => {
    return (
        <div className="grid grid-cols-4 gap-4 mt-4 text-center px-64 mb-16">
            {availableShowtimes.length > 0 ? (
                availableShowtimes.map(showtime => (
                    <div 
                        key={showtime.id}
                        className={`btn-border-radius hover-background py-2 rounded-full flex justify-center items-center cursor-pointer ${
                            selectedTime === showtime.gio_chieu ? 'bg-red-600' : ''
                        }`}
                        onClick={() => onTimeSelect(showtime.gio_chieu)}
                    >
                        {showtime.gio_chieu}
                    </div>
                ))
            ) : (
                <p className=" text-red-500">Không có suất chiếu cho ngày đã chọn.</p>
            )}
        </div>
    );
}

export default Time;