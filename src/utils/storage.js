import { jwtDecode } from "jwt-decode";


export const clearToken = () => {
    localStorage.removeItem('token');
};

export const isTokenStoraged = () => {
    return !!localStorage.getItem('token');
};

export const saveToken = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
};

export const getRoles = () => {
    let authInfo = JSON.parse(localStorage.getItem('token'));
    if (!authInfo) return;

    let jwtDecodeObj = authInfo.auth;
    return jwtDecodeObj;
};

export const getTokenOfUser = () => {
    let authInfo = JSON.parse(localStorage.getItem('token'));
    if (!authInfo) return;

    let jwtDecodeObj = authInfo["access-token"];
    return jwtDecodeObj;
};
