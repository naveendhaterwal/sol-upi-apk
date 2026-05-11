import * as React from "react";

const STATS: { title: string; description: string }[] = [
  { 
    title: "🚀 Instant Finality", 
    description: "Traditional payments take minutes or hours. Sol UPI settles transactions on-chain in ~400ms with real-time confirmation." 
  },
  { 
    title: "💸 Eliminate Hidden Fees", 
    description: "Banks and payment gateways charge unnecessary processing fees. Sol UPI reduces costs to near-zero with only micro-cent blockchain network fees." 
  },
  { 
    title: "🔒 Frictionless Onboarding", 
    description: "Complex KYC and wallet setup kill user adoption. Sol UPI’s custodial infrastructure enables seamless onboarding with a simple, user-friendly experience." 
  },
];

export function BrandStats() {
  return (
    <section
      id="features"
      aria-label="Features"
      className="relative border-t border-border bg-background"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-3">
        {STATS.map((s, i) => (
          <div
            key={i}
            className={
              "flex flex-col gap-3 px-6 py-12 md:px-8 md:py-14 " +
              (i < STATS.length - 1
                ? "border-b border-border md:border-b-0 md:border-r"
                : "")
            }
          >
            <span className="text-[20px] md:text-[22px] font-semibold leading-[1.2] tracking-tight text-foreground">
              {s.title}
            </span>
            <span className="mt-1 max-w-[36ch] text-[15px] leading-[1.6] text-foreground/65">
              {s.description}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
