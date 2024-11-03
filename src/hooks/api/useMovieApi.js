import apiRoutes from '../../config/apiRoutes';
import {
    useDelete,
    useFetch,
    usePost,
    usePut,
} from '../../utils/reactQuery';

// Tạo một phim mới
export const useCreateMovie = (updater) => {
    return usePost(apiRoutes.admin.movie, updater);
};

// Lấy danh sách tất cả phim
export const useGetMovies = () => {
    console.log("GET MOVIES");
    return useFetch({ url: apiRoutes.admin.movie, key: 'getListMovies' });
};

// Lấy thông tin một phim theo ID
export const useGetMovie = (id) => {
    return useFetch({ url: `${apiRoutes.admin.showMovie}/${id}`, key: 'showMovieById' });
};

// Cập nhật thông tin một phim theo ID
export const useUpdateMovie = (id) => {
    return usePut(`${apiRoutes.admin.updateMovie}/${id}`);
};

// Xóa một phim
export const useDeleteMovie = (updater) => {
    return useDelete(apiRoutes.admin.movie, updater);
};