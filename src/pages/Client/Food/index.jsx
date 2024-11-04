import { useEffect, useState } from 'react';
import './food.scss';
import { useGetFoods } from '../../../hooks/api/useFoodApi';
import { useParams } from 'react-router-dom';
const FoodMenu = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedTime, setSelectedTime] = useState("");
    const { id } = useParams();

    const { data, isLoading } = useGetFoods();

    useEffect(() => {
        // const movie = moviesData.find(movie => movie.id === parseInt(id));
        // setMovieDetails(movie);

        if (location.state) {
            setSelectedSeats(location.state.selectedSeats);
            setTotalAmount(location.state.totalAmount);
            setSelectedTime(location.state.selectedTime);
        }
    }, [id, location.state]);

    return (
        <>
            <div className="container mx-auto py-8 mt-16 px-32">
                <h1 className="text-center text-3xl font-bold mb-8 text-white">Thực Đơn</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Món ăn 1 */}
                    {data?.data?.map(item => (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-20%</div>
                            <div className="p-4">
                                <p className="text-sm line-through text-gray-400">Giá cũ: </p>
                                <p className="font-bold text-lg text-green-400">Giá mới: {item.gia}đ</p>
                                <p className="font-bold text-xl text-white">{item.ten_do_an}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                    <span className="text-sm ml-2 text-gray-400">(100 lượt đánh giá)</span>
                                </div>
                                <p className="text-sm text-gray-400">Đã bán: 200</p>

                                <button className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300">Mua</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 space-y-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin phim</h2>
                        <div className="space-y-2">
                            {/* <p><span className="font-semibold">Phim:</span> {movieDetails.title}</p>
                            <p><span className="font-semibold">Ghế:</span> {selectedSeats.join(", ")}</p>
                            <p><span className="font-semibold">Giờ chiếu:</span> {selectedTime}</p>
                            <p><span className="font-semibold">Ngày chiếu:</span> {movieDetails.room || "24/10/2024"}</p>
                            <p><span className="font-semibold">Phòng chiếu:</span> {movieDetails.room || "12"}</p>
                            <p><span className="font-semibold">Định dạng:</span> {movieDetails.format || "2D"}</p> */}
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Thông tin thanh toán</h2>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-2">Danh mục</th>
                                    <th className="text-left py-2">Số lượng</th>
                                    <th className="text-right py-2">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">Ghế ({selectedSeats.join(", ")})</td>
                                    <td className="py-2">{selectedSeats.length}</td>
                                    <td className="text-right py-2">{totalAmount.toLocaleString()}đ</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <button className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-600 transition">Thanh Toán</button>
                </div>
            </div>
        </>
    );
};

export default FoodMenu;