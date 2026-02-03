"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Timer, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import axios from "@/lib/axios";

// Ép trang này không render tĩnh để tránh lỗi "Failed to collect page data"
export const dynamic = "force-dynamic";

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
  const [currentStep, setCurrentStep] = useState(0);

  const TEST_DURATION_SECONDS = 3600;

  // 1. Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `/reader-test/questions`,
        );
        setQuestions(response.data.slice(0, 10));
      } catch (error) {
        console.error("Lỗi lấy câu hỏi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 2. LOGIC CHỐNG THOÁT MÀN HÌNH & TIMER
  useEffect(() => {
    if (typeof window === "undefined") return;

    // --- Chống rời tab/thu nhỏ trình duyệt ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.warning(
          "⚠️ Cảnh báo: Đừng rời khỏi trang thi! Hành động của bạn đang được giám sát.",
        );
      }
    };

    // --- Chặn F5 hoặc đóng Tab (Hiện confirm của trình duyệt) ---
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Dữ liệu bài thi sẽ bị mất nếu bạn rời đi!";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // --- Khởi tạo Timer & Load Answers cũ ---
    const savedAnswers = localStorage.getItem("temp_answers");
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {}
    }

    let startTime = localStorage.getItem("test_start_time");
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem("test_start_time", startTime);
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - parseInt(startTime!)) / 1000);
      const remaining = TEST_DURATION_SECONDS - elapsed;
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(timer);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // CHUYỂN ĐỔI DATA: Từ { "1": "A" } sang [ { "questionId": 1, "selectedOption": "A" } ]
      const formattedAnswers = Object.entries(answers).map(([qId, option]) => ({
        questionId: Number(qId),
        selectedOption: option,
      }));

      console.log(">>> Data chuẩn Swagger gửi đi:", {
        answers: formattedAnswers,
      });

      // Gọi API nộp bài
      const response = await axios.post(
        `/reader-test/submit`,
        { answers: formattedAnswers }, // Gửi đúng format mảng object
      );

      const score = response.data.score;
      if (score >= 8) {
        toast.success(`Chúc mừng! Bạn đạt ${score}/10 điểm.`);
      } else {
        toast.error(
          `Rất tiếc! Bạn chỉ đạt ${score}/10 điểm. Cố gắng lần sau nhé!`,
        );
      }

      // Dọn dẹp storage
      localStorage.removeItem("test_start_time");
      localStorage.removeItem("temp_answers");

      router.push("/readerdashboard/profile");
    } catch (error: any) {
      console.error("Lỗi nộp bài:", error.response?.data);
      toast.error(error.response?.data?.message || "Nộp bài thất bại.");
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, router]);

  // Tự động nộp khi hết giờ
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0 && !isSubmitting) {
      handleSubmit();
    }
  }, [timeLeft, questions.length, isSubmitting, handleSubmit]);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: option };
      if (typeof window !== "undefined") {
        localStorage.setItem("temp_answers", JSON.stringify(next));
      }
      return next;
    });
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0a0510] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0510] text-slate-100 pb-20">
      {/* Header với Timer & Progress */}
      <div className="sticky top-0 z-50 bg-[#0f0a19]/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xl">
              <Timer className="w-6 h-6" />
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
            <div className="text-sm text-slate-400">
              Câu hỏi{" "}
              <span className="text-white font-bold">{currentStep + 1}</span>/
              {questions.length}
            </div>
          </div>
          {/* Thanh tiến trình */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        {questions.length > 0 && (
          <div className="space-y-8">
            {/* Vùng hiển thị câu hỏi hiện tại */}
            <motion.div
              key={currentStep} // Render lại khi đổi câu
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-[#160d21] border-white/5 shadow-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-slate-200 leading-relaxed">
                    {questions[currentStep].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RadioGroup
                    onValueChange={(v) =>
                      handleSelect(questions[currentStep].id, v)
                    }
                    value={answers[questions[currentStep].id]}
                    className="grid gap-4"
                  >
                    {questions[currentStep].options.map((opt, i) => {
                      const isSelected =
                        answers[questions[currentStep].id] === opt;
                      return (
                        <div
                          key={i}
                          onClick={() =>
                            handleSelect(questions[currentStep].id, opt)
                          }
                          className={`flex items-center space-x-3 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/10"
                              : "border-white/5 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <RadioGroupItem
                            value={opt}
                            id={`opt-${i}`}
                            className={isSelected ? "border-amber-500" : ""}
                          />
                          <Label
                            htmlFor={`opt-${i}`}
                            className={`flex-1 cursor-pointer text-lg ${isSelected ? "text-amber-400" : "text-slate-300"}`}
                          >
                            {opt}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Điều hướng */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="border-white/10 text-slate-300 hover:bg-white/5 px-8"
              >
                Quay lại
              </Button>

              {currentStep < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!answers[questions[currentStep].id]} // Phải chọn mới cho Next
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-10"
                >
                  Câu tiếp theo
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit()}
                  disabled={
                    isSubmitting ||
                    Object.keys(answers).length < questions.length
                  }
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-10 shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Gửi bài thi"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
