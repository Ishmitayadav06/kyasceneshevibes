"use client"

import { useEffect, useMemo, useState } from "react"
import { Sparkles, X, ArrowRight, ListChecks, Flame, CheckCircle2 } from "lucide-react"
import { useTasks } from "@/components/task-provider"
import { taskItems } from "@/lib/campus-data"

/**
 * A one-time motivating popup shown right after login. The tone and copy adapt
 * to how many tasks the user still has left (and how many are urgent).
 */
export function WelcomeMessage({ name, onGoToTasks }: { name?: string; onGoToTasks: () => void }) {
  const { completed, total } = useTasks()
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  const remaining = total - completed
  const urgent = useMemo(() => taskItems.filter((t) => t.priority === "Urgent").length, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on Escape and lock body scroll only while the popup is open. Keying
  // this to `open` ensures the lock is released the moment it closes — a bare
  // mount-only effect never runs its cleanup here because the component renders
  // null instead of unmounting, which would leave the page permanently locked.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const greeting = name ? `Hey ${name}!` : "Hey there!"

  const { headline, message } = buildMotivation(remaining, urgent)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onClick={() => setOpen(false)}
    >
      <div
        className={
          "w-full max-w-md overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl " +
          (mounted ? "cc-fade-up" : "opacity-0")
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600 px-6 pb-6 pt-7 text-white">
          <span className="absolute inset-0 opacity-0 [animation:cc-shimmer_3s_ease-in-out_infinite] motion-reduce:animate-none bg-white/10" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Dismiss"
            className="absolute right-3 top-3 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Sparkles className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-medium text-white/80">{greeting}</p>
          <h2 id="welcome-title" className="mt-0.5 text-xl font-bold leading-snug">
            {headline}
          </h2>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>

          {/* Quick stat chips */}
          <div className="flex flex-wrap gap-2">
            <StatChip
              icon={<ListChecks className="size-4" aria-hidden="true" />}
              value={remaining}
              label={remaining === 1 ? "task left" : "tasks left"}
              tone="violet"
            />
            {urgent > 0 && (
              <StatChip
                icon={<Flame className="size-4" aria-hidden="true" />}
                value={urgent}
                label="urgent"
                tone="rose"
              />
            )}
            {completed > 0 && (
              <StatChip
                icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                value={completed}
                label="done"
                tone="emerald"
              />
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {remaining > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onGoToTasks()
                }}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-transform hover:scale-[1.02]"
              >
                See my tasks
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={
                "inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground " +
                (remaining > 0 ? "" : "flex-1")
              }
            >
              {remaining > 0 ? "Later" : "Let's go"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function buildMotivation(remaining: number, urgent: number): { headline: string; message: string } {
  if (remaining === 0) {
    return {
      headline: "You're all caught up",
      message:
        "No pending tasks on your plate right now. Enjoy the calm, explore what's happening on campus, and stay a step ahead.",
    }
  }
  if (urgent > 0) {
    return {
      headline: `${urgent} urgent ${urgent === 1 ? "task needs" : "tasks need"} you`,
      message: `You've got ${remaining} ${remaining === 1 ? "task" : "tasks"} to tackle, and ${urgent} of them ${
        urgent === 1 ? "is" : "are"
      } time-sensitive. Knock out the urgent ones first — future you will be grateful. You've got this.`,
    }
  }
  if (remaining <= 3) {
    return {
      headline: "Almost there — just a few left",
      message: `Only ${remaining} ${remaining === 1 ? "task" : "tasks"} standing between you and a clear plate. A little focus now and you're done for the day.`,
    }
  }
  return {
    headline: `${remaining} tasks, one step at a time`,
    message: `You have ${remaining} tasks lined up. Don't sweat the whole list — pick one, finish it, and let the momentum carry you. Every check-off counts.`,
  }
}

function StatChip({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: number
  label: string
  tone: "violet" | "rose" | "emerald"
}) {
  const tones: Record<typeof tone, string> = {
    violet: "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-300",
    rose: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-300",
    emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {icon}
      <span className="tabular-nums">{value}</span>
      <span className="font-medium opacity-80">{label}</span>
    </span>
  )
}
