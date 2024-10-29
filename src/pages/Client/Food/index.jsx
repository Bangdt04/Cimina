import { useState } from 'react';
import './food.scss';
const FoodMenu = () => {
    const [quantities, setQuantities] = useState([1, 1, 1, 1]); // Mảng lưu trữ số lượng cho từng món ăn

    const increaseQuantity = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    };

    const decreaseQuantity = (index) => {
        const newQuantities = [...quantities];
        if (newQuantities[index] > 1) {
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };

    return (
        <>
            <div className="container mx-auto py-8 mt-16 px-32">
                <h1 className="text-center text-3xl font-bold mb-8 text-white">Thực Đơn</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Món ăn 1 */}
                    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                        <img alt="Promotion image for Bỏng Ngô" className="w-full h-48 object-cover" src="https://via.placeholder.com/600x400.png?text=Bỏng+Ngô" />
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-20%</div>
                        <div className="p-4">
                            <p className="text-sm line-through text-gray-400">Giá cũ: 50.000đ</p>
                            <p className="font-bold text-lg text-green-400">Giá mới: 40.000đ</p>
                            <p className="font-bold text-xl text-white">Bỏng Ngô</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                <span className="text-sm ml-2 text-gray-400">(100 lượt đánh giá)</span>
                            </div>
                            <p className="text-sm text-gray-400">Đã bán: 200</p>
                            <div className="flex items-center mt-4">
                                <button onClick={() => decreaseQuantity(0)} className="bg-gray-600 text-white py-1 px-2 rounded">-</button>
                                <span className="mx-2 text-white">{quantities[0]}</span>
                                <button onClick={() => increaseQuantity(0)} className="bg-gray-600 text-white py-1 px-2 rounded">+</button>
                            </div>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                    {/* Món ăn 2 */}
                    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                        <img alt="Promotion image for Nước Ngọt" className="w-full h-48 object-cover" src="https://via.placeholder.com/600x400.png?text=Nước+Ngọt" />
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-15%</div>
                        <div className="p-4">
                            <p className="text-sm line-through text-gray-400">Giá cũ: 30.000đ</p>
                            <p className="font-bold text-lg text-green-400">Giá mới: 25.500đ</p>
                            <p className="font-bold text-xl text-white">Nước Ngọt</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500">⭐⭐⭐⭐</span>
                                <span className="text-sm ml-2 text-gray-400">(80 lượt đánh giá)</span>
                            </div>
                            <p className="text-sm text-gray-400">Đã bán: 150</p>
                            <div className="flex items-center mt-4">
                                <button onClick={() => decreaseQuantity(1)} className="bg-gray-600 text-white py-1 px-2 rounded">-</button>
                                <span className="mx-2 text-white">{quantities[1]}</span>
                                <button onClick={() => increaseQuantity(1)} className="bg-gray-600 text-white py-1 px-2 rounded">+</button>
                            </div>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                    {/* Món ăn 3 */}
                    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                        <img alt="Promotion image for Combo Bỏng Nước" className="w-full h-48 object-cover" src="https://via.placeholder.com/600x400.png?text=Combo+Bỏng+Nước" />
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-10%</div>
                        <div className="p-4">
                            <p className="text-sm line-through text-gray-400">Giá cũ: 70.000đ</p>
                            <p className="font-bold text-lg text-green-400">Giá mới: 63.000đ</p>
                            <p className="font-bold text-xl text-white">Combo Bỏng Nước</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                <span className="text-sm ml-2 text-gray-400">(120 lượt đánh giá)</span>
                            </div>
                            <p className="text-sm text-gray-400">Đã bán: 300</p>
                            <div className="flex items-center mt-4">
                                <button onClick={() => decreaseQuantity(2)} className="bg-gray-600 text-white py-1 px-2 rounded">-</button>
                                <span className="mx-2 text-white">{quantities[2]}</span>
                                <button onClick={() => increaseQuantity(2)} className="bg-gray-600 text-white py-1 px-2 rounded">+</button>
                            </div>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                    {/* Món ăn 4 */}
                    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg relative transition-transform transform hover:scale-105">
                        <img alt="Promotion image for Pizza" className="w-full h-48 object-cover" src="https://via.placeholder.com/600x400.png?text=Pizza" />
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-5%</div>
                        <div className="p-4">
                            <p className="text-sm line-through text-gray-400">Giá cũ: 100.000đ</p>
                            <p className="font-bold text-lg text-green-400">Giá mới: 95.000đ</p>
                            <p className="font-bold text-xl text-white">Pizza</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500">⭐⭐⭐⭐</span>
                                <span className="text-sm ml-2 text-gray-400">(90 lượt đánh giá)</span>
                            </div>
                            <p className="text-sm text-gray-400">Đã bán: 250</p>
                            <div className="flex items-center mt-4">
                                <button onClick={() => decreaseQuantity(3)} className="bg-gray-600 text-white py-1 px-2 rounded">-</button>
                                <span className="mx-2 text-white">{quantities[3]}</span>
                                <button onClick={() => increaseQuantity(3)} className="bg-gray-600 text-white py-1 px-2 rounded">+</button>
                            </div>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">Đi tới trang thanh toán</button>
                </div>
            </div>
        </>
    );
};

export default FoodMenu;