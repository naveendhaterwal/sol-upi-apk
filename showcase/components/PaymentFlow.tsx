"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { QrCode, CheckCircle, Send, Award } from "lucide-react";

const steps = [
  {
    icon: <QrCode size={20} />,
    label: "Scan QR",
    detail: "Point at any UPI QR code",
    color: "#4D43FE",
    num: "01",
  },
  {
    icon: <CheckCircle size={20} />,
    label: "Confirm Payment",
    detail: "Review amount & choose token",
    color: "#8B5CF6",
    num: "02",
  },
  {
    icon: <Send size={20} />,
    label: "Send Transaction",
    detail: "Signed & submitted on Solana",
    color: "#06B6D4",
    num: "03",
  },
  {
    icon: <Award size={20} />,
    label: "Success Receipt",
    detail: "Instant on-chain confirmation",
    color: "#10B981",
    num: "04",
  },
];

export default function PaymentFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => {
      setActive(i);
      i++;
      if (i < steps.length) setTimeout(tick, 500);
    };
    setTimeout(tick, 300);
  }, [inView]);

  return (
    <section id="flow" className="py-24 px-4 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at bottom, #0D1035 0%, #050714 60%)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-[#06B6D4] border border-[#06B6D4]/20 mb-5">
            Four steps to pay
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 tracking-tight">
            How <span className="gradient-text">SolUPI</span> Works
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-lg mx-auto">
            The simplest path from QR code to confirmed payment — powered by Solana.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-start justify-between gap-4 relative">
          {/* Connector line */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-white/5 z-0">
            <motion.div
              className="h-full rounded-full origin-left"
              style={{ background: "linear-gradient(90deg, #4D43FE, #8B5CF6, #06B6D4, #10B981)" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 + 0.2 }}
              className="flex-1 flex flex-col items-center text-center relative z-10"
            >
              {/* Icon circle */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500"
                style={{
                  background: active >= i ? `${step.color}20` : "rgba(255,255,255,0.04)",
                  border: `2px solid ${active >= i ? step.color : "rgba(255,255,255,0.08)"}`,
                  color: active >= i ? step.color : "#475569",
                  boxShadow: active >= i ? `0 0 20px ${step.color}40` : "none",
                }}
              >
                {step.icon}
              </div>

              <span className="text-[10px] font-bold text-white/20 tracking-widest mb-1">{step.num}</span>
              <h3 className="font-display font-bold text-base text-white mb-1">{step.label}</h3>
              <p className="text-[#64748B] text-sm">{step.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex md:hidden flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex gap-4 items-start"
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                  style={{
                    background: active >= i ? `${step.color}20` : "rgba(255,255,255,0.04)",
                    border: `2px solid ${active >= i ? step.color : "rgba(255,255,255,0.08)"}`,
                    color: active >= i ? step.color : "#475569",
                    boxShadow: active >= i ? `0 0 16px ${step.color}40` : "none",
                  }}
                >
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    className="w-0.5 my-1"
                    style={{ height: 32, background: active > i ? step.color : "rgba(255,255,255,0.08)" }}
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.5 }}
                  />
                )}
              </div>
              <div className="pt-2 pb-8">
                <span className="text-[9px] font-bold text-white/20 tracking-widest">{step.num}</span>
                <h3 className="font-display font-bold text-base text-white mb-0.5">{step.label}</h3>
                <p className="text-[#64748B] text-sm">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4"
        >
          {[
            { val: "<400ms", label: "Block time", color: "#4D43FE" },
            { val: "~$0", label: "Network fees", color: "#10B981" },
            { val: "SPL", label: "Token standard", color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center border" style={{ borderColor: `${s.color}20` }}>
              <p className="font-display font-black text-2xl mb-1" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[#64748B] text-xs">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
