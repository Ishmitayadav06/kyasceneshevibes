"use client"

import { useEffect, useMemo } from "react"
import { PartyPopper, Trophy, X } from "lucide-react"

const CONFETTI_COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#38bdf8"]

function useConfetti(open: boolean) {
  return useMemo(() => {
    if (!open) return []
    return Array.from({ length: 44 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      x: `${(Math.random() - 0.5) * 40}vw`,
      dur: `${2.6 + Math.random() * 2.2}s`,
      delay: `${Math.random() * 0.7}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rounded: Math.random() > 0.6,
    }))
  }, [open])
}

export function CompletionCelebration({
  open,
  total,
  onClose,
}: {
  open: boolean
  total: number
  onClose: () => void
}) {
  const confetti = useConfetti(open)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="All tasks complete"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close celebration"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />

      {/* Confetti layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="cc-confetti-piece"
            style={
              {
                left: `${c.left}%`,
                backgroundColor: c.color,
                borderRadius: c.rounded ? "9999px" : "2px",
                "--cc-x": c.x,
                "--cc-dur": c.dur,
                "--cc-delay": c.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="cc-pop-in relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-center shadow-2xl shadow-black/20">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="relative mx-auto flex size-20 items-center justify-center">
          <span className="cc-ring-burst absolute inset-0 rounded-full bg-violet-500/30" />
          <span className="cc-ring-burst absolute inset-0 rounded-full bg-indigo-500/20" style={{ animationDelay: "0.25s" }} />
          <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-600/40">
            <Trophy className="cc-trophy size-8" aria-hidden="true" />
          </span>
        </div>

        <h2 className="mt-4 flex items-center justify-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <PartyPopper className="size-5 text-violet-500" aria-hidden="true" />
          All caught up!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {total > 0 ? (
            <>
              You cleared all <span className="font-semibold text-foreground">{total}</span> of your deadline tasks. Take a
              breath — your campus is fully under control.
            </>
          ) : (
            <>Everything on your plate is done. Enjoy the calm.</>
          )}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Nice, thanks!
        </button>
      </div>
    </div>
  )
}
