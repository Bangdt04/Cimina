import MemberData from "./MemberData";
import { useState } from "react";
import MemberHead from "./MemberHead";

function MemberPage() {
    return (
        <div className="p-4 bg-gray-700 mb-3 flex flex-col rounded-lg">
            <MemberHead />
            <MemberData />
        </div>
    );
}

export default MemberPage;