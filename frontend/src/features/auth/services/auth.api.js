import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
});


export const Register = async (data) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
}

export const Login = async (data) => {
    const response = await axiosInstance.post('/login', data);
    return response.data;
}