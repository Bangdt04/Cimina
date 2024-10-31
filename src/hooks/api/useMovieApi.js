import apiRoutes from '../../config/apiRoutes';
import {
    useDelete,
    useFetch,
    usePost,
    usePut,
} from '../../utils/reactQuery';

export const useCreateMovie = (updater) => {
    return usePost(apiRoutes.admin.movie, updater);
};

export const useUpdateMovie = (updater) => {
    return usePut(apiRoutes.admin.movie, updater);
};

export const useGetMovies = () => {
    console.log("GET MOVIES")
    return useFetch({ url: apiRoutes.web.movie, key: 'getListMovies' });
};

export const useGetMovie = (id) => {
    return useFetch({ url: apiRoutes.web.movie + '/' + id, key: 'getMovieById' });
};

export const useDeleteMovie = (updater) => {
    return useDelete(apiRoutes.admin.movie, updater);
};