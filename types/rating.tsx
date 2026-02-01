export interface Rating {
  id: number;
  customerId: number;
  customerName?: string;
  readerId: number;
  sessionId: number;
  rating: number; // 1-5 sao
  comment: string;
  replyComment: string;
  createdAt: string;
}

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  // ... các chỉ số khác nếu BE trả về
}

export interface CreateRatingDTO {
  requestId: number;     // ID của phiên trải bài
  ratingValue: number;   // BE dùng ratingValue thay vì rating
  comment: string;       // Lời nhắn
  isAnonymous: boolean;  // BE cần cái này để biết có ẩn danh không
}