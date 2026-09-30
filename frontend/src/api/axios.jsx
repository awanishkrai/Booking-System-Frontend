import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:8000/api",
})
export default api;

export const login = (username, password) => {
    return api.post("/login/", { username, password });
}

export const register = (username, email, password) => {
    return api.post("/register/", { username, email, password });
}