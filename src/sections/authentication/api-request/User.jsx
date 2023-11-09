import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const userLogin = (data) => {
    const response = axios.post(`${baseUrl}/user/login`, data);
    console.log('Login request: ', response);
    return response;

};

export const userChangePassword = (data) => {
    const response = axios.post(`${baseUrl}/user/password`, data);
    return response;
};

export const userGetId = (id) => {
    const response = axios.get(`${baseUrl}/user/${id}`);
    return response;
};