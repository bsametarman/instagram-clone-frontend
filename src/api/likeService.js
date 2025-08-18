import apiClient from './axiosConfig';

const toggleLike = (postId) => {
    return apiClient.post(`/posts/${postId}/likes`);
};

const likeService = {
    toggleLike,
};

export default likeService;