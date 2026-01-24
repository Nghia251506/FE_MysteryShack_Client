import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/interpretations";

const getConfig = () => {
  // Lấy token từ localStorage (đảm bảo key là accessToken hoặc token tùy project của bạn)
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
  submit: async (sessionId: number | string, content: string) => {
    // Backend nhận Map<String, String> nên phải gói content vào object
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

  // 2. User thanh toán (Dùng trong trang Result của User)
  confirmPayment: async (sessionId: number | string) => {
    const response = await axios.post(
        `${API_URL}/confirm-payment/${sessionId}`, 
        {}, // Body rỗng
        getConfig()
    );
    return response.data;
  },

  // 3. User xem bài (Dùng trong trang Result của User)
  // Lưu ý: Tên hàm là getView (khớp với file bạn đưa)
  getView: async (sessionId: number | string) => {
    const response = await axios.get(
        `${API_URL}/customer/view/${sessionId}`, 
        getConfig()
    );
    return response.data;
  }
};