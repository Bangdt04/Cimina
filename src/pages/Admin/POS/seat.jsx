import { useLocation, useNavigate } from "react-router-dom";
import Seat from "../../Client/MovieDetails/Seat";



function SeatChoosePage() {
    const navigate = useNavigate();
    const location = useLocation();
    console.log("MOVIE DETAIL", location.state.detail)


    return (
        <div className="p-4 bg-gray-900 mb-3 flex flex-col rounded-lg">
            <Seat
                timeId={location.state.detail.id}
                availableShowtimes={location.state.day}
                selectedDate={location.state.day}
                selectedTime={location.state.time}
                detail={location.state.detail?.movie} />
        </div>
    );
}

export default SeatChoosePage;