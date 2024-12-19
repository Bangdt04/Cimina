import { useEffect, useState } from 'react';

const ScoreHistory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const tokenData = localStorage.getItem('token');
            const token = tokenData ? JSON.parse(tokenData)['access-token'] : null;

            try {
                const response = await fetch('http://localhost:8000/api/available-rotations', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi gọi API');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner-border animate-spin border-4 rounded-full w-16 h-16 border-t-transparent border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500 text-white p-4 rounded-md text-center">
                <strong>Lỗi:</strong> {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-black p-6 rounded-lg shadow-lg">
                <table className="w-full text-left table-auto border-collapse">
                    <thead className="border-b border-gray-700 bg-gray-800">
                        <tr>
                            <th className="py-2 px-4 text-white text-center align-middle">Ngày quay</th>
                            <th className="py-2 px-4 text-white text-center align-middle">Phần thưởng</th>
                            <th className="py-2 px-4 text-white text-center align-middle">Ngày hết hạn</th>
                            <th className="py-2 px-4 text-white text-center align-middle">Điều kiện</th>
                            <th className="py-2 px-4 text-white text-center align-middle">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                item.ket_qua !== "Chúc bạn may mắn" && (
                                    <tr key={item.id} className="hover:bg-gray-700 transition duration-200">
                                        <td className="py-4 px-4 text-white text-center align-middle">{item.ngay_quay}</td>
                                        <td className="py-4 px-4 text-white text-center align-middle">{item.ket_qua}</td>
                                        <td className="py-4 px-4 text-white text-center align-middle">{item.ngay_het_han}</td>
                                        <td className="py-4 px-4 text-white text-center align-middle">{item.dieu_kien}</td>
                                        <td className="py-4 px-4">
                                            {item.trang_thai === 0 ? (
                                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm text-center align-middle">Còn sử dụng</span>
                                            ) : (
                                                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm text-center align-middle">Đã hết hạn</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-white">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScoreHistory;
