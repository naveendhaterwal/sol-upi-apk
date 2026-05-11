"use client";
import Link from "next/link";
import { Smartphone } from "lucide-react";

export function TryNowButton({ variant = "primary" }: { variant?: "primary" | "ghost" | "nav" }) {
  const styles = {
    primary: "flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 active:scale-95 text-black",
    ghost: "flex items-center gap-2 font-semibold text-sm glass hover:bg-white/10 text-white px-6 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer",
    nav: "flex items-center gap-1.5 text-sm font-semibold text-black px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer",
  };

  const bg = {
    primary: { background: "linear-gradient(135deg,#14F195 0%,#06B6D4 100%)", boxShadow: "0 0 24px rgba(20,241,149,0.35)" },
    ghost: {},
    nav: { background: "linear-gradient(135deg,#14F195 0%,#06B6D4 100%)" },
  };

  return (
    <Link href="https://solupi-demo.vercel.app/" className={styles[variant]} style={bg[variant]} aria-label="Try SolUPI demo">
      <Smartphone size={variant === "nav" ? 13 : 16} />
      Try Now
    </Link>
  );
}
