import { useParams } from "react-router-dom";
import { useGetShowtimeById } from "../../../hooks/api/useMovieApi";

const Time = ({ selectedDate, onTimeSelect, selectedTime, availableShowtimes }) => {
    const { id } = useParams();
    const { data, isLoading } = useGetShowtimeById(id, availableShowtimes);
    console.log(data);

    
    const formatTime = (fullTime) => {
        return fullTime.slice(0, 5); 
    };

  
    const isShowtimeInThePastOrCurrent = (showtime) => {
        const currentTime = new Date();
        const showtimeDate = new Date(selectedDate);
        const [hours, minutes] = showtime.gio_chieu.split(':');
        showtimeDate.setHours(hours, minutes, 0, 0); // Set hours and minutes for the showtime

        return currentTime >= showtimeDate; 
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mt-4 text-center px-4 sm:px-8 md:px-16 lg:px-64 mb-16">
            {data?.showtimes?.length > 0 ? (
                data.showtimes.map(showtime => (
                    <div 
                        key={showtime.id}
                        className={`btn-border-radius hover-background py-2 rounded-full flex justify-center items-center cursor-pointer text-sm sm:text-base ${
                            selectedTime === showtime.gio_chieu ? 'bg-red-600 text-white' : ''
                        } ${isShowtimeInThePastOrCurrent(showtime) ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable cursor and reduce opacity
                        onClick={() => !isShowtimeInThePastOrCurrent(showtime) && onTimeSelect(showtime.id, formatTime(showtime.gio_chieu))}
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