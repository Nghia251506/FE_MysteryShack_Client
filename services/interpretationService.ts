import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interpretations`;

const getConfig = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const InterpretationService = {
  // 1. Reader gửi bài (Dùng trong ReaderDashboard)
  submit: async (sessionId: number, data: {
    interpretation1: string;
    interpretation2: string;
    interpretation3: string;
    advice: string;
  }) => {
    return await axios.post(`${API_URL}/submit/${sessionId}`, data);
  },

  confirmPayment: async (sessionId: number | string) => {
    const response = await axios.post(
        `${API_URL}/confirm-payment/${sessionId}`, 
        {}, 
        getConfig()
    );
    return response.data;
  },

  getView: async (sessionId: number | string) => {
    const response = await axios.get(
        `${API_URL}/customer/view/${sessionId}`, 
        getConfig()
    );
    console.log("=== GET VIEW RESPONSE ===");
    console.log(response.data);
    return response.data;
  },

  updateStatus: async (sessionId: number | string, status: string) => {
    const response = await axios.patch(
        `${API_URL}/${sessionId}/notify-paid`, 
        { status }, 
        getConfig()
    );
    return response.data;
  },
};