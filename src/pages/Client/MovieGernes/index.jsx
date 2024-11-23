import { NavLink, useParams } from "react-router-dom";
import { useGetMovieFilterById, useGetMovies } from "../../../hooks/api/useMovieApi";
import Voucher from "../Home/Voucher";
import config from "../../../config";

const MovieGernes = () => {
    const { id } = useParams();
    const { data, isLoading } = id ? useGetMovieFilterById(id) : useGetMovies();
    const groupMovies = (movies, groupSize) => {
        const groups = [];
        for (let i = 0; i < movies.length; i += groupSize) {
            groups.push(movies.slice(i, i + groupSize));
        }
        return groups;
    };

    const movieGroups = groupMovies(data?.data || [], 4)

    return (
        <>
            <div className="bg-black-800 min-h-screen p-10"> {/* Added background and padding */}
                <div className="flex mb-6 mt-20">
                    <div className="w-3/4 mb">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center"> {/* Changed text color to white */}
                                <span className="text-red-500 mr-2">●</span>
                                Danh sách phim
                            </h2>
                        </div>

                        {isLoading && <p className="text-white">Loading...</p>} {/* Added loading state */}
                        {movieGroups.length === 0 && !isLoading ? ( // Handle empty state
                            <p className="text-white">Không có phim nào.</p>
                        ) : (
                            movieGroups.map((group, index) => (
                                <div className="flex space-x-4 mt-6 mb-5" key={index}>
                                    {group.map((item) => {
                                        const allMovieGenres = item.movie_genres.map((genre) => genre.ten_loai_phim).join(', ');
                                        return (
                                            <NavLink className="w-1/4" to={config.routes.web.phim + `/` + item.id} key={item.id}>
                                                <div className=" rounded-lg p-4 hover-zoom hover:shadow-lg transition-shadow duration-300"> {/* Added background and hover effect */}
                                                    <img
                                                        alt={`Movie poster of ${item.ten_phim}`}
                                                        className="rounded-2xl mb-2"
                                                        style={{ height: 350, width: '100%' }}
                                                        src={`http://localhost:8000${item.anh_phim}` || ImageMovie}
                                                    />
                                                    <p className="text-gray-400">{allMovieGenres}</p>
                                                    <p className="text-gray-400">04/10/2024</p>
                                                    <p className="font-bold text-white">{item.ten_phim}</p> {/* Changed text color to white */}
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
        </>
    );
}

export default MovieGernes;