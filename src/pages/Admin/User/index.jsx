import UserData from "./UserData";
import { useState } from "react";
import UserHead from "./UserHead";

function UserPage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="p-4 bg-gray-700 mb-3 flex flex-col rounded-lg">
            <UserHead />
            <UserData params={params} setParams={setParams} />
        </div>
    );
}

export default UserPage;