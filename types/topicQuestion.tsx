import { Topic } from "./topic";

export interface Question{
    id: number;
    questionText: string;
    topic: Topic;
    isPopular: boolean;
}