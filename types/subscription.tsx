export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

// Entity cơ bản
export interface Subscription {
  id: number;
  readerId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  remainingJobs: number;
  createdAt: string;
}

// DTO hứng từ API GET /api/subscriptions/current
export interface SubscriptionDTO {
  id: number;
  readerId: number;
  readerFullName: string;
  packageId: number;
  packageName: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  remainingJobs: number;
}

// DTO dành cho Admin Quản lý
export interface SubscriptionAdminResponse {
  id: number;
  username: string;
  fullName: string;
  packageName: string;
  price: number;
  startDate: string;
  endDate: string;
  remainingJobs: number;
  status: SubscriptionStatus;
}