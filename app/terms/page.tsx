"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Scale, Shield, Users, FileText, 
  CreditCard, Gavel, ArrowRight, Lock 
} from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/5 rounded-full blur-[100px]" />
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
        
        {/* TITLE SECTION */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
            className="text-center mb-16 border-b border-white/10 pb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
                <FileText className="w-4 h-4 text-amber-500" /> Văn bản pháp lý
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Thỏa Thuận Cung Cấp Dịch Vụ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">
                    & Điều Khoản Sử Dụng
                </span>
            </h1>
            <p className="text-slate-500 italic text-sm">
                Cập nhật lần cuối: 28/01/2026
            </p>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-12">

            {/* PHẦN I */}
            <SectionBlock 
                icon={Scale} 
                title="Phần I: Định nghĩa và Phạm vi Dịch vụ"
                delay={0.1}
            >
                <Article title="Điều 1: Bản chất mô hình vận hành">
                    <ul className="list-disc pl-5 space-y-3 text-slate-400">
                        <li>
                            <strong className="text-white">Vai trò Nền tảng:</strong> Mystic Tarot hoạt động với tư cách là sàn giao dịch thương mại điện tử cung cấp dịch vụ (Service Marketplace). Chúng tôi cung cấp hạ tầng công nghệ để kết nối nhu cầu tham vấn giữa Khách hàng và các Chuyên gia độc lập (sau đây gọi là "Reader").
                        </li>
                        <li>
                            <strong className="text-white">Giới hạn Trách nhiệm:</strong> Mystic Tarot không phải là đơn vị trực tiếp cung cấp dịch vụ tư vấn, cũng không phải là đơn vị sử dụng lao động của Reader. Mối quan hệ giữa Reader và Khách hàng là quan hệ dân sự độc lập được xác lập thông qua nền tảng.
                        </li>
                        <li>
                            <strong className="text-white">Tiêu chuẩn Dịch vụ:</strong> Các dịch vụ trên nền tảng được định danh là hoạt động "Tư vấn định hướng", "Giải mã biểu tượng" và "Chiêm nghiệm tâm lý". Chúng tôi nghiêm cấm các hoạt động vi phạm Luật Tín ngưỡng, Tôn giáo hoặc các hành vi lợi dụng tâm linh để gây hoang mang dư luận.
                        </li>
                    </ul>
                </Article>
            </SectionBlock>

            {/* PHẦN II */}
            <SectionBlock 
                icon={Lock} 
                title="Phần II: Chính sách Dữ liệu & Quyền riêng tư"
                delay={0.2}
            >
                <Article title="Điều 2: Thu thập dữ liệu chuyên biệt">
                    <p className="mb-3">Để đảm bảo tính chính xác về mặt chuyên môn (dựa trên nguyên lý của Chiêm tinh học/Tarot), Người dùng đồng ý cung cấp các dữ liệu sau:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Thông tin định danh: Họ tên, Số điện thoại, Email xác thực.</li>
                        <li>
                            <span className="text-amber-500 font-bold">Thông tin kỹ thuật (Bắt buộc):</span> Ngày, tháng, năm sinh và Giờ sinh.
                            <br/><span className="text-xs italic text-slate-500">Giải thích: Đây là tham số kỹ thuật bắt buộc để thiết lập bản đồ thông tin cá nhân (Natal Chart). Việc cung cấp thiếu hoặc sai lệch tham số này có thể ảnh hưởng đến kết quả phân tích của Reader.</span>
                        </li>
                        <li>Dữ liệu hệ thống: Lịch sử giao dịch và nhật ký truy cập để phục vụ công tác an toàn thông tin.</li>
                    </ul>
                </Article>

                <Article title="Điều 3: Chính sách lưu trữ và bảo toàn dữ liệu">
                    <p className="mb-3">Chúng tôi cam kết bảo mật dữ liệu theo tiêu chuẩn mã hóa SSL/TLS.</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong className="text-white">Mục đích lưu trữ:</strong> Hệ thống thực hiện lưu trữ hồ sơ định danh và lịch sử giao dịch nhằm mục đích: (i) Đối soát tài chính kế toán; (ii) Phòng chống gian lận thương mại; và (iii) Bảo vệ quyền lợi người dùng trong các trường hợp tranh chấp.</li>
                        <li><strong className="text-white">Quyền hạn chế:</strong> Người dùng có quyền yêu cầu chỉnh sửa thông tin hoặc tạm ngưng kích hoạt tài khoản. Tuy nhiên, để đảm bảo tính toàn vẹn của hệ thống quản trị, chúng tôi không hỗ trợ xóa bỏ vĩnh viễn các dữ liệu gốc liên quan đến nghĩa vụ tài chính và định danh người dùng.</li>
                    </ul>
                </Article>
            </SectionBlock>

            {/* PHẦN III */}
            <SectionBlock 
                icon={Users} 
                title="Phần III: Quyền và Trách nhiệm các bên"
                delay={0.3}
            >
                <Article title="Điều 4: Đối với khách hàng (Người sử dụng dịch vụ)">
                    <ul className="list-disc pl-5 space-y-3 text-slate-400">
                        <li>
                            <strong className="text-white">Tính chất tham khảo:</strong> Khách hàng hiểu và đồng ý rằng: Nội dung tư vấn từ Reader dựa trên các hệ thống biểu tượng và chiêm nghiệm, mang tính chất tham khảo và hỗ trợ định hướng tư duy.
                        </li>
                        <li>
                            <strong className="text-white">Quyền tự quyết:</strong> Khách hàng là người duy nhất có quyền đưa ra quyết định cuối cùng đối với các vấn đề cá nhân (tài chính, sức khỏe, tình cảm, sự nghiệp). Mystic Tarot và Reader được miễn trừ trách nhiệm đối với bất kỳ quyết định thực tế nào của Khách hàng sau phiên tư vấn.
                        </li>
                        <li>
                            <strong className="text-white">Trách nhiệm thông tin:</strong> Khách hàng cam kết cung cấp thông tin Giờ sinh và Dữ liệu cá nhân trung thực. Nền tảng không chịu trách nhiệm giải quyết khiếu nại về chất lượng tư vấn nếu nguyên nhân xuất phát từ việc sai lệch dữ liệu đầu vào.
                        </li>
                    </ul>
                </Article>

                <Article title="Điều 5: Đối với Reader (Đối tác cung cấp dịch vụ)">
                    <p className="mb-2">Bộ Quy tắc Ứng xử (Code of Conduct): Reader cam kết tuân thủ nghiêm ngặt:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Tư vấn khách quan, trung thực, mang tính xây dựng.</li>
                        <li>Không đưa ra các khẳng định tiêu cực cực đoan (liên quan đến sinh mạng, bệnh nan y) gây hoang mang tâm lý.</li>
                        <li>Không tư vấn hoặc khuyến khích các hành vi vi phạm pháp luật, vi phạm đạo đức xã hội.</li>
                        <li><strong className="text-white">Bảo mật:</strong> Reader tuyệt đối không được lưu trữ, sao chép, chia sẻ hoặc phát tán thông tin cá nhân của Khách hàng.</li>
                    </ul>
                </Article>

                <Article title="Điều 6: Trách nhiệm của Mystic Tarot">
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Đảm bảo nền tảng kỹ thuật hoạt động ổn định, bảo mật.</li>
                        <li>Đóng vai trò trung gian hòa giải và xử lý các tranh chấp phát sinh dựa trên quy định của Nền tảng.</li>
                    </ul>
                </Article>
            </SectionBlock>

            {/* PHẦN IV */}
            <SectionBlock 
                icon={CreditCard} 
                title="Phần IV: Quy định Giao dịch & Tương tác"
                delay={0.4}
            >
                <Article title="Điều 7: Phương thức kết nối">
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong className="text-white">Kênh duy nhất:</strong> Mọi hoạt động đặt lịch và thanh toán phải được thực hiện thông qua hệ thống của Mystic Tarot.</li>
                        <li><strong className="text-white">Cảnh báo rủi ro:</strong> Chúng tôi từ chối chịu trách nhiệm bảo vệ quyền lợi trong trường hợp Người dùng và Reader tự ý thỏa thuận giao dịch cá nhân bên ngoài sự kiểm soát của Nền tảng (nhắn tin riêng, chuyển khoản ngoài...).</li>
                    </ul>
                </Article>

                <Article title="Điều 8: Chính sách thanh toán">
                    <p className="text-slate-400">Giao dịch được xem là hợp lệ khi Khách hàng hoàn tất thanh toán 100% giá trị dịch vụ niêm yết. Chính sách hoàn tiền/hủy lịch được áp dụng theo Quy định Hoàn hủy (Refund Policy) hiện hành được công bố trên website.</p>
                </Article>
            </SectionBlock>

            {/* PHẦN V */}
            <SectionBlock 
                icon={Gavel} 
                title="Phần V: Điều khoản Pháp lý chung"
                delay={0.5}
            >
                <Article title="Điều 9: Quyền sở hữu trí tuệ">
                    <p className="text-slate-400">Chúng tôi bảo lưu mọi quyền sở hữu đối với mã nguồn, giao diện, dữ liệu và thương hiệu. Nghiêm cấm mọi hành vi sao chép, tái sử dụng hoặc khai thác dữ liệu trái phép.</p>
                </Article>

                <Article title="Điều 10: Luật điều chỉnh">
                    <p className="text-slate-400">Thỏa thuận này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh (nếu có) sẽ ưu tiên giải quyết thông qua thương lượng trên tinh thần thiện chí trước khi đưa ra Cơ quan Tài phán có thẩm quyền.</p>
                </Article>
            </SectionBlock>

        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
            <p className="text-slate-500 text-sm mb-6">Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc và đồng ý với các điều khoản trên.</p>
            <button 
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
                Đồng ý và Quay lại trang chủ <ArrowRight className="w-4 h-4" />
            </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/40 py-12 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                  <Image 
                    src="/logo.png" 
                    alt="Mystic Tarot Logo" 
                    width={40} 
                    height={40} 
                    className="rounded-full shadow-md shadow-amber-500/10"
                  />
                  <span className="font-bold text-white">Mystic Tarot © 2026</span>
              </div>
              <div className="flex gap-8 text-sm text-slate-500">
                  <span className="text-amber-500">Điều khoản sử dụng</span>
                  <a href="#" className="hover:text-amber-400 transition-colors">Bảo mật</a>
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
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay, duration: 0.5 }}
        className="bg-[#130823]/50 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-amber-500/20 transition-colors"
    >
        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-400">
                <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="space-y-8">
            {children}
        </div>
    </motion.section>
);

const Article = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        <h3 className="text-lg font-bold text-amber-200/90 font-serif">{title}</h3>
        <div className="text-base leading-relaxed">
            {children}
        </div>
    </div>
);