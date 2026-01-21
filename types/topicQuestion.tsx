export interface Topic {
    id: number;
    name: string;
    description: string;
}

export interface TopicQuestion {
    id: number;
    topic: Topic;
    questionText: string;
    isPopular: boolean;
    createdAt: Date;
    updatedAt: Date;
}