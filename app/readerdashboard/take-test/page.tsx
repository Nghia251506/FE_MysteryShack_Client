"use client";

import { useState, useEffect, useCallback, useMemo } from "react"; // Thêm useMemo
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Timer, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

interface Question {
  id: number;
  question: string;
  options: string[];
}

export default function ReaderTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TEST_DURATION_SECONDS = 3600;

  // 1. Fetch questions (Chỉ chạy ở Client)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/reader-test/questions`
        );
        setQuestions(response.data.slice(0, 10));
      } catch (error) {
        console.error("Lỗi lấy câu hỏi:", error);
        toast.error("Không thể tải câu hỏi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 2. Load saved data & Timer (Phải bọc trong useEffect để tránh lỗi SSR)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load answers
    const savedAnswers = localStorage.getItem("temp_answers");
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Lỗi parse answers");
      }
    }

    // Timer Logic
    let startTime = localStorage.getItem("test_start_time");
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem("test_start_time", startTime);
    }

    const startTimestamp = parseInt(startTime);
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
      const remaining = TEST_DURATION_SECONDS - elapsedSeconds;

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = useCallback(async (currentAnswers = answers) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/reader-test/submit`,
        currentAnswers,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const score = response.data.score;
      if (score >= 8) {
        toast.success(`Chúc mừng! Bạn đạt ${score}/10 điểm.`);
      } else {
        toast.error(`Rất tiếc! Bạn chỉ đạt ${score}/10 điểm.`);
      }
      
      localStorage.removeItem("test_start_time");
      localStorage.removeItem("temp_answers");
      router.push("/readerdashboard/profile");
    } catch (error) {
      toast.error("Nộp bài thất bại.");
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, router]);

  // 3. Auto submit khi hết giờ
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitting && questions.length > 0) {
      toast.info("Đã hết thời gian! Hệ thống tự động nộp bài.");
      handleSubmit();
    }
  }, [timeLeft, isSubmitting, questions.length, handleSubmit]);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: option };
      localStorage.setItem("temp_answers", JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0510] text-slate-100 pb-20">
      <div className="sticky top-0 z-50 bg-[#0f0a19]/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xl">
              <Timer className="w-6 h-6" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Nộp Bài
          </Button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="space-y-6">
          {questions.map((q, index) => (
            <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-[#0f0a19]/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">
                    Câu {index + 1}: {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup onValueChange={(val) => handleSelect(q.id, val)} value={answers[q.id]}>
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border border-white/5 rounded-lg">
                        <RadioGroupItem value={opt} id={`q-${q.id}-${i}`} />
                        <Label htmlFor={`q-${q.id}-${i}`} className="text-slate-300 cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}