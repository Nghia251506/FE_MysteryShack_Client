import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // Bắt buộc để gửi cookie JWT
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;