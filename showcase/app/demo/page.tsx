import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0" 
         style={{ width: 390, height: 844 }}>
      {/* Glow */}
      <div className="absolute -inset-8 rounded-[60px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(77,67,254,0.3) 0%, transparent 70%)", filter: "blur(24px)" }} />
      {/* Frame */}
      <div className="relative w-full h-full rounded-[44px] overflow-hidden"
        style={{ background: "#0A0A0F", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        {/* Android punch-hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black z-30"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }} />
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-5 z-20 text-[11px] font-semibold text-white/60 pointer-events-none"
          style={{ paddingTop: 4 }}>
          <span>9:41</span>
          <div className="flex gap-1 items-center text-white/50">
            <span>▮▮▮</span><span>WiFi</span><span>●●●</span>
          </div>
        </div>
        {/* Screen content - padded bottom for nav bar */}
        <div className="absolute inset-0 pt-8 pb-12 overflow-hidden bg-white">
          {children}
        </div>
        {/* Android nav bar */}
        <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-around px-8 z-20"
          style={{ background: "rgba(10,10,15,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button className="text-white/40 hover:text-white/80 transition-colors cursor-pointer p-2"><ArrowLeft size={18} /></button>
          <button className="w-5 h-5 rounded-full border-2 border-white/40 hover:border-white/80 transition-colors cursor-pointer" />
          <button className="text-white/40 hover:text-white/80 transition-colors cursor-pointer p-2">
            <div className="w-4 h-4 border border-white/40 rounded-sm" />
          </button>
        </div>
        {/* Side buttons */}
        <div className="absolute top-[12%] -right-[2px] w-[3px] h-[8%] bg-[#1a1a2e] rounded-r-sm" />
        <div className="absolute top-[10%] -left-[2px] w-[3px] h-[5%] bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute top-[17%] -left-[2px] w-[3px] h-[5%] bg-[#1a1a2e] rounded-l-sm" />
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#050714] flex flex-col xl:flex-row items-center justify-center p-4 sm:p-8 relative overflow-hidden mesh-bg gap-8 xl:gap-24">
      {/* Background Ambience */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(77,67,254,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors glass px-4 py-2 rounded-xl text-sm sm:text-base">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Showcase</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <div className="text-center xl:text-left z-20 flex-1 max-w-lg mt-16 xl:mt-0">
        <div className="inline-flex items-center gap-2 mb-4 glass px-3 py-1.5 rounded-full border border-[#10B981]/20">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-semibold text-[#10B981]">Live App Demo</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-6">
          Experience SolUPI.
        </h1>
        <p className="text-[#94A3B8] text-base sm:text-lg mb-8 leading-relaxed">
          This is your actual Expo React Native application embedded live. It runs natively on the web using <code className="text-[#4D43FE] bg-[#4D43FE]/10 px-2 py-1 rounded font-mono text-sm">react-native-web</code>.
        </p>
        <div className="glass rounded-2xl p-6 border border-white/05 inline-block text-left w-full shadow-2xl shadow-black/50">
          <h3 className="text-white text-base font-semibold mb-4">Controls:</h3>
          <ul className="text-[#94A3B8] text-sm sm:text-base space-y-3">
            <li className="flex items-center gap-3"><span className="text-xl">📱</span> Exact 1:1 mobile scaling</li>
            <li className="flex items-center gap-3"><span className="text-xl">🖱️</span> Click and drag to scroll</li>
            <li className="flex items-center gap-3"><span className="text-xl">⚡</span> Hot-reloading enabled</li>
          </ul>
        </div>
      </div>

      {/* Frame Container - Uses CSS scale to fit on smaller screens while keeping the iframe internally at exactly 390x844 */}
      <div className="z-10 animate-fade-in-up w-full xl:w-auto flex justify-center items-center h-[75vh] xl:h-auto pb-8 xl:pb-0" style={{ perspective: 1000 }}>
        {/* We use a wrapper that scales down the fixed 390x844 frame using standard CSS so the iframe is never distorted. Max scale reduced to 0.85 as requested. */}
        <div className="origin-center xl:origin-left" style={{ transform: 'scale(min(0.85, calc(75vh / 844), calc(90vw / 420)))' }}>
          <AndroidFrame>
            <iframe 
              src="http://localhost:8085" 
              className="w-full h-full border-0"
              style={{ backgroundColor: "#080B1A" }}
              allow="camera; microphone; geolocation"
              title="SolUPI Expo Web App"
            />
          </AndroidFrame>
        </div>
      </div>
    </main>
  );
}
