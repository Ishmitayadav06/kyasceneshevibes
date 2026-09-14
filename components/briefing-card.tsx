"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CalendarClock, MessageSquareText, Sparkles } from "lucide-react"
import { useCountUp } from "@/hooks/use-count-up"
import { briefingStats } from "@/lib/campus-data"
import { useUser } from "@/components/user-provider"

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

// Date/time depend on the viewer's clock and timezone, so they must be computed
// after mount — rendering them during SSR causes a hydration mismatch that
// regenerates the tree and resets app state.
function useClientClock() {
  const [clock, setClock] = useState<{ label: string; greeting: string } | null>(null)
  useEffect(() => {
    setClock({ label: todayLabel(), greeting: greeting() })
  }, [])
  return clock
}

// Fixed positions/timings for the drifting sparkle particles so SSR and the
// client render identically (no Math.random during render).
const PARTICLES = [
  { left: "12%", top: "68%", size: 10, delay: "0s", dur: "7s" },
  { left: "26%", top: "82%", size: 7, delay: "1.2s", dur: "6s" },
  { left: "48%", top: "74%", size: 12, delay: "0.4s", dur: "8s" },
  { left: "68%", top: "80%", size: 8, delay: "2.1s", dur: "6.5s" },
  { left: "82%", top: "66%", size: 11, delay: "1.6s", dur: "7.5s" },
  { left: "92%", top: "78%", size: 6, delay: "0.8s", dur: "5.5s" },
]

function Stat({ icon: Icon, value, label, tone, ring, delay }: {
  icon: typeof AlertTriangle
  value: number
  label: string
  tone: string
  ring: string
  delay: number
}) {
  const count = useCountUp(value, 900, delay)
  return (
    <div
      className={
        "group relative overflow-hidden rounded-2xl bg-white/10 p-3 ring-1 ring-inset ring-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 " +
        ring
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 size-14 rounded-full bg-white/10 blur-xl transition-opacity duration-300 group-hover:opacity-90"
      />
      <Icon className={"relative size-5 transition-transform duration-300 group-hover:scale-110 " + tone} aria-hidden="true" />
      <p className="relative mt-2 text-2xl font-bold leading-none tabular-nums">{count}</p>
      <p className="relative mt-1 text-xs font-medium text-white/80">{label}</p>
    </div>
  )
}

export function BriefingCard({ onAskAI }: { onAskAI?: () => void }) {
  const stats = briefingStats()
  const clock = useClientClock()
  const { name } = useUser()

  return (
    <section
      aria-label="Today's briefing"
      className="cc-lift relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 p-5 text-white shadow-lg shadow-violet-600/25"
    >
      {/* Animated gradient wave overlay */}
      <div
        aria-hidden="true"
        className="cc-wave pointer-events-none absolute inset-0 opacity-60 [background:linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.14)_45%,rgba(236,72,153,0.16)_55%,transparent_80%)]"
      />
      {/* Sweeping shine */}
      <div
        aria-hidden="true"
        className="cc-shimmer pointer-events-none absolute inset-0 [background:linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.22)_50%,transparent_65%)]"
      />

      {/* Floating glow blobs */}
      <div aria-hidden="true" className="cc-glow pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
      <div aria-hidden="true" className="cc-float pointer-events-none absolute -bottom-16 -left-8 size-40 rounded-full bg-indigo-400/20 blur-2xl" />
      <div aria-hidden="true" className="cc-drift pointer-events-none absolute right-1/4 top-1/3 size-24 rounded-full bg-fuchsia-400/15 blur-2xl" />

      {/* Rising sparkle particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute text-white/70 [animation:cc-rise_var(--d)_ease-in-out_infinite] motion-reduce:hidden"
            style={{
              left: p.left,
              top: p.top,
              // @ts-expect-error custom property
              "--d": p.dur,
              animationDelay: p.delay,
            }}
          >
            <Sparkles style={{ width: p.size, height: p.size }} />
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
          <Sparkles className="size-3.5 [animation:cc-glow-pulse_2.5s_ease-in-out_infinite] motion-reduce:animate-none" aria-hidden="true" />
          <span suppressHydrationWarning>Today&apos;s Briefing{clock ? ` · ${clock.label}` : ""}</span>
        </div>
        <p className="mt-3 text-xl font-semibold leading-snug text-balance sm:text-2xl" suppressHydrationWarning>
          {clock ? `${clock.greeting}, ` : ""}
          <span className="cc-shimmer bg-gradient-to-r from-white via-fuchsia-100 to-white bg-clip-text text-transparent">
            {name}
          </span>{" "}
          — you&apos;re on track. Here&apos;s what needs your attention today.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={AlertTriangle} value={stats.urgent} label="Urgent" tone="text-rose-200" ring="hover:ring-rose-200/40" delay={100} />
          <Stat icon={CalendarClock} value={stats.scheduleChanges} label="Schedule changes" tone="text-amber-200" ring="hover:ring-amber-200/40" delay={250} />
          <Stat icon={Sparkles} value={stats.upcomingEvents} label="Events & clubs" tone="text-sky-200" ring="hover:ring-sky-200/40" delay={400} />
        </div>

        {onAskAI && (
          <button
            type="button"
            onClick={onAskAI}
            className="group mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <MessageSquareText className="size-4 transition-transform group-hover:-rotate-12" aria-hidden="true" />
            Ask what to prioritize
          </button>
        )}
      </div>
    </section>
  )
}
