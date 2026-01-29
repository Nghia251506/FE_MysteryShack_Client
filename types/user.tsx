export interface User {
  id: number;
  username: string;
  fullName: string;
  profilePicture?: string;
  role: 'CUSTOMER' | 'READER';
  eloScore: number;
  rating?: number;
  verified?: boolean;
  active: boolean;
  // Các field mở rộng cho Reader
//   tags?: string[];
//   reviewsCount?: number;
}