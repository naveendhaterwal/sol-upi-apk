import * as React from "react";

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is Sol UPI?",
    a: "Sol UPI is a fast and secure UPI payment platform that enables instant money transfers, QR payments, and seamless digital transactions across supported banks.",
  },
  {
    q: "Why choose Sol UPI?",
    a: "Sol UPI offers lightning-fast transactions, strong security, easy bank integration, and a smooth user experience for both individuals and businesses.",
  },
  {
    q: "Is Sol UPI safe to use?",
    a: "Yes. Sol UPI uses encrypted transactions, secure authentication, and UPI-compliant infrastructure to protect user payments and financial data.",
  },
  {
    q: "Which banks are supported by Sol UPI?",
    a: "Sol UPI supports most major UPI-enabled banks across India for instant transfers and payments.",
  },
  {
    q: "Are there any transaction fees?",
    a: "Most personal UPI transactions are free. Business-related charges may vary depending on merchant services and transaction volume.",
  },
  {
    q: "How fast are payments processed?",
    a: "Payments are processed instantly in real time, 24/7, including weekends and holidays.",
  },
  {
    q: "Can businesses accept payments using Sol UPI?",
    a: "Yes. Merchants can accept payments through QR codes, payment links, and UPI integrations for faster collections.",
  },
  {
    q: "What should I do if a payment fails?",
    a: "Failed transactions are usually reversed automatically by the bank within the standard processing time. Users can also contact support for assistance.",
  },
  {
    q: "Can I track my transaction history?",
    a: "Yes. Sol UPI provides complete transaction tracking and payment history for transparency and easy monitoring.",
  },
  {
    q: "Does Sol UPI support QR code payments?",
    a: "Yes. Users can scan and pay using any supported UPI QR code instantly.",
  },
];

export function BrandFaq() {
  return (
    <section
      id="faq"
      aria-label="Common questions"
      className="relative border-t border-border bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:px-8 md:py-32">
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
          Common questions.
        </h2>

        <dl className="mt-12 flex flex-col">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="grid grid-cols-1 gap-y-2 border-t border-border py-7 last:border-b last:border-border md:grid-cols-[1fr_1.6fr] md:gap-x-12"
            >
              <dt className="text-[16.5px] font-medium tracking-tight text-foreground">
                {item.q}
              </dt>
              <dd className="max-w-[58ch] text-[15px] leading-7 text-foreground/65">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
