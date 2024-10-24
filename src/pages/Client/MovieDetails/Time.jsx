import { useState, useEffect } from 'react';

const Time = ({ selectedDate, onTimeSelect, selectedTime }) => {
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        const fetchAvailableTimes = (date) => {
            const allTimes = ['10:10', '12:35', '14:00', '15:00', '20:00'];
            
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            
            return allTimes.filter(time => {
                if (!isToday) return true;
                
                const [hours, minutes] = time.split(':').map(Number);
                const showTime = new Date(date);
                showTime.setHours(hours, minutes, 0, 0);
                
                return showTime > now;
            });
        };

        setAvailableTimes(fetchAvailableTimes(selectedDate));
    }, [selectedDate]);

    return (
        <>
            <div className="grid grid-cols-4 gap-4 mt-4 text-center px-64 mb-16">
                {availableTimes.map((time, index) => (
                    <div 
                        key={index} 
                        className={`btn-border-radius hover-background py-2 rounded-full flex justify-center items-center cursor-pointer ${
                            time === selectedTime ? 'bg-red-600' : ''
                        }`}
                        onClick={() => onTimeSelect(time)}
                    >
                        {time}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Time;