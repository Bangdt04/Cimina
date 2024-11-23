import { NavLink, useLocation } from "react-router-dom";
import Voucher from "./Voucher";
import { Empty } from "antd";
import { useEffect, useState } from "react";
import config from "../../../config";
import Search from "./Search";

const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('query');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(searchTerm 
                    ? `http://127.0.0.1:8000/api/movieFilterKeyword?keyword=${encodeURIComponent(searchTerm)}`
                    : `http://127.0.0.1:8000/api/movies` // Thay đổi URL để lấy tất cả bộ phim
                );
                const result = await response.json();
                setData(result.data || []);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies(); // Gọi hàm fetchMovies mà không cần kiểm tra searchTerm
    }, [searchTerm]);

    const groupMovies = (movies, groupSize) => {
        const groups = [];
        for (let i = 0; i < movies.length; i += groupSize) {
            groups.push(movies.slice(i, i + groupSize));
        }
        return groups;
    };

    const movieGroups = groupMovies(data, 4);

    return (
        <div className="bg-black-800 min-h-screen p-10">
            <div className="flex mb-6 mt-20">
                <div className="w-3/4 mb">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="text-red-500 mr-2">●</span>
                            Kết quả tìm kiếm cho : {searchTerm || "Tất cả phim"}
 
                        </h2>
                    </div>
                    {isLoading && <p className="text-white">Loading...</p>}
                    {movieGroups.length === 0 && !isLoading ? (
                        <Empty className="text-white" description="Không có kết quả nào." />
                    ) : (
                        movieGroups.map((group, index) => (
                            <div className="flex space-x-4 mt-6 mb-5" key={index}>
                                {group.map((item) => {
                                    const allMovieGenres = item.movie_genres.map((genre) => genre.ten_loai_phim).join(', ');
                                    return (
                                        <NavLink className="w-1/4" to={config.routes.web.phim + `/` + item.id} key={item.id}>
                                            <div className="bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                                                <img
                                                    alt={`Movie poster of ${item.ten_phim}`}
                                                    className="rounded-2xl mb-2"
                                                    style={{ height: 350, width: '100%' }}
                                                    src={`http://localhost:8000${item.anh_phim}` || ImageMovie}
                                                />
                                                <p className="text-gray-400">{allMovieGenres}</p>
                                                <p className="text-gray-400">04/10/2024</p>
                                                <p className="font-bold text-white">{item.ten_phim}</p>
                                            </div>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                <Voucher />
            </div>
        </div>
    );
};

export default SearchResults;