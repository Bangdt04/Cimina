import RoomData from "./RoomData";
import { useState } from "react";
import RoomHead from "./RoomHead";

function RoomPage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="category-container">
            <RoomHead />
            <RoomData params={params} setParams={setParams} />
        </div>
    );
}

export default RoomPage;