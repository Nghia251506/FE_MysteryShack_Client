"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, Shield } from 'lucide-react'; // Thêm icon Shield cho Anonymous
import { useAppDispatch, useAppSelector } from '@/hooks/useAppRedux';
import { toast } from 'react-toastify'; 
import { createNewRating } from '@/store/slices/ratingSlice';
import { RootState } from '@/store/store';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    readerName: string;
    requestId: number; // ID phiên trải bài (cái số siêu dài 9007...)
    onSuccess?: () => void;
}

const RatingModal = ({ isOpen, onClose, readerName, requestId, onSuccess }: RatingModalProps) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state: RootState) => state.rating);
    
    const [ratingValue, setRatingValue] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false); // Thêm trạng thái ẩn danh

    const handleSubmit = async () => {
        if (ratingValue === 0) {
            toast.error("Vui lòng chọn số sao!");
            return;
        }

        try {
            // KHỚP 100% VỚI JSON BE YÊU CẦU
            const payload = {
                requestId: Number(requestId), // Đảm bảo là kiểu số
                ratingValue: ratingValue,      // BE yêu cầu ratingValue
                comment: comment.trim() || "Khách hàng không để lại lời nhắn.",
                isAnonymous: isAnonymous
            };

            console.log("Payload gửi BE:", payload);

            await (dispatch(createNewRating(payload)) as any).unwrap();
            
            toast.success("Cảm ơn bạn đã đánh giá!");
            if (onSuccess) onSuccess();
            onClose();
            
            // Reset state
            setRatingValue(0);
            setComment("");
        } catch (error: any) {
            toast.error(error || "Gửi đánh giá thất bại");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                        className="bg-[#1a1a2e] border border-amber-500/30 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-600 to-purple-700 p-6 text-center relative">
                            <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white">
                                <X size={24} />
                            </button>
                            <h3 className="text-xl font-bold text-white mb-1">Đánh giá trải nghiệm</h3>
                            <p className="text-white/80 text-sm">Bạn thấy phần luận giải của {readerName} thế nào?</p>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6">
                            {/* Star Rating */}
                            <div className="flex justify-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingValue(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transition-transform hover:scale-125"
                                    >
                                        <Star 
                                            size={40} 
                                            className={`${(hover || ratingValue) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-600'} transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Comment Area */}
                            <div className="space-y-2">
                                <label className="text-amber-400 text-sm font-medium flex items-center gap-2">
                                    <MessageSquare size={16} /> Lời nhắn gửi Reader
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Chia sẻ cảm nhận của bạn về buổi trải bài này..."
                                    className="w-full bg-[#0f0f1e] border border-gray-700 rounded-xl p-4 text-white focus:border-amber-500 outline-none h-32 resize-none transition-all"
                                />
                            </div>

                            {/* Anonymous Toggle */}
                            <div className="flex items-center gap-3 py-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsAnonymous(!isAnonymous)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${isAnonymous ? 'bg-amber-500' : 'bg-gray-700'}`}
                                >
                                    <motion.div 
                                        animate={{ x: isAnonymous ? 22 : 2 }}
                                        className="absolute top-1 w-3 h-3 bg-white rounded-full"
                                    />
                                </button>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Shield size={12} /> Đánh giá ẩn danh
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                                    loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-purple-600 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        Đang gửi... <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Star size={18} /></motion.div>
                                    </span>
                                ) : (
                                    <>Gửi đánh giá <Send size={18} /></>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RatingModal;