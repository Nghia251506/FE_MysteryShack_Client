"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Timer,
  Send,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "@/components/Header";
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
  const [timeLeft, setTimeLeft] = useState(3600); // 60 phút = 3600 giây
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Lấy danh sách 10 câu hỏi từ BE
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/reader-test/questions`,
        );
        // Giả sử BE trả về list câu hỏi, ta lấy random 10 câu nếu BE chưa làm phần này
        setQuestions(response.data.slice(0, 10));
      } catch (error) {
        console.error("Lỗi lấy câu hỏi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 2. Logic Đếm ngược
  const TEST_DURATION_SECONDS = 3600; // 1 tiếng

  useEffect(() => {
    // 1. Kiểm tra xem đã có startTime trong máy chưa
    let startTime = localStorage.getItem("test_start_time");

    if (!startTime) {
      // Nếu chưa có (lần đầu vào), lưu thời điểm hiện tại (ms)
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
        handleAutoSubmit(); // Tự nộp bài khi hết giờ
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSelect = (questionId: number, option: string) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    // Lưu vào máy luôn
    localStorage.setItem("temp_answers", JSON.stringify(newAnswers));
  };
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.warning(
          "Cảnh báo: Đừng rời khỏi trang thi! Hành động của bạn đã được ghi lại.",
        );
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Khi trang vừa load, bốc dữ liệu cũ lên
  useEffect(() => {
    const savedAnswers = localStorage.getItem("temp_answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // 3. Nộp bài
  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (
        !confirm("Bạn chưa hoàn thành hết các câu hỏi. Vẫn muốn nộp bài chứ?")
      )
        return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/reader-test/submit`,
        answers,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const score = response.data.score; // Giả sử BE trả về điểm
      if (score >= 8) {
        // Ví dụ 8/10 là đỗ
        toast.success(
          `Chúc mừng! Bạn đạt ${score}/10 điểm. Hồ sơ của bạn đang được Admin chờ duyệt.`,
        );
        router.push("/profile");
      } else {
        toast.error(
          `Rất tiếc! Bạn chỉ đạt ${score}/10 điểm. Hãy ôn tập và thử lại sau.`,
        );
        router.push("/profile");
      }
      localStorage.removeItem("test_start_time"); // Xóa để lần sau họ thi lại (nếu trượt) sẽ có thời gian mới
      router.push("/result");
    } catch (error) {
      toast.error("Nộp bài thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = useCallback(() => {
    toast.info(
      "Đã hết thời gian làm bài! Hệ thống sẽ tự động nộp bài của bạn.",
    );
    handleSubmit();
  }, [answers, questions]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0a0510] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0510] text-slate-100 pb-20">
      {/* Thanh đếm ngược cố định */}
      <div className="sticky top-0 z-50 bg-[#0f0a19]/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xl">
              <Timer className="w-6 h-6" />
              {formatTime(timeLeft)}
            </div>
            <div className="hidden md:block w-48 lg:w-96">
              <Progress
                value={(Object.keys(answers).length / questions.length) * 100}
                className="h-2 bg-white/10"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-8"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Nộp Bài
          </Button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bài Kiểm Tra Năng Lực Reader
          </h1>
          <p className="text-slate-400">
            Vui lòng trả lời chính xác các câu hỏi kiến thức Tarot dưới đây.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              key={q.id}
            >
              <Card className="bg-[#0f0a19]/50 border-white/10 overflow-hidden">
                <CardHeader className="bg-white/5 py-4">
                  <CardTitle className="text-lg font-medium text-slate-200">
                    Câu hỏi {index + 1}: {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RadioGroup
                    onValueChange={(value) => handleSelect(q.id, value)}
                    value={answers[q.id]}
                    className="space-y-3"
                  >
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <RadioGroupItem
                          value={opt}
                          id={`q-${q.id}-opt-${i}`}
                          className="border-amber-500 text-amber-500"
                        />
                        <Label
                          htmlFor={`q-${q.id}-opt-${i}`}
                          className="flex-grow cursor-pointer text-slate-300"
                        >
                          {opt}
                        </Label>
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
