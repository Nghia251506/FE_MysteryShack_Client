import axios from "@/lib/axios";
import { FcmTokenRequest, FcmResponse } from "../types/fcm";



export const fcmService = {
    registerToken: async (data: FcmTokenRequest): Promise<FcmResponse> => {
        const response = await axios.post(`/fcm/register`, data);
        return response.data;
    }
};