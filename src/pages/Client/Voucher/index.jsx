import React, { useEffect, useState } from 'react';
import { getTokenOfUser } from "../../../utils/storage";

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
            const response = await fetch('http://127.0.0.1:8000/api/countdown_vouchers');
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

        const response = await fetch('http://127.0.0.1:8000/api/auth/user/voucher-codes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        setSavedVouchers(data); // Adjust according to your API response structure

    };

    const handleSaveVoucher = async (voucher) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/spin-voucher', {
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
            alert(`Saved voucher: ${voucher.voucher.mota}`);
            fetchSavedVouchers();
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-24 mb-4 px-32">{error}</div>;
    }

    return (
        <div className="container mx-auto py-8 mt-16 px-32">
            <h1 className="text-center text-2xl font-bold mb-8">Khuyến mãi</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vouchers.map((voucher) => (
                    <div key={voucher.id} className="bg-[#fff0] border text-white rounded-lg overflow-hidden shadow-lg">
                        <img alt={`Promotion image for ${voucher.voucher.mota}`} className="w-full" height="200" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/valentines-gift-voucher-design-template-a4076087e8938721205d868bbc555dac_screen.jpg?ts=1664394224" width="600" />
                        <div className="p-4">
                            <p className="text-sm">Bắt đầu: {voucher.thoi_gian_bat_dau} - {voucher.thoi_gian_ket_thuc} <br /> Ngày: {voucher.ngay}</p>
                            <p className="font-bold">{voucher.voucher.mota}</p>
                            {accessToken ?
                                <button
                                    className="mt-2 bg-red-600 text-white rounded-full px-4 py-2"
                                    onClick={() => handleSaveVoucher(voucher)}
                                >
                                    Lưu Voucher
                                </button> :

                                <div className='text-red-600'>
                                    Vui lòng đăng nhập để lưu vé
                                </div>

                            }

                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-bold">Vouchers đã lưu</h2>
                {loadingSavedVouchers ? (
                    <div>Mã giảm giá chưa có...</div>
                ) : (
                    <ul>
                        {savedVouchers.map((savedVoucher) => (
                            <div className="bg-gray-800 border border-gray-700 text-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 mt-4">
                                <div className="p-4">
                                    <p className="text-sm text-gray-400">{savedVoucher.mota}</p>
                                    <p className="font-bold text-lg">Mã: {savedVoucher.ma_giam_gia}</p>
                                    <p className="font-bold text-lg">Giá Đơn Tối Thiểu: {Number(savedVoucher.gia_don_toi_thieu).toLocaleString()} VNĐ</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default VoucherPage;