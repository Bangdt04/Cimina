import config from "../config";
import ClientLayout from "../layouts/Client/ClientLayout";
import HomePage from "../pages/Client/Home";

const publicRoutes = [
    {
        path: config.routes.web.home,
        component: HomePage,
        layout: ClientLayout,
        roles: ['USER'],
        private: false,
    }
]

const privateRoutes = [
    {}
]

const routes = [...publicRoutes, ...privateRoutes];
export default routes;