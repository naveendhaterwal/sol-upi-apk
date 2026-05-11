"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Home, Activity, CheckCircle, ArrowLeft, Zap } from "lucide-react";

type Screen = "home" | "scan" | "confirm" | "processing" | "success" | "activity";
const SCREENS: Screen[] = ["home", "scan", "confirm", "processing", "success", "activity"];
const SCREEN_LABELS = ["Home", "Scan QR", "Confirm", "Processing", "Success", "Activity"];

/* ── Individual screen components ─────────────────────── */

function HomeScreen() {
  return (
    <div className="flex flex-col h-full bg-[#080B1A] text-white overflow-hidden">
      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pt-2 pb-1 text-[9px] font-semibold text-white/70">
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <span>▮▮▮</span><span>WiFi</span><span>100%</span>
        </div>
      </div>
      {/* Header */}
      <div className="px-4 pt-2 pb-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-[9px] text-white/50 font-medium">Good evening,</p>
            <p className="text-[13px] font-bold font-display text-white">Arjun Kumar</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4D43FE] to-[#8B5CF6] flex items-center justify-center text-[11px] font-bold">AK</div>
        </div>
        {/* Balance card */}
        <div className="rounded-2xl p-3 mb-3" style={{ background: "linear-gradient(135deg, #4D43FE 0%, #8B5CF6 100%)" }}>
          <p className="text-[9px] text-white/70 mb-0.5">Total Balance</p>
          <p className="text-[22px] font-black font-display text-white leading-none mb-2">₹12,450.00</p>
          <div className="flex gap-2">
            {[{ label: "SOL", val: "2.4", color: "#9945FF" }, { label: "USDC", val: "9,890", color: "#2775CA" }].map(t => (
              <div key={t.label} className="flex items-center gap-1 bg-white/15 rounded-full px-2 py-0.5">
                <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <span className="text-[9px] font-semibold text-white">{t.val} {t.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[{ icon: <QrCode size={13} />, label: "Scan" }, { icon: <ArrowLeft size={13} className="rotate-180" />, label: "Send" }, { icon: <ArrowLeft size={13} />, label: "Receive" }, { icon: <Activity size={13} />, label: "History" }].map(a => (
            <div key={a.label} className="flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#4D43FE]/30 transition-colors">{a.icon}</div>
              <span className="text-[8px] text-white/50">{a.label}</span>
            </div>
          ))}
        </div>
        {/* Transactions */}
        <p className="text-[9px] font-semibold text-white/50 uppercase tracking-wider mb-2">Recent</p>
        {[
          { name: "Chai Stall", amt: "-₹30", time: "2m ago", color: "#10B981" },
          { name: "BigBazaar", amt: "-₹540", time: "1h ago", color: "#F59E0B" },
          { name: "Auto Wallet Top-up", amt: "+₹1,000", time: "3h ago", color: "#4D43FE" },
        ].map(tx => (
          <div key={tx.name} className="flex items-center gap-2 py-1.5 border-b border-white/5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: `${tx.color}25`, color: tx.color }}>{tx.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-white truncate">{tx.name}</p>
              <p className="text-[8px] text-white/40">{tx.time}</p>
            </div>
            <span className="text-[10px] font-bold" style={{ color: tx.amt.startsWith("+") ? "#10B981" : "#F8FAFC" }}>{tx.amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScanScreen() {
  return (
    <div className="flex flex-col h-full bg-[#080B1A] text-white">
      <div className="flex justify-between items-center px-5 pt-2 pb-1 text-[9px] font-semibold text-white/70">
        <span>9:41</span><span>100%</span>
      </div>
      <div className="px-4 pt-1 pb-2 flex items-center gap-2">
        <ArrowLeft size={14} className="text-white/70" />
        <p className="text-[13px] font-bold font-display">Scan & Pay</p>
      </div>
      {/* Camera viewfinder */}
      <div className="mx-4 rounded-2xl overflow-hidden relative" style={{ height: 160, background: "linear-gradient(180deg, #0D1035 0%, #080B1A 100%)" }}>
        {/* Corner brackets */}
        {[["top-2 left-2", "border-t-2 border-l-2"], ["top-2 right-2", "border-t-2 border-r-2"], ["bottom-2 left-2", "border-b-2 border-l-2"], ["bottom-2 right-2", "border-b-2 border-r-2"]].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 border-[#4D43FE] ${border} rounded-sm`} />
        ))}
        {/* Fake QR grid */}
        <div className="absolute inset-6 grid grid-cols-7 gap-0.5 opacity-20">
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} className="rounded-sm" style={{ background: Math.random() > 0.5 ? "white" : "transparent", aspectRatio: "1" }} />
          ))}
        </div>
        {/* Scan line */}
        <div className="animate-scan absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#4D43FE] to-transparent rounded-full" style={{ boxShadow: "0 0 8px #4D43FE" }} />
        {/* Merchant detected */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#10B981]/20 border border-[#10B981]/40 rounded-full px-3 py-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[9px] font-semibold text-[#10B981]">Merchant Detected</span>
        </div>
      </div>
      <div className="px-4 pt-3">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#4D43FE]/20 border border-[#4D43FE]/40 flex items-center justify-center text-[10px] font-bold text-[#4D43FE]">S</div>
            <div>
              <p className="text-[11px] font-bold text-white">Sharma Kirana Store</p>
              <p className="text-[8px] text-white/40">solupi@sharma · Verified UPI</p>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-white/40 text-center mt-3">Point camera at any UPI QR code</p>
      </div>
    </div>
  );
}

function ConfirmScreen() {
  return (
    <div className="flex flex-col h-full bg-[#080B1A] text-white px-4">
      <div className="flex justify-between items-center px-1 pt-2 pb-1 text-[9px] font-semibold text-white/70">
        <span>9:41</span><span>100%</span>
      </div>
      <div className="flex items-center gap-2 pt-1 pb-3">
        <ArrowLeft size={14} className="text-white/70" />
        <p className="text-[13px] font-bold font-display">Confirm Payment</p>
      </div>
      {/* Merchant */}
      <div className="glass rounded-2xl p-3 mb-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[12px] font-bold text-[#F59E0B]">S</div>
        <div>
          <p className="text-[11px] font-bold text-white">Sharma Kirana Store</p>
          <p className="text-[8px] text-white/40">solupi@sharma</p>
        </div>
        <div className="ml-auto text-[9px] font-semibold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full">Verified</div>
      </div>
      {/* Amount */}
      <div className="text-center mb-4">
        <p className="text-[10px] text-white/40 mb-1">You&apos;re paying</p>
        <p className="text-[32px] font-black font-display text-white leading-none">₹500.00</p>
        <p className="text-[9px] text-[#94A3B8] mt-1">≈ 0.054 SOL · 4.98 USDC</p>
      </div>
      {/* Token selector */}
      <p className="text-[9px] text-white/40 uppercase tracking-wider mb-2">Pay with</p>
      <div className="flex gap-2 mb-4">
        {[{ label: "USDC", bal: "9,890", color: "#2775CA", active: true }, { label: "SOL", bal: "2.40", color: "#9945FF", active: false }].map(t => (
          <div key={t.label} className={`flex-1 glass rounded-xl p-2 border flex items-center gap-1.5 cursor-pointer transition-all ${t.active ? "border-[#4D43FE] bg-[#4D43FE]/10" : "border-white/10"}`}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: `${t.color}30`, color: t.color }}>{t.label[0]}</div>
            <div><p className="text-[9px] font-bold text-white">{t.label}</p><p className="text-[7px] text-white/40">{t.bal}</p></div>
            {t.active && <div className="ml-auto w-3 h-3 rounded-full bg-[#4D43FE] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}
          </div>
        ))}
      </div>
      <div className="flex gap-2 text-[9px] text-white/40 mb-4 bg-white/5 rounded-xl p-2">
        <span>Network fee:</span><span className="text-white/60 font-medium">~0.000005 SOL</span>
        <span className="ml-auto text-[#10B981]">Instant</span>
      </div>
      {/* CTA */}
      <button className="w-full py-3 rounded-2xl text-[12px] font-bold text-white cursor-pointer transition-all" style={{ background: "linear-gradient(135deg, #4D43FE 0%, #8B5CF6 100%)", boxShadow: "0 0 20px rgba(77,67,254,0.4)" }}>
        Confirm & Pay ₹500
      </button>
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#080B1A] text-white px-4">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#4D43FE]/20 flex items-center justify-center">
          <div className="animate-spin-slow w-12 h-12 rounded-full border-2 border-transparent border-t-[#4D43FE] border-r-[#8B5CF6]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap size={16} className="text-[#A78BFA]" fill="#A78BFA" />
        </div>
      </div>
      <p className="text-[14px] font-bold font-display text-white mb-1">Processing Payment</p>
      <p className="text-[10px] text-white/50 mb-5 text-center">Submitting transaction to Solana…</p>
      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#4D43FE] to-[#8B5CF6] rounded-full" style={{ animation: "progress-fill 2.5s ease forwards" }} />
      </div>
      <p className="text-[9px] text-white/30 mb-6">Awaiting block confirmation…</p>
      {/* Steps */}
      {[{ label: "Wallet signed", done: true }, { label: "Transaction sent", done: true }, { label: "Block confirmed", done: false }].map(s => (
        <div key={s.label} className="flex items-center gap-2 mb-1.5">
          <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold ${s.done ? "bg-[#10B981]" : "bg-white/10 border border-white/20"}`}>
            {s.done && "✓"}
          </div>
          <span className={`text-[9px] ${s.done ? "text-white/70" : "text-white/30"}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#080B1A] text-white px-4 relative overflow-hidden">
      {/* Confetti particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            left: `${10 + (i * 7.5)}%`,
            top: `${20 + (i % 3) * 10}%`,
            background: ["#4D43FE","#8B5CF6","#10B981","#F59E0B","#06B6D4","#EC4899"][i % 6],
            animation: `confetti-fall ${1 + (i * 0.15)}s ease forwards ${i * 0.08}s`,
          }}
        />
      ))}
      {/* Success ring */}
      <div className="relative mb-4" style={{ animation: "success-ring 0.6s ease forwards" }}>
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981]/40 flex items-center justify-center">
          <CheckCircle size={28} className="text-[#10B981]" />
        </div>
        <div className="absolute inset-[-6px] rounded-full border border-[#10B981]/20" />
      </div>
      <p className="text-[15px] font-black font-display text-white mb-0.5">Payment Sent!</p>
      <p className="text-[24px] font-black font-display mb-1" style={{ color: "#10B981" }}>₹500.00</p>
      <p className="text-[9px] text-white/40 mb-4">to Sharma Kirana Store</p>
      {/* Receipt card */}
      <div className="w-full glass rounded-2xl p-3 mb-4">
        {[
          { label: "Token", val: "USDC" },
          { label: "Amount", val: "4.98 USDC" },
          { label: "Network", val: "Solana Devnet" },
          { label: "TX Hash", val: "5KJp…xQ9r" },
          { label: "Status", val: "Confirmed ✓", color: "#10B981" },
        ].map(r => (
          <div key={r.label} className="flex justify-between py-1 border-b border-white/5 last:border-0">
            <span className="text-[9px] text-white/40">{r.label}</span>
            <span className="text-[9px] font-semibold" style={{ color: r.color ?? "white" }}>{r.val}</span>
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-2xl text-[11px] font-bold text-white bg-[#4D43FE] cursor-pointer">Done</button>
    </div>
  );
}

function ActivityScreen() {
  const txs = [
    { name: "Sharma Kirana", type: "Payment", amt: "-₹500", token: "USDC", time: "Just now", color: "#10B981", status: "Confirmed" },
    { name: "BigBazaar", type: "Payment", amt: "-₹540", token: "SOL", time: "1h ago", color: "#10B981", status: "Confirmed" },
    { name: "Top-up", type: "Deposit", amt: "+₹1,000", token: "USDC", time: "3h ago", color: "#4D43FE", status: "Confirmed" },
    { name: "Metro Cafe", type: "Payment", amt: "-₹120", token: "USDC", time: "Yesterday", color: "#10B981", status: "Confirmed" },
  ];
  return (
    <div className="flex flex-col h-full bg-[#080B1A] text-white px-4">
      <div className="flex justify-between items-center px-1 pt-2 pb-1 text-[9px] font-semibold text-white/70">
        <span>9:41</span><span>100%</span>
      </div>
      <div className="flex items-center justify-between pt-1 pb-3">
        <p className="text-[13px] font-bold font-display">Activity</p>
        <div className="text-[9px] font-semibold text-[#4D43FE] bg-[#4D43FE]/10 px-2 py-0.5 rounded-full">4 txns</div>
      </div>
      <div className="space-y-2 overflow-y-auto">
        {txs.map((tx, i) => (
          <div key={tx.name + i} className="glass rounded-xl p-2.5 flex items-center gap-2"
            style={{ animation: `tx-slide-in 0.3s ease forwards ${i * 0.1}s`, opacity: 0 }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: `${tx.color}20`, color: tx.color }}>{tx.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white truncate">{tx.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px] text-white/30">{tx.token}</span>
                <span className="text-[7px] text-white/20">·</span>
                <span className="text-[7px] text-white/30">{tx.time}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold" style={{ color: tx.amt.startsWith("+") ? "#10B981" : "#F8FAFC" }}>{tx.amt}</p>
              <p className="text-[7px] text-[#10B981]">{tx.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Phone Mockup ─────────────────────────────────── */

const screenComponents: Record<Screen, React.ReactNode> = {
  home: <HomeScreen />,
  scan: <ScanScreen />,
  confirm: <ConfirmScreen />,
  processing: <ProcessingScreen />,
  success: <SuccessScreen />,
  activity: <ActivityScreen />,
};

export default function PhoneMockup() {
  const [current, setCurrent] = useState<Screen>("home");
  const idx = SCREENS.indexOf(current);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => {
        const i = SCREENS.indexOf(prev);
        return SCREENS[(i + 1) % SCREENS.length];
      });
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative select-none">
      {/* Outer glow */}
      <div className="absolute -inset-6 rounded-[60px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(77,67,254,0.25) 0%, transparent 70%)", filter: "blur(20px)" }}
        aria-hidden="true" />

      {/* Phone frame */}
      <div className="relative w-[220px] rounded-[40px] overflow-hidden"
        style={{
          height: 440,
          background: "#0A0A0F",
          border: "1.5px solid rgba(255,255,255,0.12)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#0A0A0F] rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-8 h-1 rounded-full bg-[#1A1A2E]" />
        </div>

        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[40px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {screenComponents[current]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side buttons */}
        <div className="absolute top-20 -right-[1.5px] w-[3px] h-10 bg-[#1A1A2E] rounded-r-sm" />
        <div className="absolute top-16 -left-[1.5px] w-[3px] h-7 bg-[#1A1A2E] rounded-l-sm" />
        <div className="absolute top-[100px] -left-[1.5px] w-[3px] h-7 bg-[#1A1A2E] rounded-l-sm" />
      </div>

      {/* Screen indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {SCREENS.map((s, i) => (
          <button
            key={s}
            onClick={() => setCurrent(s)}
            aria-label={`View ${SCREEN_LABELS[i]} screen`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${i === idx ? "w-5 h-1.5 bg-[#4D43FE]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>

      {/* Screen label */}
      <p className="text-center text-[10px] text-[#64748B] mt-1.5 font-medium">
        {SCREEN_LABELS[idx]}
      </p>
    </div>
  );
}
