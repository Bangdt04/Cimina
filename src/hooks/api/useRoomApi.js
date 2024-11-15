import apiRoutes from '../../config/apiRoutes';
import {
    useDelete,
    useFetch,
    usePost,
    usePut,
} from '../../utils/reactQuery';

// Create a new room
export const useCreateRoom = (updater) => {
    return usePost(apiRoutes.admin.storeRoom, updater);
};

// Get all rooms
export const useGetRooms = () => {
    return useFetch({ url: apiRoutes.admin.room, key: 'getListRooms' });
};

// Fetch room data by ID
export const useGetRoom = (id) => {
    return useFetch({ url: `${apiRoutes.admin.showRoom}/${id}`, key: 'getRoomById' });
};

// Update a room by ID
export const useUpdateRoom = (updater) => {
    return usePut(apiRoutes.admin.updateRoom, updater);
};

// Delete a room by ID
export const useDeleteRoom = (updater) => {
    return useDelete(apiRoutes.admin.deleteRoom, updater);
};