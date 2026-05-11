"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stack = [
  {
    name: "Solana",
    role: "Blockchain Layer",
    color: "#9945FF",
    svg: (
      <svg viewBox="0 0 397.7 311.7" fill="none" className="w-7 h-7">
        <defs>
          <linearGradient id="sol-a" x1="360.8" y1="351.5" x2="141.2" y2="-69.2" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00ffa3"/><stop offset="1" stopColor="#dc1fff"/>
          </linearGradient>
          <linearGradient id="sol-b" x1="264.8" y1="401.6" x2="45.2" y2="-19.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00ffa3"/><stop offset="1" stopColor="#dc1fff"/>
          </linearGradient>
          <linearGradient id="sol-c" x1="312.5" y1="376.4" x2="92.9" y2="-44.3" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00ffa3"/><stop offset="1" stopColor="#dc1fff"/>
          </linearGradient>
        </defs>
        <path d="M64.6 237.9a10.8 10.8 0 0 1 7.7-3.2h317.8c4.8 0 7.2 5.8 3.8 9.2l-62.8 62.8a10.8 10.8 0 0 1-7.7 3.2H5.7c-4.8 0-7.2-5.8-3.8-9.2z" fill="url(#sol-a)"/>
        <path d="M64.6 3.2A11.1 11.1 0 0 1 72.3 0h317.8c4.8 0 7.2 5.8 3.8 9.2l-62.8 62.8a10.8 10.8 0 0 1-7.7 3.2H5.7C.9 75.2-1.5 69.4 1.9 66z" fill="url(#sol-b)"/>
        <path d="M333.1 120.1a10.8 10.8 0 0 0-7.7-3.2H5.7c-4.8 0-7.2 5.8-3.8 9.2l62.8 62.8a10.8 10.8 0 0 0 7.7 3.2h317.8c4.8 0 7.2-5.8 3.8-9.2z" fill="url(#sol-c)"/>
      </svg>
    ),
  },
  {
    name: "SPL Tokens",
    role: "Payment Currency",
    color: "#14F195",
    svg: <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#14F195] to-[#9945FF] flex items-center justify-center text-xs font-black text-black">SPL</div>,
  },
  {
    name: "React Native",
    role: "Mobile App",
    color: "#61DAFB",
    svg: (
      <svg viewBox="0 0 841.9 595.3" className="w-7 h-7" fill="#61DAFB">
        <g><ellipse cx="420.9" cy="296.5" rx="45" ry="45"/><path d="M420.9 142c-12.5 0-24.5 1.3-36 3.6-5.6-9.7-11.4-18.2-17.3-25.4-23.1-28.1-48.5-38.6-66.7-28.3-17.7 10-22.8 40.5-13.9 81.6.7 3.4 1.5 6.8 2.4 10.2-12.4 3.5-24 7.5-34.5 12.2C216 209.4 186 226.2 186 249.4c0 23.5 31.2 40.7 78.3 53.6-12.8 51.4-6.8 91.8 14.2 103.7 6.4 3.7 13.8 5.5 22.1 5.5 16.1 0 34.7-7.5 53.8-21.5 6.6 4.5 13.2 8.5 19.9 12.2 30.4 17.6 61.4 26.7 91.1 26.7 29.7 0 60.7-9.1 91.1-26.7 6.7-3.9 13.3-8 19.9-12.5 19 13.8 37.5 21.3 53.6 21.3 8.3 0 15.7-1.9 22.1-5.5 21.1-12.2 27.1-52.8 14-104.5 46.5-12.8 77.3-30 77.3-53.3 0-23.2-30-40-77.6-52.5.7-3.4 1.4-6.7 2-10.1 9-41.1 4.1-71.6-13.7-81.6-18.2-10.5-43.9.1-67.2 28.4-5.8 7.1-11.6 15.6-17.2 25.1-11.7-2.3-23.8-3.5-36.2-3.5z"/></g>
      </svg>
    ),
  },
  {
    name: "Expo",
    role: "Build Runtime",
    color: "#000020",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
        <path d="M0 21.775C0 23 .887 24 2.09 24c.627 0 1.22-.303 1.626-.838L12 12.18 20.284 23.162c.405.535.999.838 1.626.838C23.113 24 24 23 24 21.775c0-.374-.093-.742-.28-1.07l-9.294-15.6C14.01 4.402 13.085 4 12 4s-2.01.402-2.426 1.105L.28 20.705C.093 21.034 0 21.402 0 21.775z"/>
      </svg>
    ),
  },
  {
    name: "Rust / Axum",
    role: "Backend API",
    color: "#F74C00",
    svg: (
      <svg viewBox="0 0 50 50" className="w-7 h-7" fill="#F74C00">
        <path d="M 25 3 C 12.87 3 3 12.87 3 25 C 3 37.13 12.87 47 25 47 C 37.13 47 47 37.13 47 25 C 47 12.87 37.13 3 25 3 z M 29.71 9.98 L 31 11.37 L 29.71 12.77 L 28.41 11.37 Z M 24.3 13.43 L 25.59 14.82 L 24.3 16.22 L 23.01 14.82 Z M 19 9.97 L 20.29 11.37 L 19 12.77 L 17.7 11.37 Z"/>
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    role: "Database",
    color: "#336791",
    svg: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#336791">
        <path d="M23.5 11.5c-.27-1.3-.98-2.17-1.89-2.6.16-.65.14-1.3-.1-1.88-.42-1.03-1.4-1.8-2.93-2.3-1.04-.34-2.24-.5-3.58-.5-.64 0-1.3.04-1.94.12a5.44 5.44 0 0 0-1.37-1.03C10.73 2.44 9.5 2.27 8.25 2.6c-1.12.3-2.1.94-2.77 1.78A4.26 4.26 0 0 0 5 6.68c-.8.44-1.4 1.05-1.7 1.81-.42 1.06-.28 2.3.4 3.45-.2.5-.32 1.03-.35 1.56-.08 1.44.4 2.8 1.38 3.8 1.08 1.13 2.7 1.75 4.7 1.83.3.37.62.7.96.97.66.53 1.42.85 2.2.95v1.2c0 .27.22.49.5.49.27 0 .5-.22.5-.5v-1.2c.8-.1 1.56-.42 2.2-.95.34-.27.66-.6.97-.97 1.97-.08 3.6-.7 4.68-1.82.97-1 1.44-2.36 1.36-3.8a5.06 5.06 0 0 0-.35-1.5z"/>
      </svg>
    ),
  },
];

export default function TechStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="tech" className="py-24 px-4 section-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-[#F59E0B] border border-[#F59E0B]/20 mb-5">
            Production-ready stack
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 tracking-tight">
            Powered by the Best
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-lg mx-auto">
            Built with a carefully selected stack for speed, reliability, and the best mobile payment experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 + 0.2 }}
              className="group glass rounded-2xl p-5 flex flex-col items-center text-center gap-3 cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              whileHover={{
                borderColor: `${tech.color}40`,
                boxShadow: `0 0 20px ${tech.color}20`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}25` }}
              >
                {tech.svg}
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm mb-0.5">{tech.name}</p>
                <p className="text-[#64748B] text-xs">{tech.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
