import apiClient from './axiosConfig';

const getCommentsByPostId = (postId, page = 0, size = 10) => {
    return apiClient.get(`/posts/${postId}/comments`, {
        params: { page, size },
    });
};

const addComment = (postId, commentData) => {
    return apiClient.post(`/posts/${postId}/comments`, commentData);
};

const deleteComment = (postId, commentId) => {
    return apiClient.delete(`/posts/${postId}/comments/${commentId}`);
};

const commentService = {
    getCommentsByPostId,
    addComment,
    deleteComment,
};

export default commentService;