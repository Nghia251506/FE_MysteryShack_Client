// src/services/tarotService.ts
import api from '../lib/axios';
import { DrawTarotRequest, ShuffleResponse, InterpretRequest, InterpretResponse, TarotCard } from '../types/tarot';

export const shuffleDeck = async (request: DrawTarotRequest): Promise<TarotCard[]> => {
  const response = await api.post<any>('/tarot/shuffle', request);
  return response.data.data; // unwrap ở đây
};

export const interpretCards = async (request: InterpretRequest): Promise<InterpretResponse> => {
  const response = await api.post<any>('/tarot/interpret', request);
  return response.data.data;
};