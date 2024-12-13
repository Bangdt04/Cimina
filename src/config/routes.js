const routes = {
    admin: {
        profile: '/admin/profile',
        dashboard: '/admin/dashboard',
        account: '/admin/account',
        movies: '/admin/movies',
        updateMovie: '/admin/movies/update/:id', // Thêm route cho trang chỉnh sửa phim
        report: '/admin/report',
        blogs: '/admin/blogs',
        info: '/admin/info',
        setting: '/admin/setting',
        auto: '/admin/auto',
        genres: '/admin/genres',
        users: '/admin/users',
        food: '/admin/food',
        booking: '/admin/bookings',
        voucher: '/admin/voucher',
        forbidden: '/forbidden',
        room: '/admin/room',
        roomDetail: '/admin/room/detail',
        seat: '/admin/seats',
        showTime: '/admin/showtime',
        login: '/admin/login',
        member: '/admin/member',
        checkin: '/admin/checkin',
    },
    web: {
        home: '/',
        lichChieu: '/shedule-movie',
        tinTuc: '/blogs',
        khuyenMai: '/voucher',
        giaVe: '/ticket-price',
        lienHoanPhim: '/festival',
        gioiThieu: '/about',
        phim: '/movie',
        payment: '/payment',
        theLoai: '/genre',
        chat: '/chat',
        profile: '/profile',
        product_detail: '/product-detail',
        login: '/',
        register: '/auth/register',
        food : '/food',
        test: '/test',
        search: '/search',
        transaction: '/transaction/success'
    },
};
export default routes;
