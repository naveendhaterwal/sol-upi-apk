"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { QrCode, Coins, Activity, Wallet } from "lucide-react";

const features = [
  {
    icon: <QrCode size={22} />,
    title: "Scan & Pay",
    description: "Pay any UPI merchant instantly using SPL assets. Point, scan, confirm — done in seconds.",
    size: "large",
    accent: "#4D43FE",
    bg: "linear-gradient(135deg, #1a1640 0%, #0D0F24 100%)",
    border: "rgba(77,67,254,0.35)",
    glow: "rgba(77,67,254,0.20)",
    extra: (
      <div className="mt-4 flex items-center gap-2">
        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-[#4D43FE]/50 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-0.5 p-1">
            {[...Array(9)].map((_, i) => <div key={i} className="w-1 h-1 rounded-sm" style={{ background: i % 3 === 0 || i === 4 ? "#4D43FE" : "rgba(77,67,254,0.2)" }} />)}
          </div>
        </div>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#4D43FE] to-transparent" />
        <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[10px] font-bold text-[#10B981]">✓</div>
      </div>
    ),
  },
  {
    icon: <Coins size={22} />,
    title: "SPL Token Payments",
    description: "Use SOL, USDC, and other Solana assets to pay — with real-time exchange rate display.",
    size: "medium",
    accent: "#F59E0B",
    bg: "linear-gradient(135deg, #1C1400 0%, #0D0F24 100%)",
    border: "rgba(245,158,11,0.30)",
    glow: "rgba(245,158,11,0.15)",
    extra: (
      <div className="mt-4 flex gap-2">
        {[{ sym: "SOL", c: "#9945FF", val: "2.4" }, { sym: "USDC", c: "#2775CA", val: "9,890" }].map(t => (
          <div key={t.sym} className="flex-1 glass rounded-xl p-2 border" style={{ borderColor: `${t.c}30` }}>
            <div className="w-5 h-5 rounded-full mb-1" style={{ background: `${t.c}30` }} />
            <p className="text-[10px] font-bold text-white">{t.sym}</p>
            <p className="text-[9px] text-white/50">{t.val}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Activity size={22} />,
    title: "Real-Time Activity",
    description: "Track every payment with intelligent on-chain activity feeds and status updates.",
    size: "medium",
    accent: "#06B6D4",
    bg: "linear-gradient(135deg, #001C20 0%, #0D0F24 100%)",
    border: "rgba(6,182,212,0.30)",
    glow: "rgba(6,182,212,0.15)",
    extra: (
      <div className="mt-4 space-y-1.5">
        {[{ n: "Sharma Kirana", a: "-₹500", c: "#10B981" }, { n: "BigBazaar", a: "-₹540", c: "#10B981" }, { n: "Top-up", a: "+₹1,000", c: "#4D43FE" }].map(tx => (
          <div key={tx.n} className="flex items-center justify-between glass rounded-lg px-2 py-1">
            <span className="text-[9px] text-white/70">{tx.n}</span>
            <span className="text-[9px] font-bold" style={{ color: tx.c }}>{tx.a}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Wallet size={22} />,
    title: "Wallet Intelligence",
    description: "View balances, assets, and payment history beautifully — your Solana portfolio at a glance.",
    size: "large",
    accent: "#8B5CF6",
    bg: "linear-gradient(135deg, #160B2E 0%, #0D0F24 100%)",
    border: "rgba(139,92,246,0.35)",
    glow: "rgba(139,92,246,0.20)",
    extra: (
      <div className="mt-4">
        <div className="flex items-end gap-1 h-10">
          {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, background: i === 5 ? "#8B5CF6" : `rgba(139,92,246,${0.2 + i * 0.05})` }} />
          ))}
        </div>
        <p className="text-[9px] text-white/30 mt-1.5 text-center">7-day activity</p>
      </div>
    ),
  },
];

export default function FeatureCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 px-4 section-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-[#A78BFA] border border-[#4D43FE]/20 mb-5">
            Built for real payments
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 tracking-tight">
            Everything you need<br />
            <span className="gradient-text">to pay on Solana</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            A complete UPI-style experience, rebuilt from the ground up for Solana SPL assets.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
              className="group relative rounded-3xl p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: f.bg,
                border: `1px solid ${f.border}`,
                boxShadow: `0 0 0 0 ${f.glow}`,
              }}
              whileHover={{ boxShadow: `0 0 30px ${f.glow}, 0 20px 40px rgba(0,0,0,0.4)` }}
            >
              {/* Glow blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none transition-all duration-500 group-hover:scale-150"
                style={{ background: `radial-gradient(circle, ${f.glow} 0%, transparent 70%)`, filter: "blur(20px)" }}
                aria-hidden="true" />

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: `${f.accent}20`, color: f.accent, border: `1px solid ${f.accent}30` }}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-white">{f.title}</h3>
              </div>

              <p className="text-[#94A3B8] text-sm leading-relaxed">{f.description}</p>

              {f.extra}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
