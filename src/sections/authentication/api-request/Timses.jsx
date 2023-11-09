import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const getTimses = (searchQuery) => {
    const params = searchQuery ? { search: searchQuery } : {};
    return axios.get(`${baseUrl}/timses`, { params });
};

export const getTimsesId = (id) => {
    const response = axios.get(`${baseUrl}/timses/${id}`);
    return response;
};

export const insertTimses = (data) => {
    const response = axios.post(`${baseUrl}/timses`, data);
    return response;
};

export const updateTimses = (id, data) => {
    const response = axios.patch(`${baseUrl}/timses/${id}`, data);
    return response;
};

export const deleteTimses = (id) => {
    const response = axios.delete(`${baseUrl}/timses/${id}`);
    return response;
};
