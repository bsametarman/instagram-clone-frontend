import apiClient from './axiosConfig';

const getPostById = (postId) => {
    return apiClient.get(`/posts/${postId}`);
};

const deletePost = (postId) => {
    return apiClient.delete(`/posts/${postId}`);
};

const createPost = (file, postData) => {
    const formData = new FormData();
    formData.append('file', file);

    formData.append(
        'postData',
        new Blob([JSON.stringify(postData)], { type: 'application/json' })
    );

    return apiClient.post('/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getPostsByUser = (username, { mediaType, searchTerm, page = 0, size = 9, sort = 'createdAt,desc' }) => {
    return apiClient.get(`/posts/user/${username}`, {
        params: {
            mediaType,
            searchTerm,
            page,
            size,
            sort,
        },
    });
};

const getFeedPosts = (searchTerm, page = 0, size = 12, sort = 'createdAt,desc') => {
    return apiClient.get('/posts/feed', {
        params: { searchTerm, page, size, sort },
    });
};

const getMainPageFeedPosts = (searchTerm, page = 0, size = 12, sort = 'createdAt,desc') => {
    return apiClient.get('/posts/main', {
        params: { searchTerm, page, size, sort },
    });
};

const postService = {
    getPostsByUser,
    getPostById,
    deletePost,
    createPost,
    getFeedPosts,
    getMainPageFeedPosts,
};

export default postService;