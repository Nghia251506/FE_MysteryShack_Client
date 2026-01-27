import axios from "@/lib/axios"
import { Topic } from "@/types/topic";

export const TopicService = {
    getAllTopics: async (): Promise<Topic[]> => {
        const response = await axios.get("/v1/topics");
        console.log(response.data);
        return response.data;
    }
};