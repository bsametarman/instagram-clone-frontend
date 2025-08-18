import apiClient from './axiosConfig';

const getUserProfile = (username) => {
    return apiClient.get(`/users/${username}`);
};

const followUser = (usernameToFollow) => {
    return apiClient.post(`/users/${usernameToFollow}/follow`);
};

const unfollowUser = (usernameToUnfollow) => {
    return apiClient.delete(`/users/${usernameToUnfollow}/follow`);
};

const getFollowers = (username, page = 0, size = 20) => {
    return apiClient.get(`/users/${username}/followers`, { params: { page, size } });
};

const getFollowing = (username, page = 0, size = 20) => {
    return apiClient.get(`/users/${username}/followings`, { params: { page, size } });
};

const profileService = {
    getUserProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};

export default profileService;