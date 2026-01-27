"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, Sparkles } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative max-w-sm w-full bg-gradient-to-b from-[#1a1025] to-[#0a0510] border border-red-500/20 rounded-[2.5rem] p-10 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <LogOut className="w-10 h-10 text-red-500" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Đăng Xuất?</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Bạn có chắc chắn muốn rời đi?
            </p>

            <div className="space-y-3">
              <button
                onClick={onConfirm}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Xác nhận rời đi
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-2xl font-medium transition-all"
              >
                Ở lại thêm chút nữa
              </button>
            </div>
            <div className="absolute top-4 left-4 opacity-10"><Sparkles className="w-6 h-6 text-amber-500" /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};