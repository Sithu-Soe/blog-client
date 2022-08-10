import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;
const createArticle = (data) => {
	const config = {
		method: "post",
		url: `${API_URL}/api/articles`,
		headers: {
			"Content-Type": "application/json",
			Authorization: authHeader(),
		},
		data: data,
	};

	return axios(config).then(function (response) {
		return response.data;
	});
};

const createImage = (data) => {
	const config = {
		method: "post",
		url: `${API_URL}/api/images`,
		data: data,
		headers: {
			Authorization: authHeader(),
		},
	};
	return axios(config).then(function (response) {
		return response.data;
	});
};

const deleteTemporaryImages = (data) => {
	const config = {
		method: "delete",
		url: `${API_URL}/api/images`,
		headers: {
			"Content-Type": "application/json",
			Authorization: authHeader(),
		},
		data: data,
	};

	return axios(config).then(function (response) {
		return response.data;
	});
};

const getArticle = (id) => {
	const config = {
		method: "get",
		url: `${API_URL}/api/articles/${id}`,
		headers: {},
	};

	return axios(config).then(function (response) {
		return response.data;
	});
};

const getArticles = () => {
	const config = {
		method: "get",
		url: `${API_URL}/api/articles`,
		headers: {},
	};

	return axios(config).then(function (response) {
		return response.data;
	});
};

const deleteArticle = (id) => {
	const config = {
		method: "delete",
		url: `${API_URL}/api/articles/${id}`,
		headers: {
			"Content-Type": "application/json",
			Authorization: authHeader(),
		},
	};

	return axios(config).then(function (response) {
		return response.data;
	});
};

const editArticle = (data, id) => {
	const config = {
		method: "patch",
		url: `${API_URL}/api/articles/${id}`,
		headers: {
			Authorization: authHeader(),
			"Content-Type": "application/json",
		},
		data: data,
	};

	return axios(config).then(function (response) {
		return response.data;
	});
};

export {
	createArticle,
	createImage,
	getArticle,
	getArticles,
	deleteTemporaryImages,
	deleteArticle,
	editArticle,
};
