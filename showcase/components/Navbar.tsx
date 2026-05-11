"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitFork, Play, Menu, X, Zap } from "lucide-react";
import { TryNowButton } from "./TryNowButton";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#flow" },
  { label: "Tech Stack", href: "#tech" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl"
      >
        <div
          className={`glass rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled ? "glow-sm" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 cursor-pointer" aria-label="SolUPI home">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4D43FE] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-800 text-lg text-white tracking-tight">
                Sol<span className="gradient-text">UPI</span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 cursor-pointer font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <TryNowButton variant="nav" />
              <a
                href="#video"
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#4D43FE] hover:bg-[#6C63FF] px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Play size={13} fill="white" />
                Watch Demo
              </a>
              <a
                href="#"
                aria-label="View GitHub"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#94A3B8] hover:text-white glass px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <GitFork size={14} />
                GitHub
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 glass rounded-2xl p-4 flex flex-col gap-3"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors py-1 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                <a
                  href="#video"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-[#4D43FE] px-4 py-2.5 rounded-xl cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  <Play size={13} fill="white" /> Watch Demo
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#94A3B8] glass px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  <GitFork size={14} /> GitHub
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
