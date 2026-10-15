import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
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
// Backend: path('auth/login/', obtain_auth_token, name='login')
export const login = (username, password) =>
    api.post("/auth/login/", { username, password });

// Backend: path('auth/register/', views.register, name='register')
export const register = (username, email, password) =>
    api.post("/auth/register/", { username, email, password });

// ─── Rooms ───────────────────────────────────────────────────────────────────
// Backend: path('rooms/', views.list_rooms, name='room-list')
export const getAllRooms = () => api.get("/rooms/");

// Backend: path('rooms/<int:room_id>/', views.get_room, name='room-detail')
export const getRoom = (roomId) => api.get(`/rooms/${roomId}/`);

// Backend: path('rooms/<int:room_id>/bookings/', views.room_bookings, name='room-bookings')
export const getRoomBookings = (roomId) => api.get(`/rooms/${roomId}/bookings/`);

// ─── Bookings ────────────────────────────────────────────────────────────────
// Backend: path('bookings/book/', views.book_room, name='book-room')
export const createBooking = (roomId, date, startTime, endTime, idempotencyKey) => {
    const payload = {
        room_id: Number(roomId),
        idempotency_key: idempotencyKey || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined),
    };
    if (date) payload.date = date;
    if (startTime) payload.start_time = startTime.length === 5 ? `${startTime}:00` : startTime;
    if (endTime) payload.end_time = endTime.length === 5 ? `${endTime}:00` : endTime;

    return api.post("/bookings/book/", payload);
};

// Backend: path('bookings/', views.my_bookings, name='my-bookings')
export const allBookings = () => api.get("/bookings/");

// Backend: path('bookings/cancel/', views.cancel_booking, name='cancel-booking')
export const cancelBooking = (bookingId, idempotencyKey) => {
    const payload = {};
    if (idempotencyKey) payload.idempotency_key = idempotencyKey;
    if (bookingId) payload.booking_id = Number(bookingId);
    return api.post("/bookings/cancel/", payload);
};
