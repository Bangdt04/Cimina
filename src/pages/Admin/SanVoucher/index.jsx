import SanVoucherData from "./SanVoucherData";
import { useState } from "react";
import SanVoucherHead from "./SanVoucherHead";

function SanVoucherPage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="p-4 bg-gray-700 mb-3 flex flex-col rounded-lg">
            <SanVoucherHead />
            <SanVoucherData params={params} setParams={setParams} />
        </div>
    );
}

export default SanVoucherPage;