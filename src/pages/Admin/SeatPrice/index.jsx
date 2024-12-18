import SeatPriceData from "./SeatPriceData";
import { useState } from "react";
import SeatPriceHead from "./SeatPriceHead";

function SeatPricePage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="p-4 bg-gray-700 mb-3 flex flex-col rounded-lg">
            <SeatPriceHead />
            <SeatPriceData params={params} setParams={setParams} />
        </div>
    );
}

export default SeatPricePage;