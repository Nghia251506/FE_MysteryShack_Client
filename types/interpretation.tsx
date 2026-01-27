export enum InterpretationStatus {
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
  PAID = "PAID",
  SENT_TO_CUSTOMER = "COMPLETED",
}

export interface InterpretationDTO {
  id?: number;
  requestId: number; // Chỉ lấy ID của ReadingSession để đơn giản hóa
  interpretation1: string;
  interpretation2: string;
  interpretation3: string;
  qrPayment?: string;
  advice?: string;
  status: InterpretationStatus;
  createdAt?: string; 
  updatedAt?: string;
}

// types/interpretation.ts
export interface InterpretationSubmitRequest {
  interpretation1: string;
  interpretation2: string;
  interpretation3: string;
  advice: string;
  qrPayment: string;
}

export interface InterpretationResponse extends InterpretationSubmitRequest {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}