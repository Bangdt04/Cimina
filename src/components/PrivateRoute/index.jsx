import { Navigate } from 'react-router-dom';
import { isTokenStoraged, getRoles } from '../../utils/storage';
import config from '../../config';
import { message } from 'antd'; 
function PrivateRoute({ children, roles }) {
    if (!isTokenStoraged()) {
        return <Navigate to={config.routes.web.login} replace />;
    }

    const userRole = getRoles();
    if (!roles.includes(userRole)) {
        message.warning("Bạn không đủ quyền truy cập");
        return <Navigate to={config.routes.web.home} replace />;
    }

    return children;
}

export default PrivateRoute;