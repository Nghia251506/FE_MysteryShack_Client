"use client";

import React from "react";
import {
    Trophy, TrendingUp, Star, Zap, Target,
    ShieldCheck, Clock, CheckCircle2, AlertTriangle, Info, ArrowDown,
    Users,
    BarChart3
} from "lucide-react";
import { easeOut, motion } from "framer-motion";

// Cấu hình animation mặc định cho các Section
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: easeOut }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } }
};

export default function EloSystemPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 py-16 px-6 relative overflow-hidden selection:bg-amber-500/30">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* 1. HERO SECTION (Hiện ngay lập tức) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24 min-h-[60vh] flex flex-col justify-center items-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        <Trophy className="w-3.5 h-3.5" /> Hệ thống xếp hạng Reader và Khách hàng
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                        Cơ chế <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-amber-600">Elo & Rating</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                        Hệ thống vận hành theo cơ chế Live Matching thông minh, đảm bảo sự công bằng và chất lượng cho mọi phiên tư vấn.
                    </p>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-slate-500"
                    >
                        <ArrowDown className="w-6 h-6" />
                    </motion.div>
                </motion.div>

                {/* 2. SECTION: ELO LÀ GÌ? (Scroll Reveal) */}
                {/* CHI TIẾT ELO & RATING */}
                <div className="grid grid-cols-1 gap-12 mb-32">

                    {/* ELO SCORE - CHUYÊN SÂU */}
                    <motion.section {...fadeInUp} className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-10 md:p-16">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/3 shrink-0">
                                <div className="p-4 bg-amber-500/10 rounded-3xl w-fit mb-8">
                                    <BarChart3 className="w-10 h-10 text-amber-500" />
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">Elo Score</h2>
                                <p className="text-amber-500 font-mono text-sm tracking-widest uppercase">Chỉ số Hiệu năng Nội bộ</p>
                            </div>
                            <div className="lg:w-2/3 space-y-6">
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Elo không phải là một con số tĩnh. Đây là <strong>"linh hồn" của thuật toán Matching</strong>. Điểm Elo đại diện cho khả năng vận hành, độ tin cậy và sự chuyên nghiệp của một Reader dưới góc nhìn của hệ thống.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm">
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-500" /> Ý nghĩa với Hệ thống
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            Elo giúp hệ thống phân loại và ưu tiên những Reader có "phong độ" tốt nhất. Khi có một yêu cầu mới (Request), thuật toán sẽ quét danh sách theo thứ tự Elo giảm dần để đảm bảo khách hàng gặp được người xứng đáng nhất tại thời điểm đó.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <Target className="w-4 h-4 text-amber-500" /> Ý nghĩa với Reader
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            Elo là tấm vé ưu tiên. Reader có Elo cao sẽ nhận được nhiều tín hiệu mời tư vấn hơn, từ đó gia tăng thu nhập và xây dựng được lượng khách hàng trung thành nhanh hơn so với những người mới hoặc có điểm vận hành thấp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* RATING - CHUYÊN SÂU */}
                    <motion.section {...fadeInUp} className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-10 md:p-16">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/3 shrink-0">
                                <div className="p-4 bg-purple-500/10 rounded-3xl w-fit mb-8">
                                    <Users className="w-10 h-10 text-purple-500" />
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">Rating Star</h2>
                                <p className="text-purple-500 font-mono text-sm tracking-widest uppercase">Chỉ số Uy tín Công khai</p>
                            </div>
                            <div className="lg:w-2/3 space-y-6">
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Nếu Elo là cách máy tính nhìn bạn, thì <strong>Rating là cách con người nhìn bạn</strong>. Đây là thước đo trực quan nhất về năng lực chuyên môn và thái độ phục vụ khách hàng.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm">
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <Star className="w-4 h-4 text-purple-500" /> Trải nghiệm Khách hàng
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            Sau mỗi phiên tư vấn, khách hàng sẽ để lại đánh giá từ 1 đến 5 sao. Chỉ số này phản ánh mức độ hài lòng về nội dung trải bài, sự thấu cảm và độ chính xác trong lời khuyên của Reader. Một bộ hồ sơ 5 sao luôn là thỏi nam châm thu hút sự tin tưởng tuyệt đối.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-purple-500" /> Mối quan hệ với Elo
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed">
                                            Rating không đứng độc lập. Trong công thức tính Elo, chỉ số hài lòng (S) chiếm trọng số lên đến 40%. Điều này có nghĩa là dù bạn có phản hồi nhanh đến đâu, nhưng nếu khách hàng không hài lòng, điểm Elo của bạn vẫn sẽ bị kéo xuống rất thấp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* 3. SECTION: CÔNG THỨC (Stagger Children) */}
                <motion.div
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="bg-gradient-to-b from-[#0f0f0f] to-black border border-white/10 rounded-[4rem] p-12 mb-32"
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Thuật toán vận hành</h2>
                        <div className="inline-block px-6 py-3 bg-white/5 rounded-2xl border border-white/10 font-mono text-amber-400 text-xl font-bold">
                            R_new = R_old + K × (A - E)
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Clock, title: "Phản hồi (P)", color: "text-blue-400", desc: "Tốc độ chấp nhận Request. Nhanh hơn = Điểm cao hơn." },
                            { icon: ShieldCheck, title: "Hoàn thành (C)", color: "text-green-400", desc: "Đảm bảo phiên tư vấn diễn ra trọn vẹn, không bị ngắt quãng." },
                            { icon: TrendingUp, title: "Hài lòng (S)", color: "text-amber-400", desc: "Chất lượng từ nội dung trải bài dựa trên đánh giá khách hàng." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all"
                            >
                                <item.icon className={`w-10 h-10 ${item.color} mb-6`} />
                                <h4 className="font-bold text-white mb-3 text-lg">{item.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 4. SECTION: MATCHING FLOW (Horizontal Scroll Effect) */}
                <motion.div {...fadeInUp} className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Quy trình Matching</h2>
                        <p className="text-slate-500 text-sm">Hệ thống tự động hóa 100% để đảm bảo tốc độ</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { step: "01", title: "Yêu cầu", desc: "Khách hàng gửi Request" },
                            { step: "02", title: "Lọc Reader", desc: "Tìm người Online & Sẵn sàng" },
                            { step: "03", title: "Xếp hạng", desc: "Ưu tiên theo điểm Elo" },
                            { step: "04", title: "Thông báo", desc: "Gửi tín hiệu tới Reader" },
                            { step: "05", title: "Kết nối", desc: "Thiết lập phiên tư vấn" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative p-6 bg-[#0a0a0a] rounded-3xl border border-white/5 text-center group"
                            >
                                <div className="text-4xl font-black text-white/[0.03] absolute inset-0 flex items-center justify-center group-hover:text-amber-500/5 transition-colors">{item.step}</div>
                                <h4 className="text-sm font-bold text-amber-500 mb-2 relative z-10">{item.title}</h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed relative z-10">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 5. WARNING SECTION */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="p-5 bg-red-500/10 rounded-full animate-pulse">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-bold text-white mb-2">Lưu ý về Kỷ luật</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Các hành vi cố tình treo máy, bỏ phiên hoặc gian lận đánh giá sẽ bị hệ thống tự động trừ điểm Elo cực nặng hoặc tạm khóa tài khoản vĩnh viễn.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}