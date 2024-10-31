import apiRoutes from '../../config/apiRoutes';
import {
    useDelete,
    useFetch,
    usePost,
    usePut,
} from '../../utils/reactQuery';

// Tạo một phim mới
export const useCreateMovie = (updater) => {
    return usePost(apiRoutes.admin.movies, updater);
};

// Cập nhật thông tin một phim
export const useUpdateMovie = (updater) => {
    return usePut(apiRoutes.admin.movies, updater);
};

// Lấy danh sách tất cả phim
export const useGetMovies = () => {
    console.log("GET MOVIES");
    return useFetch({ url: apiRoutes.web.movie, key: 'getListMovies' });
};

// Lấy thông tin một phim theo ID
export const useGetMovie = (id) => {
    return useFetch({ url: `${apiRoutes.web.movies}/${id}`, key: 'getMovieById' });
};

// Xóa một phim
export const useDeleteMovie = (updater) => {
    return useDelete(apiRoutes.admin.movies, updater);
};