import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const login = (username, password) => {
	return axios
		.post(API_URL + "/users/login", {
			username,
			password,
		})
		.then((response) => {
			if (response.data.accessToken) {
				localStorage.setItem("user", JSON.stringify(response.data));
			}

			return response.data;
		});
};

const getCurrentUser = () => {
	return JSON.parse(localStorage.getItem("user"));
};

export { login, getCurrentUser };
