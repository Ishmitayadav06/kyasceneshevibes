"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { BriefingCard } from "@/components/briefing-card"
import { WeeklyOverview } from "@/components/weekly-overview"
import { SmartFeed } from "@/components/smart-feed"
import { RecommendationCard } from "@/components/recommendation-card"
import { DeadlineReassurance } from "@/components/deadline-reassurance"
import { recommendations, type NavView } from "@/lib/campus-data"

export function DashboardView({
  onNavigate,
  onAskAI,
}: {
  onNavigate: (v: NavView) => void
  onAskAI: () => void
}) {
  return (
    <div className="space-y-8">
      <DeadlineReassurance onAskAI={onAskAI} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <BriefingCard onAskAI={onAskAI} />
        <WeeklyOverview onNavigate={onNavigate} />
      </div>

      <section aria-label="Recommended for you" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-fuchsia-500" aria-hidden="true" />
            <h2 className="text-sm font-bold tracking-tight">Recommended for You</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("events")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            All events
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((r, i) => (
            <RecommendationCard key={r.id} item={r} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight">Latest Updates</h2>
          <button
            type="button"
            onClick={() => onNavigate("feed")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <SmartFeed limit={4} />
      </div>
    </div>
  )
}
