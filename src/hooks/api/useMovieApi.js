import apiRoutes from '../../config/apiRoutes';
import {
    useDelete,
    useFetch,
    usePost,
    usePut,
} from '../../utils/reactQuery';

// Tạo một phim mới
export const useCreateMovie = (updater) => {
    return usePost(apiRoutes.admin.storeMovie, updater);
};

// Lấy danh sách tất cả phim
export const useGetMovies = () => {
    console.log("GET MOVIES");
    return useFetch({ url: apiRoutes.admin.movie, key: 'getListMovies' });
};

export const useGetMovieById = (id) => {
    console.log("GET MOVIES ID")
    return useFetch({ url: apiRoutes.web.showMovie + '/' + id, key: 'getMovieById' });
}

export const useGetMovieFilterById = (id) => {
    return useFetch({ url: apiRoutes.web.movieFilter + '/' + id, key: 'getMovieFilterById' });
}

export const useGetMovieDetailById = (id) => {
    return useFetch({ url: apiRoutes.web.movieDetail + '/' + id, key: 'getMovieDetailById' });
}