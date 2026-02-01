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
  qrCode: string;
}

export interface MatchingRequest {
  excludeIds: number[];
  currentCustomerId: number;
}