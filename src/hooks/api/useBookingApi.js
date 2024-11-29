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


export const useGetBooking = () => {
    return useFetch({ url: apiRoutes.admin.booking, key: 'getListBooking' });
};
