import React from "react";
import { FaRegCalendarCheck, FaRegClock, FaRocket } from "react-icons/fa6";
import { Container } from "@/components/ui/container";

const steps = [
  {
    icon: <FaRegCalendarCheck className="text-4xl md:text-5xl text-white drop-shadow-lg" />, // Larger, white icon
    bg: "from-primary to-violet-500",
    title: "Tuesday",
    desc: "Land in your inbox",
  },
  {
    icon: <FaRegClock className="text-4xl md:text-5xl text-white drop-shadow-lg" />,
    bg: "from-fuchsia-500 to-primary",
    title: "5 minutes",
    desc: "Read while drinking coffee",
  },
  {
    icon: <FaRocket className="text-4xl md:text-5xl text-white drop-shadow-lg" />,
    bg: "from-primary to-emerald-500",
    title: "Apply",
    desc: "Ship faster / make better calls",
  },
];

export function HowItWorksStrip() {
  return (
    <section className="relative z-10 w-full py-12 md:py-16">
      {/* Decorative accent */}
      <div className="absolute left-1/2 top-0 z-0 h-2 w-40 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/60 via-fuchsia-400/60 to-emerald-400/60 blur-md opacity-70" />
      <Container size="prose" className="relative z-10">
        <div className="mx-auto mb-8 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-2">How it works</span>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 tracking-tight">From inbox to impact</h2>
          <p className="text-muted-foreground text-center max-w-md text-base md:text-lg">A quick, actionable newsletter for busy product minds.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center max-w-[180px] group"
            >
              <div
                className={`mb-4 flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br ${step.bg} shadow-lg group-hover:scale-105 transition-transform duration-300`}
              >
                {step.icon}
              </div>
              <div className="font-bold text-lg md:text-xl mb-1 text-foreground drop-shadow-sm">{step.title}</div>
              <div className="text-sm md:text-base text-muted-foreground leading-snug">{step.desc}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
