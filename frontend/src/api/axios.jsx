import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (username, password) =>
    api.post("/login/", { username, password });

export const register = (username, email, password) =>
    api.post("/register/", { username, email, password });

// ─── Rooms ───────────────────────────────────────────────────────────────────
export const getAllRooms = () => api.get("/list/");

export const getRoom = (roomId) => api.get(`/room/${roomId}/`);

// ─── Bookings ────────────────────────────────────────────────────────────────
export const createBooking = (roomId, date, startTime, endTime) =>
    api.post("/booking/", { room: roomId, date, start_time: startTime, end_time: endTime });

export const allBookings = () => api.get("/bookings/");

export const cancelBooking = (bookingId) =>
    api.delete(`/booking/${bookingId}/`);
