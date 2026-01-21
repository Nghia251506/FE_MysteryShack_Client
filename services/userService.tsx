// src/services/tarotService.ts
import { User, UserDTO } from '@/types/user';
import api from '../lib/axios';


export const getUserById = async (id : number): Promise<User[]> => {
  const response = await api.get<any>(`/tarot/shuffle/${id}`);
  return response.data.data; // unwrap ở đây
};