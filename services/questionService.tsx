import axios from "@/lib/axios"
import { Question } from "@/types/topicQuestion";

export const QuestionService = {
    getQuestionsByTopic: async (topicId: number): Promise<Question[]> => {
        const response = await axios.get(`/v1/questions/topic/${topicId}`);
        console.log(response.data);
        return response.data;
    }
};