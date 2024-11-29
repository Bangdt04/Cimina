import MembershipData from "./MembershipData";
import { useState } from "react";
import MembershipHead from "./MembershipHead";

function MembershipPage() {
    return (
        <div className="p-4 bg-gray-900 mb-3 flex flex-col rounded-lg">
            <MembershipHead />
            <MembershipData />
        </div>
    );
}

export default MembershipPage;