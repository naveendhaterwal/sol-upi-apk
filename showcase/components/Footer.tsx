"use client";

import { GitFork, Zap, ExternalLink } from "lucide-react";

const links = [
  { label: "GitHub", href: "#", icon: <GitFork size={14} /> },
  { label: "Solana Devnet", href: "https://explorer.solana.com/?cluster=devnet", icon: <ExternalLink size={14} /> },
  { label: "Docs", href: "#", icon: <ExternalLink size={14} /> },
];

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-white/08 overflow-hidden"
      style={{ background: "#050714" }}>
      {/* Top gradient border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #4D43FE, transparent)" }}
        aria-hidden="true" />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4D43FE] to-[#8B5CF6] flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                Sol<span className="gradient-text">UPI</span>
              </span>
            </div>
            <p className="text-[#64748B] text-sm max-w-xs">
              UPI-style payments on Solana. Fast, familiar, and powered by SPL tokens.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1.5 glass rounded-xl px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-all duration-200 cursor-pointer border border-white/08 hover:border-[#4D43FE]/30"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/05 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-[#475569] text-xs">
            © 2025 SolUPI. Built for Hackathon 2025.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#475569] text-xs">Live on Solana Devnet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
