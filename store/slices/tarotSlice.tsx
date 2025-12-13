import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shuffleDeck, interpretCards } from '../../services/tarotService';
import { TarotState, DrawTarotRequest, InterpretRequest, InterpretResponse, DrawnCard, TarotCard } from '../../types/tarot';

const initialState: TarotState = {
    deck: [],
    selectedCards: [],
    topic: '',
    birthday: undefined,
    aiInterpretation: '',
    loading: false,
    error: null,
};

// Thunk: Xáo bài theo chủ đề
export const fetchShuffledDeck = createAsyncThunk(
    'tarot/fetchShuffledDeck',
    async (request: DrawTarotRequest) => {
        const response = await shuffleDeck(request);
        return response; // Giữ nguyên object { success, message, data }
    }
);

// Thunk: Gửi 3 lá đã chọn để AI giải nghĩa
export const submitForInterpretation = createAsyncThunk(
    'tarot/submitForInterpretation',
    async (request: InterpretRequest) => {
        const response = await interpretCards(request);
        return response;
    }
);

const tarotSlice = createSlice({
    name: 'tarot',
    initialState,
    reducers: {
        setTopicAndBirthday: (state, action: PayloadAction<{ topic: string; birthday?: string }>) => {
            state.topic = action.payload.topic;
            state.birthday = action.payload.birthday;
        },
        addSelectedCard: (state, action: PayloadAction<DrawnCard>) => {
            if (state.selectedCards.length < 3) {
                state.selectedCards.push(action.payload);
            }
        },
        removeSelectedCard: (state, action: PayloadAction<number>) => {
            state.selectedCards = state.selectedCards.filter((_, index) => index !== action.payload);
        },
        resetTarotSession: (state) => {
            state.deck = [];
            state.selectedCards = [];
            state.aiInterpretation = '';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch shuffled deck
            .addCase(fetchShuffledDeck.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShuffledDeck.fulfilled, (state, action) => {
                state.loading = false;
                state.deck = action.payload;
            })
            .addCase(fetchShuffledDeck.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi xáo bài';
            })

            // Submit for interpretation
            .addCase(submitForInterpretation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitForInterpretation.fulfilled, (state, action: PayloadAction<InterpretResponse>) => {
                state.loading = false;
                state.selectedCards = action.payload.cards;
                state.aiInterpretation = action.payload.aiInterpretation;
            })
            .addCase(submitForInterpretation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi gọi AI giải nghĩa';
            });
    },
});

export const {
    setTopicAndBirthday,
    addSelectedCard,
    removeSelectedCard,
    resetTarotSession
} = tarotSlice.actions;

export default tarotSlice.reducer;