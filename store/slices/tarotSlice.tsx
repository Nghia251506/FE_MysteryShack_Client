import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu chuẩn cho lá bài trong Store
export interface TarotCard {
  id: number;
  name: string;
  img: string;
  isReversed: boolean;
}

interface TarotState {
  drawnCards: TarotCard[]; // Đổi từ selectedCards -> drawnCards cho khớp
  topic: string;
  question: string;        // Thêm trường này (quan trọng cho Booking)
  isDrawing: boolean;
}

// Lấy dữ liệu từ LocalStorage để F5 không mất bài
const getInitialState = (): TarotState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tarot-session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi parse storage", e);
      }
    }
  }
  return {
    drawnCards: [],
    topic: '',
    question: '',
    isDrawing: false,
  };
};

const tarotSlice = createSlice({
  name: 'tarot',
  initialState: getInitialState(),
  reducers: {
    // 1. Action lưu Chủ đề & Câu hỏi (Sửa tên cho khớp tarot-draw)
    setTopicAndQuestion: (state, action: PayloadAction<{ topic: string; question: string }>) => {
      state.topic = action.payload.topic;
      state.question = action.payload.question;
      // Lưu ngay vào local
      if (typeof window !== 'undefined') localStorage.setItem('tarot-session', JSON.stringify(state));
    },

    // 2. Action thêm bài (Sửa tên từ addSelectedCard -> addCard)
    addCard: (state, action: PayloadAction<TarotCard>) => {
      // Chỉ cho phép lưu tối đa 3 lá
      if (state.drawnCards.length < 3) {
        state.drawnCards.push(action.payload);
        if (typeof window !== 'undefined') localStorage.setItem('tarot-session', JSON.stringify(state));
      }
    },

    // 3. Action Reset (Sửa tên từ resetTarotSession -> resetSession)
    resetSession: (state) => {
      state.drawnCards = [];
      state.topic = '';
      state.question = '';
      state.isDrawing = false;
      if (typeof window !== 'undefined') localStorage.removeItem('tarot-session');
    },
  },
});

// Xuất đúng các tên hàm mà file tarot-draw đang gọi
export const { setTopicAndQuestion, addCard, resetSession } = tarotSlice.actions;
export default tarotSlice.reducer;