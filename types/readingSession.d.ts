export interface ReadingSessionDTO {
    userId: number;
    readerId: number;
    note: string;
    sessionDate?: string; 
    // Các trường khác tùy ý
}

export interface ReadingSession {
    id: number;
    userId: number;
    readerId: number;
    note: string;
    sessionDate: string;
    // ...
}
