"use client";

import React from "react";
import { Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";

// --- TIKTOK ICON CUSTOM ---
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SocialFloating = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/share/g/1CB4YWHTsF/",
      glowColor: "rgba(24, 119, 242, 0.5)",
      hoverBg: "group-hover:bg-[#1877F2]",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/mystictarots2026/",
      glowColor: "rgba(238, 42, 123, 0.5)",
      hoverBg: "group-hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    },
    {
      name: "TikTok",
      icon: <TikTokIcon className="w-5 h-5" />,
      url: "https://www.tiktok.com/@leoaslan98",
      glowColor: "rgba(0, 242, 234, 0.4)", // Ánh sáng Cyan Neon
      hoverBg: "group-hover:bg-black", // Nền đen như ý ông muốn
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-6">
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="relative group flex items-center justify-center"
        >
          {/* 1. QUẦNG SÁNG TỎA MÀU (LUÔN CHÁY) */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
            className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
            style={{ backgroundColor: social.glowColor }}
          />

          {/* 2. ICON BOX CHÍNH */}
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className={`
              relative z-10 w-12 h-12 flex items-center justify-center 
              rounded-2xl border border-white/10 bg-[#050505]/60 backdrop-blur-xl
              text-white transition-all duration-500
              group-hover:border-white/40 shadow-2xl
              ${social.hoverBg}
            `}
            style={{
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 15px ${social.glowColor}`
            }}
          >
            <span className="relative z-10 transition-transform group-hover:scale-110">
                {social.icon}
            </span>
          </motion.div>

          {/* 3. TOOLTIP BLACK & WHITE */}
          <div className="absolute right-full mr-4 px-3 py-1.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-xl">
            {social.name}
          </div>
        </motion.a>
      ))}
    </div>
  );
};

export default SocialFloating;