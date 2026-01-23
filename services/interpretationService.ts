import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/interpretations";

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
  // 1. API: Submit Interpretation (Reader gửi bài)
  // URL: POST http://localhost:8080/api/v1/interpretations/submit/{sessionId}
  submit: async (sessionId: number | string, content: string) => {
    // Backend đang hứng @RequestBody Map<String, String> payload
    // Nên chúng ta gửi object JSON đơn giản chứa key "content"
    const payload = {
        content: content
    };
    
    const response = await axios.post(
        `${API_URL}/submit/${sessionId}`, 
        payload, 
        getConfig()
    );
    return response.data;
  },

  // 2. API: Xác nhận thanh toán (Nếu cần dùng sau này)
  confirmPayment: async (sessionId: number | string) => {
    const response = await axios.post(
        `${API_URL}/confirm-payment/${sessionId}`, 
        {}, 
        getConfig()
    );
    return response.data;
  },

  // 3. API: View Interpretation (Khách xem bài)
  // URL: GET http://localhost:8080/api/v1/interpretations/customer/view/{sessionId}
  getView: async (sessionId: number | string) => {
    const response = await axios.get(
        `${API_URL}/customer/view/${sessionId}`, 
        getConfig()
    );
    return response.data;
  }
};