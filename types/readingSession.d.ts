<<<<<<< HEAD
export interface ReadingSessionDTO {
    userId: number;
=======
// types/readingSession.ts

export interface CreateReadingSessionDTO {
    customerId: number;
>>>>>>> 244d10fb9834328ad90fa5e1b2ba8ad690d63e16
    readerId: number;
    note: string;
<<<<<<< HEAD
    sessionDate?: string; 
    // Các trường khác tùy ý
=======
    birthDate?: string;
    amount: number;
    status: string;
>>>>>>> 244d10fb9834328ad90fa5e1b2ba8ad690d63e16
}

export interface ReadingSession {
    id: number;
<<<<<<< HEAD
    userId: number;
    readerId: number;
    note: string;
    sessionDate: string;
    // ...
}
=======
    status: string;
    
    // --- CÁC TRƯỜNG PHẲNG (Flat fields) ---
    // Backend của bạn trả về các trường này (theo ảnh 1)
    fullName?: string;       
    questionName?: string;   
    birthDate?: string | number[]; // Có thể là null, chuỗi, hoặc mảng ngày
    note?: string;
    createdAt?: string;

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
>>>>>>> 244d10fb9834328ad90fa5e1b2ba8ad690d63e16
