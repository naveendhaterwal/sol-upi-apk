"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, X } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

export default function VideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="video" className="py-24 px-4 relative overflow-hidden mesh-bg">
      {/* Ambient orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(77,67,254,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-[#A78BFA] border border-[#4D43FE]/20 mb-5">
            Live demonstration
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 tracking-tight">
            See SolUPI in Action
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-lg mx-auto">
            Watch the complete payment flow from QR scan to confirmed Solana transaction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D0F24 0%, #111328 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Video placeholder content */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            {/* Left: phone */}
            <div className="flex-shrink-0 scale-90 md:scale-100">
              <PhoneMockup />
            </div>

            {/* Right: play card */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="glass rounded-2xl p-6 mb-6 border border-white/08 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[11px] text-white/30 ml-2 font-mono">solupi-demo.mp4</span>
                </div>
                <div className="aspect-video rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1a1640 0%, #0D0F24 100%)", border: "1px solid rgba(77,67,254,0.2)" }}>
                  {/* Fake video timeline */}
                  <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/10 rounded-full">
                    <div className="h-full w-1/3 bg-[#4D43FE] rounded-full" />
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
                    aria-label="Play demo video"
                    style={{ background: "rgba(77,67,254,0.9)", boxShadow: "0 0 30px rgba(77,67,254,0.5)" }}
                  >
                    <Play size={22} fill="white" className="text-white ml-1" />
                  </button>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-semibold text-[#F59E0B] border border-[#F59E0B]/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                Demo video coming soon
              </div>
              <p className="text-[#64748B] text-sm">
                A full walkthrough video is being recorded. In the meantime, interact with the live phone mockup above to see the complete payment flow.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal (placeholder) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Demo video modal"
        >
          <div
            className="relative glass rounded-3xl p-8 max-w-lg w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-[#4D43FE]/20 flex items-center justify-center mx-auto mb-4">
              <Play size={24} className="text-[#4D43FE]" />
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-2">Demo Video</h3>
            <p className="text-[#94A3B8] text-sm mb-6">
              Add your YouTube, Loom, or direct video URL here — the embed will replace this placeholder automatically.
            </p>
            <div className="glass rounded-xl p-4 text-[#64748B] text-xs font-mono border border-white/08">
              {`<!-- Replace with: <iframe src="YOUR_VIDEO_URL" /> -->`}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
