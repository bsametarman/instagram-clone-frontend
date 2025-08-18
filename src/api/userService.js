import apiClient from './axiosConfig';

const getAllUsers = (searchTerm, page = 0, size = 12, sort = 'createdAt,desc') => {
    return apiClient.get(`/users/all`, {
        params: {
            searchTerm,
            page,
            size,
            sort,
        }
    });
}

const getAllActiveUsers = (searchTerm, page = 0, size = 12, sort = 'createdAt,desc') => {
    return apiClient.get(`/users`, {
        params: {
            searchTerm,
            page,
            size,
            sort,
        }
    });
}

const updateMyProfile = (profileData) => {
    console.log(profileData);
    return apiClient.put('/users/me', profileData);
};

const updateMyProfilePicture = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/users/me/profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const userService = {
    getAllUsers,
    updateMyProfile,
    updateMyProfilePicture,
    getAllActiveUsers,
};

export default userService;