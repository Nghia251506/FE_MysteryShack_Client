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
  // 1. Reader gửi bài (Dùng trong ReaderDashboard)
  submit: async (sessionId: number | string, data: {
        interpretation1: string;
        interpretation2: string;
        interpretation3: string;
        advice: string;
        qrPayment: string;}) => {
    // Backend nhận Map<String, String> nên phải gói content vào object

  // FIXED: Gửi đúng field names như backend expect
  // submit: async (sessionId: number | string, cardInterpretations: Record<string, string>) => {
  //   // Backend expect: interpretation1, interpretation2, interpretation3, advice, qrPayment
  //   // Frontend đang gửi: card1, card2, card3, summary
    
  //   const payload = {
  //     interpretation1: cardInterpretations.card1 || "",
  //     interpretation2: cardInterpretations.card2 || "",
  //     interpretation3: cardInterpretations.card3 || "",
  //     advice: cardInterpretations.summary || "",
  //     qrPayment: "" // Có thể để trống hoặc thêm URL ảnh QR nếu cần
  //   };
    
    // console.log("=== PAYLOAD ĐÚNG FORMAT ===");
    // console.log(JSON.stringify(payload, null, 2));
    // console.log("===========================");
    const response = await axios.post(
        `${API_URL}/submit/${sessionId}`, 
        // data, 
        getConfig()
    );
    return response.data;
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
    return response.data;
  }
};