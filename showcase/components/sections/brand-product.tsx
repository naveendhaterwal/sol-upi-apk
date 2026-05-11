"use client";

import { motion } from "motion/react";
import * as React from "react";


import { cn } from "@/lib/utils";

export function BrandProduct() {
  return (
    <section
      id="demo"
      aria-label="Product preview"
      className="relative bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8 md:pb-32 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 0.6, 0.2, 1] }}
          className="relative rounded-[44px] shadow-[0_40px_120px_-40px_color-mix(in_oklch,var(--primary)_40%,transparent)]"
        >
          <div className="origin-center overflow-hidden rounded-[44px]" style={{ transform: 'scale(min(1, calc(75vh / 844), calc(90vw / 420)))' }}>
            <img 
              src="/app-demo.png" 
              alt="SolUPI App Demo" 
              className="w-[390px] h-[844px] object-cover"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
