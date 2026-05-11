import React from "react";

export function AndroidFrame({ children }: { children: React.ReactNode }) {
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
          <button className="text-white/40 hover:text-white/80 transition-colors cursor-pointer p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
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
