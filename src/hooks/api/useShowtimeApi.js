import apiRoutes from '../../config/apiRoutes';
import {
    useDelete,
    useDeleteList,
    useFetch,
    usePost,
    usePut,
    usePostQuery,
    usePutForm,
    usePutFormWithoutId,
    usePutWithoutId,
    usePostForm,
} from '../../utils/reactQuery';


export const useGetShowtimes = () => {
    return useFetch({ url: apiRoutes.web.schedulMovies, key: 'getShowtimes' });
};

export const useShowtimes = () => {
    return useFetch({ url: apiRoutes.admin.showtimes, key: 'getShowtimes' });
};

export const useAddShowtime = () => {
    return useFetch({ url: apiRoutes.admin.addShowtime, key: 'addShowtime' });
};

export const usestoreShowtime = (updater) => {
    return usePost(apiRoutes.admin.storeShowtime, updater);
};

export const useUpdateShowtime = (id) => {
    return usePut({ url: `${apiRoutes.admin.updateShowtime}/${id}`, key: 'updateShowtime' });
};

export const useDeleteShowtime = (id) => {
    return useDelete({ url: `${apiRoutes.admin.deleteShowtime}/${id}`, key: 'deleteShowtime' });
};