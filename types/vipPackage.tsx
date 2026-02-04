export interface VipPackage {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  benefits: string;
  maxJobsPerDay: number;
  createdAt?: string; // Instant map về string (ISO format)
}

export type VipPackageDto = VipPackage;