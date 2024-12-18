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

            {Object.keys(data).map((loaiGhe, index) => (
                <div className="mb-8 px-24" key={index}>
                    <h2 className="text-xl font-bold mb-4">1. GIÁ VÉ XEM PHIM {loaiGhe.toUpperCase()}</h2>
                    {Object.keys(data[loaiGhe]).map((day, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">
                                {getDayLabel(day)}
                            </h3>
                            <table className="w-full text-center mb-4">
                                <thead className="table-header">
                                    <tr>
                                        <th className="table-cell p-2">Thời gian</th>
                                        <th className="table-cell p-2">Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data[loaiGhe][day].map((entry, entryIdx) => (
                                        <tr key={entryIdx}>
                                            <td className="table-cell p-2">{entry.timeRange}</td>
                                            <td className="table-cell p-2">{formatCurrency(entry.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// Helper function to get day label
const getDayLabel = (day) => {
    const daysOfWeek = {
        Monday: 'Từ thứ 2 đến thứ 5<br/>From Monday to Thursday',
        Tuesday: 'Từ thứ 2 đến thứ 5<br/>From Monday to Thursday',
        Wednesday: 'Từ thứ 2 đến thứ 5<br/>From Monday to Thursday',
        Thursday: 'Từ thứ 2 đến thứ 5<br/>From Monday to Thursday',
        Friday: 'Thứ 6, 7, CN và ngày Lễ<br/>Friday, Saturday, Sunday & public holiday',
        Saturday: 'Thứ 6, 7, CN và ngày Lễ<br/>Friday, Saturday, Sunday & public holiday',
        Sunday: 'Thứ 6, 7, CN và ngày Lễ<br/>Friday, Saturday, Sunday & public holiday',
    };

    if (day.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // It's a special day
        return `${formatSpecialDay(day)} (Ngày Lễ)`;
    }

    return daysOfWeek[day] || day;
};

// Helper function to format special day
const formatSpecialDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export default TicketPricePage;
