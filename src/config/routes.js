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
        voucher: '/admin/voucher',
        forbidden: '/forbidden',
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
        payment: '/payment/:id',
        create_iso: '/iso/new',
        chat: '/chat',
        profile: '/profile',
        product_detail: '/product-detail',
        login: '/',
        register: '/auth/register',
        food : '/food'
    },
};
export default routes;
