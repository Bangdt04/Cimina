const apiRoutes = {
    common: {
        auth: {
            login: '/auth/login',
            register: '/auth/registers',
            changePassword: '/auth/change-password',
            confirmed: '/auth/confirmed',
        },
        user: {
            me: '/user/me'
        },
    },
    admin: {
        gerne: '/moviegenres',
        voucher: '/vouchers',
        movie: '/movies',
        showMovie: '/showMovie', 
        updateMovie: '/updateMovie', 
        movieDetail: '/movieDetail',
        room: '/rooms',
        storeRoom: '/storeRoom',
        showRoom: '/showRoom',
        updateRoom: '/updateRoom',
        storeRoom: '/storeRoom',
        seatAllRoom: '/seatAllRoom',
        baoTriSeat: '/baoTriSeat',
        tatbaoTriSeat: '/tatbaoTriSeat',
    },
    web: {
        user: '/auth/upload-profile',
        post: '/post',
        user_message: '/user/message',
        user_message_chat: '/user/message-chat',
        transaction: '/transaction',
        movie:'/movies',
    },
};

export default apiRoutes;
