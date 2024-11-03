import SeatData from "./SeatData";
import { useState } from "react";
import SeatHead from "./SeatHead";

function SeatPage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="category-container">
            <SeatHead />
            <SeatData params={params} setParams={setParams} />
        </div>
    );
}

export default SeatPage;