"use client"

import { ArrowUpRight, BookOpen, CalendarDays, GraduationCap, TrendingUp, TriangleAlert } from "lucide-react"
import { useCountUp } from "@/hooks/use-count-up"
import { weeklyStats, type NavView, type WeeklyStat } from "@/lib/campus-data"
import { useTasks } from "@/components/task-provider"

const toneStyles: Record<WeeklyStat["tone"], { chip: string; icon: typeof BookOpen }> = {
  primary: { chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400", icon: BookOpen },
  sky: { chip: "bg-sky-500/10 text-sky-600 dark:text-sky-400", icon: CalendarDays },
  amber: { chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: GraduationCap },
  rose: { chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400", icon: TriangleAlert },
}

function StatCard({ stat, index, onNavigate }: { stat: WeeklyStat; index: number; onNavigate: (v: NavView) => void }) {
  const value = useCountUp(stat.value, 900, 150 + index * 120)
  const { chip, icon: Icon } = toneStyles[stat.tone]
  return (
    <button
      type="button"
      onClick={() => onNavigate(stat.view)}
      aria-label={`View ${stat.label}`}
      className="cc-lift cc-fade-up group relative rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-violet-500/30"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className={"inline-flex size-9 items-center justify-center rounded-xl " + chip}>
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <ArrowUpRight
        className="absolute right-3 top-3 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
      <p className="mt-3 text-2xl font-bold leading-none tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
    </button>
  )
}

export function WeeklyOverview({ onNavigate }: { onNavigate: (v: NavView) => void }) {
  const { completed, total } = useTasks()
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <section aria-label="This week at a glance" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight">This Week at a Glance</h2>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          {progress}% on track
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {weeklyStats.map((stat, i) => (
          <StatCard key={stat.key} stat={stat} index={i} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Weekly progress</span>
          <span className="tabular-nums text-foreground">
            {completed}/{total} tasks · {progress}%
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Mark items &ldquo;Task completed&rdquo; in your Smart Feed to fill this bar.
        </p>
      </div>
    </section>
  )
}
