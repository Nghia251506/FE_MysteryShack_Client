export interface TarotCard {
  data: any;
  id: number;
  cardNumber: number;
  nameEn: string;
  nameVi?: string;
  arcana: 'MAJOR' | 'MINOR';
  suit?: string;
  imageUrl?: string;
  uprightMeaning?: string;
  reversedMeaning?: string;
  description?: string;
  keywords: string[];
  createdDate: string;
  updatedDate: string;
  active: boolean;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  meaning: string;
}

export interface DrawTarotRequest {
  topic: string;
  birthday?: string; // "YYYY-MM-DD"
}

export interface ShuffleResponse {
  deck: TarotCard[]; // Bộ bài đã xáo
}

export interface InterpretRequest {
  topic: string;
  birthday?: string;
  selectedCards: { cardId: number; isReversed: boolean }[];
}

export interface InterpretResponse {
  cards: DrawnCard[];
  aiInterpretation: string;
}

export interface TarotState {
  deck: TarotCard[];
  selectedCards: DrawnCard[];
  topic: string;
  birthday?: string;
  aiInterpretation: string;
  loading: boolean;
  error: string | null;
}