"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Shield, Database, Lock, UserX, 
  Gavel, Scale, Fingerprint, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Shield className="w-4 h-4" /> Cam kết bảo vệ dữ liệu
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Chính Sách Bảo Mật <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    & Quyền Riêng Tư
                </span>
            </h1>
            <p className="text-slate-500 italic text-sm max-w-2xl mx-auto">
                Mystic Tarot cam kết minh bạch trong việc thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn theo các tiêu chuẩn an toàn cao nhất.
            </p>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-12">

            {/* PHẦN I: TUYÊN BỐ PHÁP LÝ */}
            <SectionBlock 
                icon={Scale} 
                title="I. Tuyên bố Bản chất Dịch vụ & Giới hạn Pháp lý"
                delay={0.1}
            >
                <Article title="Vai trò Nền tảng">
                    Mystic Tarot vận hành như một bên thứ ba cung cấp giải pháp hạ tầng kết nối giữa Khách hàng và các Nhà tham vấn độc lập (Reader). Chúng tôi không trực tiếp cung cấp dịch vụ tư vấn và không chịu trách nhiệm liên đới về nội dung cá biệt trong từng phiên kết nối.
                </Article>
                <Article title="Định danh Dịch vụ">
                    Mọi hoạt động trên Nền tảng được xác lập là “Chiêm nghiệm tâm lý”, “Tham vấn định hướng cá nhân” và “Giải mã hệ thống biểu tượng”. Chúng tôi kiên quyết từ chối và nghiêm cấm các hành vi mang tính chất mê tín dị đoan hoặc các hoạt động trái với quy định của Luật Tín ngưỡng, Tôn giáo hiện hành.
                </Article>
                <Article title="Quyền tự quyết của Khách hàng">
                    Nội dung tư vấn chỉ mang giá trị tham khảo và gợi mở tư duy. Khách hàng là chủ thể duy nhất giữ quyền tự quyết và chịu trách nhiệm đối với các quyết định trong đời sống thực tế.
                </Article>
            </SectionBlock>

            {/* PHẦN II: DỮ LIỆU */}
            <SectionBlock 
                icon={Database} 
                title="II. Chính sách Dữ liệu & Quyền riêng tư"
                delay={0.2}
            >
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-amber-200/90 font-serif">Danh mục thu thập dữ liệu chuyên biệt</h3>
                    <p className="text-slate-400 text-sm">Để đảm bảo chiều sâu và tính cá nhân hóa của dịch vụ, Nền tảng xử lý các nhóm dữ liệu sau:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm">
                        <li><strong className="text-white">Thông tin định danh:</strong> Họ tên, số điện thoại, email xác thực.</li>
                        <li><strong className="text-white">Thông tin nhân trắc học kỹ thuật:</strong> Ngày, tháng, năm sinh và Giờ sinh chính xác. Đây là tham số bắt buộc để các đối tác Reader thực hiện việc thiết lập hệ thống bản đồ thông tin cá nhân.</li>
                        <li><strong className="text-white">Dữ liệu hệ thống:</strong> Lịch sử tương tác, nhật ký giao dịch và thông tin thiết bị truy cập nhằm đảm bảo an ninh mạng.</li>
                    </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <h3 className="text-lg font-bold text-amber-200/90 font-serif">Duy trì Hồ sơ và Tính toàn vẹn Dữ liệu</h3>
                    <p className="text-slate-400 text-sm">Tại Mystic Tarot, chúng tôi áp dụng cơ chế bảo toàn dữ liệu để bảo vệ quyền lợi của tất cả các bên:</p>
                    <Article title="Mục đích duy trì">
                        Để phục vụ công tác đối soát tài chính kế toán, phòng chống các hành vi gian lận và đảm bảo bằng chứng pháp lý trong trường hợp phát sinh tranh chấp, Nền tảng thực hiện việc duy trì lưu trữ hồ sơ định danh và lịch sử hoạt động của người dùng trong suốt quá trình vận hành hệ thống.
                    </Article>
                    <Article title="Quyền hạn người dùng">
                        Khách hàng và Reader có quyền yêu cầu cập nhật, đính chính thông tin hoặc tạm ngừng hoạt động tài khoản. Tuy nhiên, các dữ liệu gốc liên quan đến giao dịch và định danh pháp lý sẽ được giữ lại trên máy chủ nhằm đảm bảo tính minh bạch và tuân thủ các quy định về quản lý thương mại điện tử.
                    </Article>
                </div>
            </SectionBlock>

            {/* PHẦN III: TƯƠNG TÁC */}
            <SectionBlock 
                icon={UserX} 
                title="III. Quy chuẩn Tương tác & Tiêu chuẩn Đạo đức"
                delay={0.3}
            >
                <Article title="Bảo mật Tương tác (No-Chat Policy)">
                    Mystic Tarot không tích hợp tính năng nhắn tin trực tiếp trên Nền tảng. Quy định này nhằm bảo vệ sự riêng tư tối đa cho Khách hàng, đồng thời ngăn chặn các tương tác không chính thức nằm ngoài sự kiểm soát an toàn của hệ thống.
                </Article>
                <Article title="Trách nhiệm của Reader">
                    Đội ngũ Reader cam kết tuân thủ đạo đức hành nghề: Không đưa ra các dự báo khẳng định về sinh mạng, bệnh tật; không lợi dụng lòng tin để trục lợi; và tuyệt đối bảo mật thông tin cá nhân của Khách hàng.
                </Article>
                <Article title="Trách nhiệm của Khách hàng">
                    Cam kết cung cấp thông tin (đặc biệt là Giờ sinh) trung thực; tôn trọng sự riêng tư và thời gian của Reader; không yêu cầu các dịch vụ vi phạm pháp luật hoặc đạo đức xã hội.
                </Article>
            </SectionBlock>

            {/* PHẦN IV: BẢO MẬT KỸ THUẬT */}
            <SectionBlock 
                icon={Lock} 
                title="IV. Cơ chế Bảo mật Kỹ thuật"
                delay={0.4}
            >
                <p className="mb-4 text-slate-400">Chúng tôi áp dụng các tiêu chuẩn an ninh thông tin cao cấp để bảo vệ tài sản dữ liệu:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <Fingerprint className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <h4 className="text-white font-bold mb-1">Mã hóa SSL/TLS</h4>
                        <p className="text-xs text-slate-500">Bảo vệ toàn bộ dữ liệu truyền tải</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <Lock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <h4 className="text-white font-bold mb-1">Kiểm soát truy cập</h4>
                        <p className="text-xs text-slate-500">Nguyên tắc "đặc quyền tối thiểu"</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <Shield className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                        <h4 className="text-white font-bold mb-1">PCI DSS</h4>
                        <p className="text-xs text-slate-500">An toàn giao dịch tài chính</p>
                    </div>
                </div>
            </SectionBlock>

            {/* PHẦN V: TRANH CHẤP */}
            <SectionBlock 
                icon={Gavel} 
                title="V. Giải quyết Tranh chấp & Luật áp dụng"
                delay={0.5}
            >
                <Article title="Cơ chế hòa giải">
                    Mọi khiếu nại phát sinh sẽ được Mystic Tarot tiếp nhận và xử lý dựa trên nguyên tắc công bằng, ưu tiên thương lượng giữa các bên.
                </Article>
                <Article title="Miễn trừ trách nhiệm hệ quả">
                    Nền tảng không chịu trách nhiệm về các thiệt hại gián tiếp hoặc hệ quả phát sinh từ các quyết định cá nhân của người dùng sau phiên tư vấn.
                </Article>
                <Article title="Luật điều chỉnh">
                    Chính sách này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp không thể hòa giải sẽ được đưa ra cơ quan tài phán có thẩm quyền để giải quyết.
                </Article>
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
                    className="rounded-full shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-white group-hover:text-amber-400 transition-colors">Mystic Tarot © 2026</span>
              </Link>
              <div className="flex gap-8 text-sm text-slate-500">
                  <Link href="/terms" className="hover:text-amber-400 transition-colors">Điều khoản</Link>
                  <span className="text-amber-500">Bảo mật</span>
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
        className="bg-[#130823]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:border-blue-500/20 transition-colors"
    >
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
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
        <h3 className="text-base font-bold text-slate-200">{title}:</h3>
        <p className="text-slate-400 text-sm leading-relaxed text-justify">
            {children}
        </p>
    </div>
);