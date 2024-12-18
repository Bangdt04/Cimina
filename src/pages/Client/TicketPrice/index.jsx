// src/pages/Admin/TicketPricePage/index.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss'; // Ensure your styles are correctly defined here
import { CircularProgress, Alert } from '@mui/material';

const TicketPricePage = () => {
    const [seatPrices, setSeatPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeatPrices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/seat-price-all');
                if (response.status === 200) {
                    setSeatPrices(response.data.data);
                } else {
                    setError('Failed to fetch seat prices.');
                }
            } catch (err) {
                setError('An error occurred while fetching seat prices.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeatPrices();
    }, []);

    // Process data to organize by seat type and day
    const processedData = () => {
        const grouped = {};

        seatPrices.forEach((item) => {
            const {
                loai_ghe,
                thu_trong_tuan,
                ngay_cu_the,
                gio_bat_dau,
                gio_ket_thuc,
                gia_ghe,
            } = item;

            const day = ngay_cu_the
                ? ngay_cu_the // Special day
                : thu_trong_tuan; // Day of the week

            if (!grouped[loai_ghe]) {
                grouped[loai_ghe] = {};
            }

            if (!grouped[loai_ghe][day]) {
                grouped[loai_ghe][day] = [];
            }

            grouped[loai_ghe][day].push({
                timeRange: `${formatTime(gio_bat_dau)} - ${formatTime(gio_ket_thuc)}`,
                price: Number(gia_ghe),
            });
        });

        return grouped;
    };

    // Helper function to format time
    const formatTime = (time) => {
        const [hour, minute, second] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hour), parseInt(minute), parseInt(second));
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    const data = processedData();

    return (
        <div className="ticket-price-page">
            <div className="text-center mb-8 mt-20">
                <h1 className="text-2xl font-bold">Giá vé</h1>
                <p>( Áp dụng từ ngày 01/06/2023 )</p>
            </div>

                <div className="mb-8 px-24">
                    <h2 className="text-xl font-bold mb-4">1. GIÁ VÉ XEM PHIM 2D</h2>
                    <table className="w-full text-center">
                        <thead className="table-header">
                            <tr>
                                <th className="table-cell p-2"></th>
                                <th className="table-cell p-2" colspan="3">Từ thứ 2 đến thứ 5<br/>From Monday to Thursday</th>
                                <th className="table-cell p-2" colspan="3">Thứ 6, 7, CN và ngày Lễ<br/>Friday, Saturday, Sunday & public holiday</th>
                            </tr>
                            <tr>
                                <th className="table-cell p-2">Thời gian</th>
                                <th className="table-cell p-2">Ghế thường</th>
                                <th className="table-cell p-2 text-yellow">Ghế VIP</th>
                                <th className="table-cell p-2 text-red">Ghế đôi</th>
                                <th className="table-cell p-2">Ghế thường</th>
                                <th className="table-cell p-2 text-yellow">Ghế VIP</th>
                                <th className="table-cell p-2 text-red">Ghế đôi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="table-cell p-2">Trước 12h</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                            <tr>
                                <td className="table-cell p-2">Từ 12:00 đến trước 17:00</td>
                                <td className="table-cell p-2">70.000đ</td>
                                <td className="table-cell p-2 text-yellow">75.000đ</td>
                                <td className="table-cell p-2 text-red">160.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                            <tr>
                                <td className="table-cell p-2">Từ 17:00 đến trước 23:00</td>
                                <td className="table-cell p-2">80.000đ</td>
                                <td className="table-cell p-2 text-yellow">85.000đ</td>
                                <td className="table-cell p-2 text-red">180.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                            <tr>
                                <td className="table-cell p-2">Từ 23:00</td>
                                <td className="table-cell p-2">65.000đ</td>
                                <td className="table-cell p-2 text-yellow">70.000đ</td>
                                <td className="table-cell p-2 text-red">150.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='px-24 mb-10'>
                    <h2 className="text-xl font-bold mb-4">2. GIÁ VÉ XEM PHIM 3D</h2>
                    <table className="w-full text-center">
                        <thead className="table-header">
                            <tr>
                                <th className="table-cell p-2"></th>
                                <th className="table-cell p-2" colspan="3">Từ thứ 2 đến thứ 5<br/>From Monday to Thursday</th>
                                <th className="table-cell p-2" colspan="3">Thứ 6, 7, CN và ngày Lễ<br/>Friday, Saturday, Sunday & public holiday</th>
                            </tr>
                            <tr>
                                <th className="table-cell p-2">Thời gian</th>
                                <th className="table-cell p-2">Ghế thường</th>
                                <th className="table-cell p-2 text-yellow">Ghế VIP</th>
                                <th className="table-cell p-2 text-red">Ghế đôi</th>
                                <th className="table-cell p-2">Ghế thường</th>
                                <th className="table-cell p-2 text-yellow">Ghế VIP</th>
                                <th className="table-cell p-2 text-red">Ghế đôi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="table-cell p-2">Trước 12h</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                            <tr>
                                <td className="table-cell p-2">Từ 12:00 đến trước 17:00</td>
                                <td className="table-cell p-2">70.000đ</td>
                                <td className="table-cell p-2 text-yellow">75.000đ</td>
                                <td className="table-cell p-2 text-red">160.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                            <tr>
                                <td className="table-cell p-2">Từ 17:00 đến trước 23:00</td>
                                <td className="table-cell p-2">80.000đ</td>
                                <td className="table-cell p-2 text-yellow">85.000đ</td>
                                <td className="table-cell p-2 text-red">180.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                            <tr>
                                <td className="table-cell p-2">Từ 23:00</td>
                                <td className="table-cell p-2">65.000đ</td>
                                <td className="table-cell p-2 text-yellow">70.000đ</td>
                                <td className="table-cell p-2 text-red">150.000đ</td>
                                <td className="table-cell p-2">55.000đ</td>
                                <td className="table-cell p-2 text-yellow">65.000đ</td>
                                <td className="table-cell p-2 text-red">140.000đ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
           

        </>
    );
};

export default TicketPricePage;
