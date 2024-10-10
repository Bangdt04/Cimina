const apiRoutes = {
    common: {
        auth: {
            login: '/login',
            register: '/registers',
            changePassword: '/auth/change-password',
            confirmed: '/auth/confirmed',
        },
        user: {
            me: '/user/me'
        },
    },
    admin: {
        category: '/category',
    },
    web: {

    },
};

export default apiRoutes;