

const ShedulePage = () => {
    return (
        <>
            <div className="flex justify-center py-10 mt-16 px-32">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold">
                            Phim đang chiếu
                        </h1>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button className="bg-red-600 date-button py-2 px-4 rounded-lg">
                                28-09-2024
                            </button>
                            <button className="date-button-inactive border py-2 px-4 rounded-lg">
                                29-09-2024
                            </button>
                            <button className="date-button-inactive border py-2 px-4 rounded-lg">
                                30-09-2024
                            </button>
                        </div>
                        <p className="text-yellow-600 note mt-4">
                            Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="movie-card p-4 flex space-x-4 border rounded-3xl">
                            <div className="movie-poster hover-zoom">
                                <img alt="Movie poster of Transformers" className="w-[300px] h-[250px] rounded-lg"  src="https://storage.googleapis.com/a1aa/image/nt40f2myFY1pTSsne6XG6ReqiEmwqnVBf1cSf0U84RQ8mU6cC.jpg" width="100" />
                            </div>
                            <div>
                                <p className="text-sm">
                                    Hành động 104 Phút
                                </p>
                                <h2 className="title text-lg font-bold">
                                    TRANSFORMERS MỘT-T13 (Phụ đề)
                                </h2>
                                <p className="text-sm">
                                    Xuất xứ: Mỹ
                                </p>
                                <p className="text-sm">
                                    Khởi chiếu: 27-09-2024
                                </p>
                                <p className=" text-red-600 warning text-sm">
                                    Kiểm duyệt: T13 - Phim được phổ biến đến người xem từ đủ 13 tuổi trở lên (13+)
                                </p>
                                <p className="text-sm mt-2 font-bold">
                                    Lịch chiếu
                                </p>
                                <div className="flex space-x-2 mt-1">
                                    <button className="bg-[#fff0] text-white border py-1 px-2 rounded-lg">
                                        10:20
                                    </button>
                                    <button className="bg-[#fff0] text-white border py-1 px-2 rounded-lg">
                                        12:20
                                    </button>
                                    <button className="bg-[#fff0] text-white border py-1 px-2 rounded-lg">
                                        14:20
                                    </button>
                                    <button className="bg-[#fff0] text-white border py-1 px-2 rounded-lg">
                                        16:20
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShedulePage;