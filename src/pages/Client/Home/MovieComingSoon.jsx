import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import config from "../../../config";

const MovieCommingSoon = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/movies');
            const data = await response.json();
            if (data.message === "Hiện thị dữ liệu phim thành công") {
                // Lọc phim có hinh_thuc_phim là "Đang chiếu" và lấy 4 phim đầu tiên
                const filteredMovies = data.data
                    .filter(movie => movie.hinh_thuc_phim === "Sắp chiếu")
                    .slice(0, 4); // Lấy tối đa 4 bộ phim
                setMovies(filteredMovies); // Lưu phim đã lọc vào state
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="w-3/4 mb">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                    <span className="text-red-500 mr-2">●</span>
                    Phim sắp chiếu
                </h2>
                <a className="text-blue-400" href="http://localhost:5173/genre">
                    Xem tất cả
                </a>
            </div>
            <div className="flex space-x-4 mt-6 mb-5">
                {/* Dùng map để hiển thị danh sách phim đã lọc */}
                {movies.map((movie) => (
                    <NavLink key={movie.id} className="w-1/4" to={config.routes.web.phim + `/${movie.id}`}>
                        <div>
                            <img
                                alt={`Movie poster of ${movie.ten_phim}`}
                                className="rounded-2xl hover-zoom mb-2"
                                style={{ height: 350, width: '100%' }}
                                src={`http://127.0.0.1:8000${movie.anh_phim}`} // Sử dụng URL ảnh từ API
                            />
                            <p className="text-gray-400">{movie.movie_genres[0]?.ten_loai_phim}</p> {/* Hiển thị thể loại phim */}
                            <p className="text-gray-400">{movie.hinh_thuc_phim}</p> {/* Hiển thị trạng thái phim */}
                            <p className="font-bold">{movie.ten_phim}</p> {/* Tên phim */}
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default MovieCommingSoon;
