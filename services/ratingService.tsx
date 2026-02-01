import axios from '@/lib/axios';
import { Rating, RatingStats, CreateRatingDTO } from '../types/rating';

const API_URL = '/ratings';

export const RatingService = {
  // POST /api/ratings/create: Gửi đánh giá mới
  createRating: async (data: CreateRatingDTO): Promise<Rating> => {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
  },

  // GET /api/ratings/reader/{readerId}: Lấy danh sách đánh giá của Reader
  getReaderRatings: async (readerId: number): Promise<Rating[]> => {
    const response = await axios.get(`${API_URL}/reader/${readerId}`);
    return response.data;
  },

  // GET /api/ratings/reader/{readerId}/stats: Lấy thống kê (sao trung bình, tổng lượt)
  getReaderStats: async (readerId: number): Promise<RatingStats> => {
    const response = await axios.get(`${API_URL}/reader/${readerId}/stats`);
    return response.data;
  },

  // GET /api/ratings/pending: Danh sách các phiên chưa được đánh giá
  getPendingRatings: async (): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/pending`);
    return response.data;
  }
};