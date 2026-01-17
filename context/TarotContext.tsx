"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Định nghĩa kiểu dữ liệu chuẩn cho toàn bộ App
export interface TarotCard {
  id: number;
  name: string;
  img: string;
  keywords: string[];
  shortMsg: string;
  isReversed?: boolean;
}

interface TarotSession {
  userName: string;
  birthDate: string;
  topic: string;
  question: string;
  drawnCards: TarotCard[]; // Lưu 3 lá bài đã rút
}

interface TarotContextType {
  session: TarotSession;
  updateSession: (data: Partial<TarotSession>) => void;
  resetSession: () => void;
}

const defaultSession: TarotSession = {
  userName: "",
  birthDate: "",
  topic: "",
  question: "",
  drawnCards: [],
};

const TarotContext = createContext<TarotContextType | undefined>(undefined);

export const TarotProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<TarotSession>(defaultSession);

  // (Tùy chọn) Load lại từ LocalStorage để F5 không mất
  useEffect(() => {
    const saved = localStorage.getItem("tarot_session");
    if (saved) setSession(JSON.parse(saved));
  }, []);

  const updateSession = (data: Partial<TarotSession>) => {
    setSession((prev) => {
      const newState = { ...prev, ...data };
      localStorage.setItem("tarot_session", JSON.stringify(newState));
      return newState;
    });
  };

  const resetSession = () => {
    setSession(defaultSession);
    localStorage.removeItem("tarot_session");
  };

  return (
    <TarotContext.Provider value={{ session, updateSession, resetSession }}>
      {children}
    </TarotContext.Provider>
  );
};

export const useTarotSession = () => {
  const context = useContext(TarotContext);
  if (!context) throw new Error("useTarotSession must be used within TarotProvider");
  return context;
};