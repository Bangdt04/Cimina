import config from "../config";
import ClientLayout from "../layouts/Client/ClientLayout";
import AdminLayout from '../layouts/Admin/AdminLayout'
import DashboardPage from "../pages/Admin/Dashboard";
import SettingPage from "../pages/Admin/Setting";
import HomePage from "../pages/Client/Home";
import AutoApprovePage from "../pages/Admin/AutoApprove";
import GenreFormPage from "../pages/Admin/Genres/GenreForm";
import GenrePage from "../pages/Admin/Genres";
import Voucher from "../pages/Admin/Voucher";
import VoucherFormPage from "../pages/Admin/Voucher/VoucherForm";
import BlogsPage from "../pages/Admin/Blogs";
import UserPage from "../pages/Admin/User";
import MoviePage from "../pages/Admin/Movies";
import MovieFormPage from "../pages/Admin/Movies/MovieForm";
import FoodPage from "../pages/Admin/Food";
import FoodFormPage from "../pages/Admin/Food/FoodForm";
import RoomPage from "../pages/Admin/Room";
import RoomFormPage from "../pages/Admin/Room/RoomForm";
import RoomData from "../pages/Admin/Room/RoomData";
import SeatPage from "../pages/Admin/Seats";
import SeatFormPage from "../pages/Admin/Seats/SeatForm";
import ShowTimePage from "../pages/Admin/ShowTime";
import ShowTimeFormPage from "../pages/Admin/ShowTime/ShowTimeForm";
import MemberPage from "../pages/Admin/Member";
import MemberFormPage from "../pages/Admin/Member/MemberForm";

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
import LoginPage from "../pages/Admin/Login/login";
import BookingPage from "../pages/Admin/Booking";
import ShowtimePage from "../pages/Admin/POS";
import SeatChoosePage from "../pages/Admin/POS/seat";
import Payment from "../pages/Client/Payment";
import Checkin from "../pages/Admin/Check";
import AddRoom from "../pages/Admin/Seats/AddRoom";

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
        path: config.routes.web.profile,
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

    {
        path: config.routes.admin.login,
        component: LoginPage,
        roles: ['admin'],
        private: false,
    },
 
]

const privateRoutes = [
    {
        path: config.routes.admin.dashboard,
        component: DashboardPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.setting,
        component: SettingPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.auto,
        component: AutoApprovePage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.genres,
        component: GenrePage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.genres + '/create',
        component: GenreFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.genres + '/update/:id',
        component: GenreFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.voucher,
        component: Voucher,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.voucher + '/create',
        component: VoucherFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.voucher + '/update/:id',
        component: VoucherFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.blogs,
        component: BlogsPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.users,
        component: UserPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.movies,
        component: MoviePage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.movies + '/create',
        component: MovieFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.movies + '/update/:id',
        component: MovieFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.room,
        component: RoomPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.room + '/create',
        component: RoomFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.room + '/update/:id',
        component: RoomFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.room,
        component: RoomData,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.seat,
        component: SeatPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.seat + '/create',
        component: SeatFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.seat + '/update/:id',
        component: SeatFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.food,
        component: FoodPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.food + '/create',
        component: FoodFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.food + '/update/:id',
        component: FoodFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.showTime,
        component: ShowTimePage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.showTime + '/create',
        component: ShowTimeFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.showTime + '/update/:id',
        component: ShowTimeFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.booking ,
        component: BookingPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.booking + "/create" ,
        component: ShowtimePage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    }
    ,
    {
        path: config.routes.admin.booking + "/seat/:id" ,
        component: SeatChoosePage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.booking + "/food/:id" ,
        component: FoodMenu,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.booking + "/payment/:id" ,
        component: Payment,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.member,
        component: MemberPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.member + '/create',
        component: MemberFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.member + '/update/:id',
        component: MemberFormPage,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.checkin,
        component: Checkin,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },
    {
        path: config.routes.admin.addRoom,
        component: AddRoom,
        layout: AdminLayout,
        roles: ['admin', 'nhan_vien'], // Thêm 'nhan_vien'
        private: true,
    },

];

const routes = [...publicRoutes, ...privateRoutes];
export default routes;
