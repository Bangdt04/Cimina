import config from "../config";
import ClientLayout from "../layouts/Client/ClientLayout";
import AdminLayout from '../layouts/Admin/AdminLayout'
import DashboardPage from "../pages/Admin/Dashboard";
import SettingPage from "../pages/Admin/Setting";
import HomePage from "../pages/Client/Home";
import AutoApprovePage from "../pages/Admin/AutoApprove";
import GenreFormPage from "../pages/Admin/Genres/GenreForm";
import GenrePage from "../pages/Admin/Genres";
import VoucherFormPage from "../pages/Admin/Voucher/VoucherForm";
import BlogsPage from "../pages/Admin/Blogs";
import UserPage from "../pages/Admin/User";
import MoviePage from "../pages/Admin/Moives";
import FoodPage from "../pages/Admin/Food";
import TicketPricePage from "../pages/Client/TicketPrice";
import PaymentPage from "../pages/Client/Payment";
import AboutPage from "../pages/Client/About";
import VoucherPage from "../pages/Client/Voucher";
import BlogPage from "../pages/Client/Blogs";
import ShedulePage from "../pages/Client/Shedule";
import EventMoviePage from "../pages/Client/EventMovie";
import MovieDetailsPage from "../pages/Client/MovieDetails";
import ProfilePage from "../pages/Client/Profile";
import FoodMenu from "../pages/Client/Food";
import MovieGernes from "../pages/Client/MovieGernes";
import Test from "../pages/Client/Test";
import SearchResults from "../pages/Client/Home/SearchResults";
import TransactionSuccess from "../pages/Client/Transaction";

const publicRoutes = [
    {
        path: config.routes.web.home,
        component: HomePage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.giaVe,
        component: TicketPricePage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.gioiThieu,
        component: AboutPage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.khuyenMai,
        component: VoucherPage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.tinTuc,
        component: BlogPage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.lichChieu,
        component: ShedulePage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.lienHoanPhim,
        component: EventMoviePage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.phim + "/:id",
        component: MovieDetailsPage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.theLoai + "/:id",
        component: MovieGernes,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.theLoai,
        component: MovieGernes,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.payment,
        component: PaymentPage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },

    {
        path: config.routes.web.profile ,
        component: ProfilePage,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.food + "/:id",
        component: FoodMenu,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.test + "/:id",
        component: Test,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
    {
        path: config.routes.web.search,
        component: SearchResults,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },

    {
        path: config.routes.web.transaction,
        component: TransactionSuccess,
        layout: ClientLayout,
        roles: ['user'],
        private: false,
    },
 
]

const privateRoutes = [
    {
        path: config.routes.admin.dashboard,
        component: DashboardPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.setting,
        component: SettingPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.auto,
        component: AutoApprovePage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },{
        path: config.routes.admin.genres,
        component: GenrePage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.genres + '/create',
        component: GenreFormPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },    
    {
        path: config.routes.admin.genres + '/update/:id',
        component: GenreFormPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },{
        path: config.routes.admin.voucher,
        component: VoucherPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.voucher + '/create',
        component: VoucherFormPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.voucher + '/update/:id',
        component: VoucherFormPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.blogs,
        component: BlogsPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },{
        path: config.routes.admin.users,
        component: UserPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },{
        path: config.routes.admin.movies,
        component: MoviePage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
    {
        path: config.routes.admin.food,
        component: FoodPage,
        layout: AdminLayout,
        roles: ['admin'],
        private: true,
    },
]


const routes = [...publicRoutes, ...privateRoutes];
export default routes;