import Seat from "./Seat";
import Time from "./Time";

const Box = () => {
    return (
        <>
            <div>
                <div className="w-full mx-auto">
                    <div className="w-full flex justify-center items-center bg-[#1A1D23] ">
                        <div className="text-center bg-red-600 px-4 py-2 rounded mr-2">
                            <div className="text-sm">Th. 10</div>
                            <div className="text-2xl font-bold">04</div>
                            <div className="text-sm">Thứ sáu</div>
                        </div>
                        <div className="text-center  px-4 py-2 rounded mr-2">
                            <div className="text-sm">Th. 11</div>
                            <div className="text-2xl font-bold">05</div>
                            <div className="text-sm">Thứ bẩy</div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-orange-500 font-semibold">Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.</p>
                    </div>
                    <Time />
                    <Seat />
                </div>
            </div>

        </>
    );
}
export default Box;