"use client"

import { useState } from "react"
import { ArrowRight, CalendarClock, ListChecks, Radio, Sparkles, Star, Wand2 } from "lucide-react"
import {
  categoryStyles,
  priorityStyles,
  summarizeAnnouncement,
  type Category,
  type SummaryResult,
} from "@/lib/campus-data"

const SAMPLES = [
  "Reminder from CS Department: Data Structures Assignment 3 on linked lists must be submitted on the portal by tonight midnight. Late submissions lose 10% per hour.",
  "Coding Club build night this Friday 6 PM at the Innovation Lab. Bring your laptop and a project idea for the hackathon warm-up.",
  "Hostel Office notice: water supply to Blocks C and D will be off on Saturday from 10 AM to 2 PM for tank cleaning.",
]

function Row({ icon: Icon, label, children }: { icon: typeof Star; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
    </div>
  )
}

export function SummarizerView() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [loading, setLoading] = useState(false)

  function run(input?: string) {
    const value = (input ?? text).trim()
    if (!value) return
    if (input) setText(input)
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(summarizeAnnouncement(value))
      setLoading(false)
    }, 700)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <section aria-label="Announcement input" className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <Wand2 className="size-4" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-bold tracking-tight">Connect your WhatsApp group 📲</h2>
          </div>
          <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">Buried under 847 messages? We&apos;ll find what actually matters. 🔍</p>
            <p>From &ldquo;What did I miss?&rdquo; 😵‍💫 to &ldquo;I&apos;m caught up.&rdquo; ✅ No endless scrolling. No digging through chaos.</p>
            <p>Your group chat talks. 💬 AI makes sense of it. ✨</p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Connect your WhatsApp chats now…"
            aria-label="Announcement text"
            className="mt-4 w-full resize-none rounded-2xl border border-border bg-background p-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-violet-600"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground">{text.length} characters</span>
            <button
              type="button"
              onClick={() => run()}
              disabled={!text.trim() || loading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-600/30 transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {loading ? "Summarizing…" : "Summarize"}
            </button>
          </div>

          <p className="mt-4 flex gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <span aria-hidden="true">🔒</span>
            <span>
              <span className="font-semibold text-foreground">Your chats stay yours.</span> AI only sees the WhatsApp groups you choose to connect — never your personal chats. No data is stored. Once the summary is done, the data is gone.
            </span>
          </p>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Try a sample</p>
          <div className="space-y-2">
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => run(s)}
                className="group flex w-full items-start gap-2 rounded-2xl border border-border bg-card p-3 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-foreground"
              >
                <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-violet-500 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                <span className="line-clamp-2">{s}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Summary result" className="lg:sticky lg:top-20">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
                <div className="size-9 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : result ? (
          <div className="cc-fade-up space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold " + categoryStyles[result.category as Category]}>
                {result.category}
              </span>
              <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold " + priorityStyles[result.priority]}>
                {result.priority} priority
              </span>
            </div>
            <Row icon={Star} label="What's important">
              {result.important}
            </Row>
            <Row icon={CalendarClock} label="Deadline">
              {result.deadline}
            </Row>
            <Row icon={ListChecks} label="Action needed">
              {result.action}
            </Row>
            <Row icon={Radio} label="Likely source">
              {result.source}
            </Row>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 py-16 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <Sparkles className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Your summary appears here</p>
              <p className="mt-1 text-xs text-muted-foreground">Connect your WhatsApp chats or pick a sample to see it structured.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
