export interface Review {
  customerName: string;
  customerAvatar: string | null;
  ratingValue: number;
  comment: string;
  createdAt: string; // ISO Date string
  isAnonymous: boolean;
}

export interface ReaderProfile {
  id: number;
  fullName: string;
  avatarUrl: string;
  bio: string;
  email: string;
  birthDate: string;
  status: "ONLINE" | "BUSY" | "OFFLINE";
  eloScore: number;
  reputation: number;
  experienceYears: number;
  averageRating: number;
  totalReviews: number;
  recentReviews: Review[];
  bookingPrice?: number; // Trường này BE trả thêm hoặc mặc định ở FE
}