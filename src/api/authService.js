import apiClient from './axiosConfig';

const signup = (userData) => {
    return apiClient.post('/auth/signup', userData);
};

const login = (loginData) => {
    return apiClient.post('/auth/signin', loginData);
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const authService = {
    signup,
    login,
    logout,
};

export default authService;