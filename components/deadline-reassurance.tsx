"use client"

import { useMemo } from "react"
import { HeartHandshake, Sparkles } from "lucide-react"
import { dueTodayTaskIds } from "@/lib/campus-data"
import { useTasks } from "@/components/task-provider"

export function DeadlineReassurance({ onAskAI }: { onAskAI?: () => void }) {
  const { remainingAmong, allDone } = useTasks()
  const dueToday = useMemo(() => dueTodayTaskIds(), [])
  const remaining = remainingAmong(dueToday)

  // Only reassure when the day is genuinely loaded and there's still work left.
  if (remaining < 2 || allDone) return null

  return (
    <section
      aria-label="Today's workload"
      className="cc-fade-up relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-rose-500/10 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <HeartHandshake className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            There&apos;s a lot to do today — let&apos;s figure out the important stuff and get it done with.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            You have <span className="font-semibold text-foreground">{remaining}</span> deadlines landing within 24 hours.
            Take them one at a time — tackle the urgent ones first and check them off as you go. You&apos;ve got this.
          </p>
          {onAskAI && (
            <button
              type="button"
              onClick={onAskAI}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Help me prioritize
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
