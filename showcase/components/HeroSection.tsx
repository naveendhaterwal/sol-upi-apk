"use client";

import { motion } from "framer-motion";
import { GitFork, Play, ArrowRight } from "lucide-react";
import { TryNowButton } from "./TryNowButton";
import PhoneMockup from "./PhoneMockup";

const badges = [
  { label: "Built on Solana", color: "#9945FF" },
  { label: "Devnet Live", color: "#06B6D4" },
  { label: "React Native + Expo", color: "#4D43FE" },
  { label: "SPL Tokens", color: "#F59E0B" },
];

const headline = "Pay Any UPI Merchant\nUsing Solana";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-bg pt-28 pb-16 px-4"
    >
      {/* Ambient glow orbs */}
      <div
        className="animate-orb-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(77,67,254,0.20) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />
      <div
        className="animate-orb-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* Left: copy */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">

            {/* Pill tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-[#A78BFA] border border-[#4D43FE]/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse inline-block" />
              Indian Fintech × Solana — Hackathon 2025
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white mb-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.015 } },
              }}
            >
              {headline.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                  }}
                  className={char === "\n" ? "block" : undefined}
                  style={char === "\n" ? {} : undefined}
                >
                  {char === "\n" ? "" : char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Gradient accent word */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed mb-8 max-w-lg"
            >
              SolUPI brings{" "}
              <span className="text-white font-medium">familiar UPI-style payments</span>{" "}
              to Solana SPL assets. Scan. Confirm. Done — in seconds.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <TryNowButton variant="primary" />
              <a
                href="#video"
                className="group flex items-center gap-2 glass hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-sm"
              >
                <Play size={15} fill="white" />
                Watch Demo
              </a>
              <a
                href="#"
                className="flex items-center gap-2 glass hover:bg-white/10 text-white font-semibold px-5 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-sm"
              >
                <GitFork size={15} />
                View GitHub
              </a>
            </motion.div>

            {/* Badge row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className="text-xs font-medium px-3 py-1 rounded-full glass border"
                  style={{
                    color: badge.color,
                    borderColor: `${badge.color}40`,
                    backgroundColor: `${badge.color}10`,
                  }}
                >
                  {badge.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="flex-shrink-0 flex justify-center items-center"
          >
            <div className="animate-float">
              <PhoneMockup />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs text-[#64748B] font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#4D43FE] to-transparent" />
      </motion.div>
    </section>
  );
}
