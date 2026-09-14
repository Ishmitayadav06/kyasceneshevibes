"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, BellRing, Calendar, Check, ExternalLink, Info, Sparkles, Users, X } from "lucide-react"
import { societies, type Society } from "@/lib/campus-data"

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
}

function SocietyDetailModal({
  society,
  memberCount,
  onClose,
}: {
  society: Society
  memberCount: number
  onClose: () => void
}) {
  const [subscribed, setSubscribed] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="society-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="cc-scale-in relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 px-6 pb-6 pt-8 text-white">
          <div className="flex items-start gap-4">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white backdrop-blur">
              {initials(society.name)}
            </span>
            <div className="min-w-0 pr-8">
              <h2 id="society-modal-title" className="text-xl font-bold leading-tight">
                {society.name}
              </h2>
              <p className="mt-1 inline-flex flex-wrap items-center gap-1.5 text-sm text-white/80">
                <Users className="size-4" aria-hidden="true" />
                <span className="tabular-nums">{memberCount.toLocaleString()}</span> members
                <span aria-hidden="true">·</span>
                <span>Est. {society.founded}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap gap-1.5">
            {society.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground">{society.about}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <Calendar className="size-4 shrink-0 text-violet-500" aria-hidden="true" />
            <span>{society.meets}</span>
          </div>

          <div className="mt-5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="size-3.5 text-violet-500" aria-hidden="true" />
              Highlights
            </h3>
            <ul className="mt-2 space-y-1.5">
              {society.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={society.website}
            target="_blank"
            rel="noopener noreferrer"
            className="cc-pop group mt-5 flex items-center justify-between gap-3 rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-indigo-500/10 px-4 py-3 text-sm font-semibold text-violet-700 shadow-sm ring-1 ring-inset ring-white/10 dark:text-violet-300"
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                <ExternalLink className="size-4" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{society.websiteLabel ?? "Visit official website"}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {society.website.replace(/^https?:\/\//, "")}
                </span>
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-lg leading-none transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        <div className="border-t border-border bg-card px-6 py-4">
          <button
            type="button"
            onClick={() => setSubscribed((s) => !s)}
            aria-pressed={subscribed}
            className={
              "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors " +
              (subscribed
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white hover:opacity-90")
            }
          >
            {subscribed ? (
              <>
                <BellRing className="size-4" aria-hidden="true" />
                Subscribed for updates
              </>
            ) : (
              <>
                <Bell className="size-4" aria-hidden="true" />
                Subscribe to get updated
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function SocietyCard({ society, index }: { society: Society; index: number }) {
  const [open, setOpen] = useState(false)
  const memberCount = society.members

  return (
    <>
      <article
        className="cc-lift cc-fade-up flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-violet-500/30"
        style={{ animationDelay: `${index * 70}ms` }}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
            {initials(society.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-snug text-foreground">{society.name}</h3>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              <span className="tabular-nums">{memberCount.toLocaleString()}</span> members
            </p>
          </div>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{society.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {society.tags.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="cc-pop inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            <Info className="size-4" aria-hidden="true" />
            Know More
          </button>
        </div>
      </article>

      {open && <SocietyDetailModal society={society} memberCount={memberCount} onClose={() => setOpen(false)} />}
    </>
  )
}

export function SocietiesView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {societies.map((s, i) => (
        <SocietyCard key={s.id} society={s} index={i} />
      ))}
    </div>
  )
}
