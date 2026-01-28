
export interface ReadingSessionDTO {
    userId: number;
}
// types/readingSession.ts

export interface CreateReadingSessionDTO {
    customerId: number;
    readerId: number;
    note: string;
    birthDate?: string;
    amount: number;
    status: string;

}

export interface ReadingSession {
    querentName: string;
    topic: string;
    id(id: any, arg1: boolean): unknown;

    status: string;
    
    // --- CÁC TRƯỜNG PHẲNG (Flat fields) ---
    // Backend của bạn trả về các trường này (theo ảnh 1)
    fullName?: string;       
    questionName?: string;   
    birthDate?: string | number[]; // Có thể là null, chuỗi, hoặc mảng ngày
    createdAt?: string;
    matchedAt?: Date;

    // --- CÁC TRƯỜNG LỒNG NHAU (Nested Objects) ---
    // Giữ lại để dự phòng nếu backend trả về object đầy đủ
    customer?: { 
        id: number; 
        fullName: string; 
    }; 
    question?: { 
        id: number; 
        content?: string; 
        questionText?: string; 
    }; 

    // Selected Cards
    selectedCards: any; 
}

