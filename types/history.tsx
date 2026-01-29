import { User } from "./auth"; // Giả sử bạn đã có type User
import { InterpretationDTO } from "./interpretation";
import { Question } from "./topicQuestion";

export enum ReadingStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  WAITING_PAYMENT = "WAITING_PAYMENT"
}

export interface SelectedCard {
  cardId: number;
  cardNumber: number;
  nameVi: string;
  imageUrl: string;
  reversed: boolean;
}


export interface ReadingSession {
  id: number;
  status: string;
  selectedCards: SelectedCard[];
  matchedAt: string;
  acceptedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface History {
  id: number;
  customer: User;
  reader: User | null;
  question: Question;
  request: ReadingSession;
  interpretationForm: InterpretationDTO | null;
  status: ReadingStatus;
  rating: number | null;
  feedback: string | null;
  createdAt: string;
  completedAt: string | null;
}