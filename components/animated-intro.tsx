"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarClock, GraduationCap, Sparkles } from "lucide-react"

const FLOATING_CARDS = [
  { icon: Sparkles, label: "Summarized", className: "left-[6%] top-[24%]", delay: "0.5s" },
  { icon: CalendarClock, label: "On track", className: "right-[7%] top-[30%]", delay: "0.9s" },
  { icon: Sparkles, label: "2 urgent", className: "left-[12%] bottom-[22%]", delay: "1.3s" },
  { icon: CalendarClock, label: "4 events", className: "right-[11%] bottom-[26%]", delay: "1.6s" },
]

export function AnimatedIntro({ duration, onDone }: { duration: number; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: `${(i * 53) % 100}%`,
        size: 4 + ((i * 7) % 10),
        delay: `${(i % 9) * 0.4}s`,
        dur: `${5 + (i % 5)}s`,
      })),
    [],
  )

  useEffect(() => {
    const leaveAt = setTimeout(() => setLeaving(true), duration - 600)
    const doneAt = setTimeout(onDone, duration)
    return () => {
      clearTimeout(leaveAt)
      clearTimeout(doneAt)
    }
  }, [duration, onDone])

  return (
    <div
      className={
        "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[oklch(0.16_0.05_300)] transition-opacity duration-500 " +
        (leaving ? "opacity-0" : "opacity-100")
      }
      role="status"
      aria-label="Loading Kya Scene?"
    >
      {/* Animated gradient wave */}
      <div
        aria-hidden="true"
        className="cc-wave pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, oklch(0.45 0.2 300 / 0.55), transparent 55%), radial-gradient(circle at 75% 65%, oklch(0.5 0.18 265 / 0.5), transparent 55%)",
        }}
      />

      {/* Rising particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-violet-300/60 blur-[1px]"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `cc-rise ${p.dur} linear ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating UI cards */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        {FLOATING_CARDS.map(({ icon: Icon, label, className, delay }, i) => (
          <div key={i} className={"cc-fade-up absolute " + className} style={{ animationDelay: delay }}>
            <div className="cc-float flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-md">
              <Icon className="size-3.5 text-violet-200" />
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Logo + wordmark */}
      <div className="relative flex flex-col items-center text-center">
        <div className="relative flex size-44 items-center justify-center">
          {/* Rotating conic gradient ring */}
          <div
            aria-hidden="true"
            className="cc-spin-slow absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, oklch(0.72 0.2 300 / 0.9) 20%, transparent 45%, oklch(0.68 0.18 330 / 0.85) 65%, transparent 90%)",
              maskImage:
                "radial-gradient(circle, transparent 61%, black 63%, black 73%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 61%, black 63%, black 73%, transparent 75%)",
            }}
          />

          {/* Orbiting satellites */}
          <div aria-hidden="true" className="absolute inset-0">
            {[
              { dur: "7s", r: "80px", size: 9, cls: "bg-violet-300" },
              { dur: "11s", r: "96px", size: 6, cls: "bg-fuchsia-300" },
              { dur: "9s", r: "68px", size: 5, cls: "bg-indigo-200" },
            ].map((o, i) => (
              <div
                key={i}
                className="cc-spin-slow absolute inset-0"
                style={{ animationDuration: o.dur, animationDirection: i === 1 ? "reverse" : "normal" }}
              >
                <span
                  className={"absolute left-1/2 top-1/2 rounded-full shadow-lg " + o.cls}
                  style={{
                    width: o.size,
                    height: o.size,
                    transform: `translate(-50%, -50%) translateY(-${o.r})`,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="cc-glow absolute inset-10 -z-10 rounded-full bg-violet-500 blur-2xl"
          />
          <div className="cc-scale-in flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-2xl shadow-violet-900/50">
            <GraduationCap className="size-10" aria-hidden="true" />
          </div>
        </div>

        <div className="cc-fade-up mt-4" style={{ animationDelay: "0.35s" }}>
          <h1
            className="cc-shimmer bg-clip-text px-4 pb-3 font-[family-name:var(--font-script)] text-6xl font-bold leading-[1.3] tracking-tight text-transparent sm:text-7xl"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ffffff, #c4b5fd, #f5d0fe, #c4b5fd, #ffffff)",
            }}
          >
            Kya Scene?
          </h1>
        </div>
        <p
          className="cc-fade-up mt-2 text-sm text-violet-200/90 sm:text-base"
          style={{ animationDelay: "0.7s" }}
        >
          Know what&apos;s happening, without the scroll.
        </p>

        <div
          className="cc-fade-up mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/15"
          style={{ animationDelay: "1s" }}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300"
            style={{ animation: `cc-intro-bar ${duration}ms linear forwards` }}
          />
        </div>
      </div>

      <style>{`@keyframes cc-intro-bar{from{width:0}to{width:100%}}`}</style>
    </div>
  )
}
