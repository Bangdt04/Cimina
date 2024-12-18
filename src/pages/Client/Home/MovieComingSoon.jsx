import { NavLink } from "react-router-dom";
import ImageMovie from "../../../assets/image/joker.webp";
import { useGetMovies } from "../../../hooks/api/useMovieApi";
import config from "../../../config";

const MovieComingSoon = () => {
    const { data, isLoading } = useGetMovies();

    const groupMovies = (movies, groupSize) => {
        const groups = [];
        for (let i = 0; i < movies.length; i += groupSize) {
            groups.push(movies.slice(i, i + groupSize));
        }
        return groups;
    };

    // Find currently showing movies
    const showingMovies = data?.data?.filter(movie => movie.hinh_thuc_phim === 1) || [];
    const movieGroups = groupMovies(showingMovies.slice(0, 8) || [], 4) // Only take first 8 movies

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold flex items-center">
                    <span className="text-red-500 mr-2">●</span>
                    Phim sắp chiếu
                </h2>
                <NavLink 
                    to={config.routes.web.genre} 
                    className="text-blue-400 text-sm md:text-base"
                >
                    Xem tất cả
                </NavLink>
            </div>

            {movieGroups.map((group, groupIndex) => (
                <div 
                    key={groupIndex} 
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                >
                    {group.map((item) => {
                        const allMovieGenres = item.movie_genres.map((genre) => genre.ten_loai_phim).join(', ');
                        return (
                            <NavLink 
                                key={item.id} 
                                to={`${config.routes.web.phim}/${item.id}`}
                                className="block"
                            >
                                <div>
                                    <img
                                        alt={`Movie poster of ${item.ten_phim}`}
                                        style={{ height:500}}
                                        className="rounded-2xl w-full h-auto object-cover mb-2"
                                        src={`http://localhost:8000${item.anh_phim}` || ImageMovie}
                                    />
                                    <p className="text-xs md:text-sm text-gray-400 truncate">
                                        {allMovieGenres}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-400">
                                        04/10/2024
                                    </p>
                                    <p className="text-sm md:text-base font-bold truncate">
                                        {item.ten_phim}
                                    </p>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default MovieComingSoon;