export interface CreateReadingSessionDTO {
    customerId: number;
    readerId: number;
    questionId: number;
    topicId: number;
    selectedCards: { id: number; isReversed: boolean }[]; 
    note: string;
    birthDate?: string; // Bắt buộc phải có dòng này
    amount: number;
    status: string;
}

export interface ReadingSession {
    id: number;
    fullName?: string;       
    questionName?: string;   
    birthDate?: string;      
    selectedCards: any;      
    status: string;
    note: string;
    createdAt?: string;
    customer?: { id: number; fullName: string }; // Fallback
    question?: { id: number; questionText: string }; // Fallback
}