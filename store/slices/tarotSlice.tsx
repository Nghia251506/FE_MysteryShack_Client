import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Định nghĩa kiểu dữ liệu chuẩn cho lá bài
export interface TarotCard {
  id: number;
  name: string;
  img: string;
  isReversed: boolean;
}

// 2. Định nghĩa State bao gồm cả Tên hiển thị và ID từ Database
interface TarotState {
  drawnCards: TarotCard[];
  topic: string;           // Tên chủ đề (để hiển thị UI)
  topicId: number | null;  // ID chủ đề (để gửi API)
  question: string;        // Nội dung câu hỏi (để hiển thị UI)
  questionId: number | null; // ID câu hỏi (để gửi API)
  isDrawing: boolean;
}

// 3. Khởi tạo State từ LocalStorage (tránh mất data khi reload trang)
const getInitialState = (): TarotState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tarot-session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi đồng bộ dữ liệu Tarot:", e);
      }
    }
  }
  return {
    drawnCards: [],
    topic: '',
    topicId: null,
    question: '',
    questionId: null,
    isDrawing: false,
  };
};

const tarotSlice = createSlice({
  name: 'tarot',
  initialState: getInitialState(),
  reducers: {
    // Action quan trọng nhất: Lưu thông tin từ Topic/Question Service
    setTopicAndQuestion: (
      state, 
      action: PayloadAction<{ 
        topic: string; 
        topicId: number; 
        question: string; 
        questionId: number;
      }>
    ) => {
      state.topic = action.payload.topic;
      state.topicId = action.payload.topicId;
      state.question = action.payload.question;
      state.questionId = action.payload.questionId;
      
      // Đồng bộ vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tarot-session', JSON.stringify(state));
      }
    },

    // Thêm lá bài vào trải bài (Tối đa 3 lá)
    addCard: (state, action: PayloadAction<TarotCard>) => {
      if (state.drawnCards.length < 3) {
        state.drawnCards.push(action.payload);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tarot-session', JSON.stringify(state));
        }
      }
    },

    // Reset toàn bộ phiên làm việc (Dùng sau khi Booking thành công)
    resetSession: (state) => {
      state.drawnCards = [];
      state.topic = '';
      state.topicId = null;
      state.question = '';
      state.questionId = null;
      state.isDrawing = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tarot-session');
      }
    },
  },
});

export const { setTopicAndQuestion, addCard, resetSession } = tarotSlice.actions;
export default tarotSlice.reducer;