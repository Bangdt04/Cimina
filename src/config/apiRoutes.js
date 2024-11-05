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
        showMoviegenre: '/showMoviegenre',
        updateMoviegenre: '/updateMoviegenre',
        storeMoviegenre: '/storeMoviegenre',
        deleteMoviegerne: '/moviegenre',
        voucher: '/vouchers',
        movie: '/movies',
        showMovie: '/showMovie', 
        updateMovie: '/updateMovie', 
        movieDetail: '/movieDetail',
        room: '/rooms',
        showRoom: '/showRoom',
        updateRoom: '/updatetRoom',
        deleteRoom: '/deleteRoom',
        storeRoom: '/storeRoom',
        seatAllRoom: '/seatAllRoom',
        baoTriSeat: '/baoTriSeat',
        tatbaoTriSeat: '/tatbaoTriSeat',
        seat: '/seats',
        storeSeat: '/storeSeat',
        updateSeat: '/updateSeat',
        showSeat: '/showSeat',
        deleteSeat: '/deleteSeat',
        food: '/foods',
        storeFood: '/storeFood',
        showFood: '/showFood',
        updateFood: '/updateFood',
        deleteFood: '/deleteFood',
    },
    web: {
        user: '/auth/upload-profile',
        post: '/post',
        user_message: '/user/message',
        user_message_chat: '/user/message-chat',
        transaction: '/transaction',
        movie:'/movies',
        schedulMovies: '/showtimes',
        showMovie: '/showMovie',
        movieFilter: '/movieFilter',
        movieDetail: '/movie-detail',
        foods: '/foods'
    },
};

export default apiRoutes;
