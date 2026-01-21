import { TarotCard } from "./tarot";
import { TopicQuestion } from "./topicQuestion";
import { User } from "./user";

export interface ReadingSession {
    id: number;
    customer: any;
    question: any;
    selectedCards: TarotCard;
    status: string;
    createdAt: Date;
    updateAt: Date;
}

export interface ReadingSessionDTO {
    customer: User;
    question: TopicQuestion;
    selectedCards: TarotCard,
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
}