import { useState } from "react";
import BookingHead from "./BookingHead";
import BookingData from "./BookingData";

function BookingPage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="p-4 bg-gray-700 mb-3 flex flex-col rounded-lg">
            <BookingHead />
            <BookingData params={params} setParams={setParams} />
        </div>
    );
}

export default BookingPage;