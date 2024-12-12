import { useParams } from "react-router-dom";
import { useGetShowtimeById } from "../../../hooks/api/useMovieApi";

const Time = ({ selectedDate, onTimeSelect, selectedTime, availableShowtimes }) => {
    const { id } = useParams();
    const { data, isLoading } = useGetShowtimeById(id, availableShowtimes);
    
    // Function to format time to HH:MM
    const formatTime = (fullTime) => {
        return fullTime.slice(0, 5); // This will extract only HH:MM
    };
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mt-4 text-center px-4 sm:px-8 md:px-16 lg:px-64 mb-16">
            {data?.showtimes?.length > 0 ? (
                data?.showtimes?.map(showtime => (
                    <div 
                        key={showtime.id}
                        className={`btn-border-radius hover-background py-2 rounded-full flex justify-center items-center cursor-pointer text-sm sm:text-base ${
                            selectedTime === showtime.gio_chieu ? 'bg-red-600 text-white' : ''
                        }`}
                        onClick={() => onTimeSelect(showtime.id, formatTime(showtime.gio_chieu))}
                    >
                        {formatTime(showtime.gio_chieu)}
                    </div>
                ))
            ) : (
                <p className="col-span-full text-red-500">Không có suất chiếu cho ngày đã chọn.</p>
            )}
        </div>
    );
}

export default Time;