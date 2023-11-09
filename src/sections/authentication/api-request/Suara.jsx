import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const getSuara = (searchQuery) => {
    const params = searchQuery ? { search: searchQuery } : {};
    return axios.get(`${baseUrl}/suara`, { params });
};

export const insertSuara = (data) => {
    const response = axios.post(`${baseUrl}/suara`, data);
    return response;
};

export const updateSuara = (id, data) => {
    const response = axios.patch(`${baseUrl}/suara/${id}`, data);
    return response;
};

export const deleteSuara = (id) => {
    const response = axios.delete(`${baseUrl}/suara/${id}`);
    return response;
};