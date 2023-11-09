import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const getSummary = (data) => {
    const response = axios.get(`${baseUrl}/`, data);
    return response;
};

export const getAllArea = (data) => {
    const response = axios.get(`${baseUrl}/area`, data);
    return response;
};

export const getAreaData = (type, value) => {
    const params = {};
    if (type === 'kabupaten') params.kabupaten = value;
    if (type === 'kecamatan') params.kecamatan = value;
    if (type === 'kelurahan') params.kelurahan = value;
    
    return axios.get(`${baseUrl}/area`, { params });
};
