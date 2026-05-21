import axios from 'axios';

const API_BASE = 'https://dummyjson.com';

const api = axios.create({
	baseURL: API_BASE,
});

export const blogAPI = {
	getPosts: (limit = 10, skip = 0) =>
		api.get('/posts', { params: { limit, skip } }),

	getPostById: (id) =>
		api.get(`/posts/${id}`),

	getPostsByTag: (tag, limit = 10, skip = 0) =>
		api.get(`/posts/tag/${tag}`, { params: { limit, skip } }),

	getTagList: () =>
		api.get('/posts/tag-list'),

	sortPosts: () =>
		api.get('https://dummyjson.com/posts?sortBy=title&order=asc'),

	createPost: (postData) =>
		api.post('/posts/add', postData),
	updatePost: (postId, postData) =>
		api.put(`/posts/${postId}`, postData),
	deletePost: (postId) =>
		api.delete(`/posts/${postId}`),
};

export default blogAPI;

