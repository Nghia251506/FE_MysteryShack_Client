"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldAlert, Brain, Stethoscope, UserCheck, 
  Store, WifiOff, RefreshCw, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

export default function DisclaimerPage() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 px-6 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link href="/" className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-75 group-hover:scale-105 transition-transform duration-700" />
                      <Image 
                        src="/logo.png" 
                        alt="Mystic Tarot Logo" 
                        width={50} 
                        height={50} 
                        className="relative z-10 transition-transform duration-500 group-hover:rotate-3 rounded-full"
                      />
                  </div>
                  <span className="font-bold text-xl text-white tracking-tighter hidden sm:block">
                    Mystic<span className="text-amber-500"> Tarot</span>
                  </span>
              </Link>
              
              <button 
                onClick={() => router.push('/')}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Về trang chủ
              </button>
          </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        
        {/* HERO TITLE */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
            className="text-center mb-16 border-b border-white/10 pb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldAlert className="w-4 h-4" /> Tuyên bố quan trọng
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Miễn Trừ Trách Nhiệm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
                    & Giới Hạn Dịch Vụ
                </span>
            </h1>
            <p className="text-slate-500 italic text-sm max-w-2xl mx-auto">
                Vui lòng đọc kỹ các nội dung dưới đây trước khi sử dụng dịch vụ. Việc tiếp tục sử dụng Mystic Tarot đồng nghĩa với việc bạn đã hiểu và chấp nhận các tuyên bố này.
            </p>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-8">

            {/* MỤC 1: BẢN CHẤT DỊCH VỤ */}
            <SectionBlock 
                icon={Brain} 
                title="1. Bản chất về nội dung và dịch vụ"
                delay={0.1}
            >
                <Article title="Tham vấn định hướng">
                    Mọi nội dung, thông điệp và sự diễn giải trong các phiên kết nối giữa Reader và Khách hàng được xây dựng dựa trên các hệ thống biểu tượng, ký hiệu học và chiêm nghiệm tâm lý. Chúng tôi xác lập đây là dịch vụ hỗ trợ tinh thần và định hướng tư duy cá nhân.
                </Article>
                <Article title="Tính chủ quan">
                    Người dùng hiểu và chấp nhận rằng các diễn giải mang tính chất chủ quan dựa trên chuyên môn của từng Reader. Mystic Tarot không cam kết về tính chính xác tuyệt đối, sự ứng nghiệm hay khả năng dự báo chính xác các sự kiện trong tương lai.
                </Article>
            </SectionBlock>

            {/* MỤC 2: GIỚI HẠN CHUYÊN MÔN */}
            <SectionBlock 
                icon={Stethoscope} 
                title="2. Giới hạn đối với các lời khuyên chuyên môn"
                delay={0.2}
            >
                <p className="mb-4 text-slate-400 italic">Nội dung cung cấp trên Mystic Tarot không thay thế và không có giá trị tương đương với các dịch vụ tư vấn chuyên môn sau:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                        <strong className="text-red-400 block mb-2">Y tế & Sức khỏe</strong>
                        <p className="text-sm">Chúng tôi không cung cấp chẩn đoán y khoa, lời khuyên điều trị bệnh lý hoặc tư vấn tâm thần chuyên sâu.</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                        <strong className="text-amber-400 block mb-2">Pháp lý & Tài chính</strong>
                        <p className="text-sm">Mọi thông tin liên quan đến quyết định đầu tư, quản lý tài sản hoặc các vấn đề tố tụng pháp lý chỉ mang tính chất tham khảo.</p>
                    </div>
                </div>
                <div className="mt-4 p-4 border-l-2 border-slate-600 bg-slate-900/30">
                    <strong className="text-white">Khuyến nghị:</strong> Người dùng có nghĩa vụ tìm kiếm sự hỗ trợ từ các chuyên gia có bằng cấp và thẩm quyền pháp lý (Bác sĩ, Luật sư, Chuyên gia tài chính) trước khi đưa ra bất kỳ quyết định quan trọng nào trong các lĩnh vực này.
                </div>
            </SectionBlock>

            {/* MỤC 3: QUYỀN TỰ QUYẾT */}
            <SectionBlock 
                icon={UserCheck} 
                title="3. Quyền tự quyết và trách nhiệm của khách hàng"
                delay={0.3}
            >
                <Article title="Quyền tự quyết tối cao">
                    Khách hàng là chủ thể duy nhất giữ quyền đưa ra quyết định cuối cùng đối với mọi vấn đề cá nhân.
                </Article>
                <Article title="Miễn trừ trách nhiệm hệ quả">
                    Mystic Tarot hoàn toàn miễn trừ trách nhiệm đối với bất kỳ thiệt hại trực tiếp hay gián tiếp, hữu hình hay vô hình (bao gồm nhưng không giới hạn ở: tổn thất tài chính, biến động tâm lý, đổ vỡ quan hệ) phát sinh từ việc Khách hàng lựa chọn hành động dựa trên nội dung tham vấn của Reader.
                </Article>
                <Article title="Đánh giá sự phù hợp">
                    Khách hàng chịu trách nhiệm tự đánh giá mức độ phù hợp của thông tin tham vấn đối với hoàn cảnh riêng biệt của mình.
                </Article>
            </SectionBlock>

            {/* MỤC 4: VAI TRÒ MARKETPLACE */}
            <SectionBlock 
                icon={Store} 
                title="4. Phân định vai trò Marketplace (Bên thứ ba)"
                delay={0.4}
            >
                <ul className="list-disc pl-5 space-y-3 text-slate-400">
                    <li>
                        <strong className="text-white">Tính độc lập của Reader:</strong> Reader trên Mystic Tarot là các đối tác độc lập, không phải là nhân viên, đại diện hay đại lý của Nền tảng. Mọi quan điểm và nội dung do Reader cung cấp thuộc về trách nhiệm cá nhân của phía đối tác.
                    </li>
                    <li>
                        <strong className="text-white">Kiểm soát tương tác:</strong> Mystic Tarot đóng vai trò cung cấp hạ tầng kết nối kỹ thuật. Chúng tôi không can thiệp và không chịu trách nhiệm về các phát ngôn cá nhân mang tính chủ quan của Reader trong các phiên tư vấn thời gian thực.
                    </li>
                </ul>
            </SectionBlock>

            {/* MỤC 5: RỦI RO KỸ THUẬT */}
            <SectionBlock 
                icon={WifiOff} 
                title="5. Rủi ro về giao dịch và kỹ thuật"
                delay={0.5}
            >
                <Article title="Giao dịch ngoài hệ thống">
                    Mystic Tarot từ chối mọi trách nhiệm bảo vệ quyền lợi hoặc xử lý khiếu nại trong trường hợp Người dùng và Reader tự ý thiết lập các giao dịch, thỏa thuận hoặc trao đổi thông tin bên ngoài sự kiểm soát của Nền tảng.
                </Article>
                <Article title="Sự cố khách quan">
                    Chúng tôi không cam kết dịch vụ sẽ luôn không bị gián đoạn hoặc không có lỗi kỹ thuật do các yếu tố bất khả kháng (sự cố đường truyền mạng, máy chủ toàn cầu).
                </Article>
            </SectionBlock>

            {/* MỤC 6: CẬP NHẬT */}
            <SectionBlock 
                icon={RefreshCw} 
                title="6. Sự thay đổi và quyền cập nhật"
                delay={0.6}
            >
                <p className="text-slate-400">
                    Mystic Tarot bảo lưu quyền sửa đổi, cập nhật hoặc tạm dừng bất kỳ phần nào của dịch vụ và nội dung trên website để phù hợp với định hướng phát triển và quy định của pháp luật Việt Nam tại từng thời điểm mà không cần thông báo trước.
                </p>
            </SectionBlock>

        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
            <button 
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold rounded-full transition-all flex items-center gap-2 mx-auto"
            >
                Quay lại trang chủ <ArrowRight className="w-4 h-4" />
            </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/40 py-12 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                  <Image 
                    src="/logo.png" 
                    alt="Mystic Tarot Logo" 
                    width={40} 
                    height={40} 
                    className="rounded-full shadow-md shadow-amber-500/10"
                  />
                  <span className="font-bold text-white">Mystic Tarot © 2026</span>
              </Link>
              <div className="flex gap-8 text-sm text-slate-500">
                  <Link href="/terms" className="hover:text-amber-400 transition-colors">Điều khoản</Link>
                  <span className="text-amber-500">Miễn trừ trách nhiệm</span>
                  <Link href="/contact" className="hover:text-amber-400 transition-colors">Liên hệ</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const SectionBlock = ({ icon: Icon, title, children, delay }: { icon: any, title: string, children: React.ReactNode, delay: number }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5 }}
        className="bg-[#130823]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:border-amber-500/20 transition-colors"
    >
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.section>
);

const Article = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-200">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed text-justify">
            {children}
        </p>
    </div>
);