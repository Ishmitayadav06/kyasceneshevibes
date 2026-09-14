import { ArrowUpRight, Wand2 } from "lucide-react"
import type { NavView, Recommendation } from "@/lib/campus-data"

export function RecommendationCard({
  item,
  index,
  onNavigate,
}: {
  item: Recommendation
  index: number
  onNavigate: (v: NavView) => void
}) {
  return (
    <article
      className="cc-lift cc-fade-up group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-violet-500/40"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400">
        <Wand2 className="size-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
        <button
          type="button"
          onClick={() => onNavigate("events")}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400"
        >
          {item.cta}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
