import React, { useEffect, useState } from 'react';
import { getTokenOfUser } from "../../../utils/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedVouchers, setSavedVouchers] = useState([]);
    const accessToken = getTokenOfUser();
    const [loadingSavedVouchers, setLoadingSavedVouchers] = useState(true);

    useEffect(() => {
        fetchSavedVouchers();
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/today-discounts');
            if (!response.ok) {
                throw new Error('Vui lòng đăng nhập để có thể săn vé!');
            }
            const data = await response.json();
            setVouchers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedVouchers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/user/voucher-codes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            if (data) {
                setSavedVouchers(data);
            }
        } catch (error) {
            console.error('Error fetching saved vouchers:', error);
        } finally {
            setLoadingSavedVouchers(false);
        }
    };

    const handleSaveVoucher = async (voucher) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/spin-voucher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ countdownvoucher_id: voucher.id }),
            });
            if (!response.ok) {
                throw new Error('Bạn đã lưu voucher này.');
            }
            toast.success(`Đã lưu voucher: ${voucher.coupon.mota}`);
            fetchSavedVouchers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="container mx-auto py-8 mt-16 px-32">
            <ToastContainer />
            <h1 className="text-center text-2xl font-bold mb-8">Khuyến mãi</h1>
            {loading ? (
                <div className="text-center">Đang tải...</div>
            ) : error ? (
                <div className="text-center text-red-500 mt-24 mb-4 px-32">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vouchers.map((voucher) => (
                        <div
                            key={voucher.id}
                            className="bg-white border text-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <img
                                alt={`Promotion image for ${voucher.coupon.mota}`}
                                className="w-full h-48 object-cover"
                                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/valentines-gift-voucher-design-template-a4076087e8938721205d868bbc555dac_screen.jpg?ts=1664394224"
                            />
                            <div className="p-4">
                                <p className="text-sm">
                                    Bắt đầu: {voucher.thoi_gian_bat_dau} - {voucher.thoi_gian_ket_thuc} <br /> Ngày: {voucher.ngay}
                                </p>
                                {accessToken ? (
                                    <button
                                        className="mt-2 bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700"
                                        onClick={() => handleSaveVoucher(voucher)}
                                    >
                                        Lưu Voucher
                                    </button>
                                ) : (
                                    <div className="text-red-600">Vui lòng đăng nhập để lưu vé</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-8">
                <h2 className="text-xl font-bold">Vouchers đã lưu</h2>
                {loadingSavedVouchers ? (
                    <div>Đang tải mã giảm giá đã lưu...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedVouchers.map((savedVoucher) => (
                            <div
                                key={savedVoucher.id}
                                className="bg-gray-800 border border-gray-700 text-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                            >
                                <div className="p-4">
                                    <p className="text-sm text-gray-400">{savedVoucher?.mota}</p>
                                    <p className="font-bold text-lg">Mã: {savedVoucher?.ma_giam_gia}</p>
                                    <p className="font-bold text-lg">
                                        Giá Đơn Tối Thiểu: {Number(savedVoucher?.gia_don_toi_thieu).toLocaleString()} VNĐ
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherPage;
