import VoucherData from "./VoucherData";
import { useState } from "react";
import VoucherHead from "./VoucherHead";

function VoucherPage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="p-4 bg-gray-700 mb-3 flex flex-col rounded-lg">
            <VoucherHead />
            <VoucherData params={params} setParams={setParams} />
        </div>
    );
}

export default VoucherPage;