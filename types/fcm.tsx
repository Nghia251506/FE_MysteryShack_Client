export interface FcmTokenRequest {
    userId: number;
    token: string;
}

export interface FcmResponse {
    message: string;
    status: number;
}