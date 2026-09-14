"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CalendarClock,
  Check,
  MapPin,
  Users,
  X,
  Crown,
  Ticket,
  Handshake,
  Globe,
  ExternalLink,
  Plus,
  UserRound,
  Target,
} from "lucide-react"
import {
  campusEventCategories,
  campusEvents,
  type CampusEvent,
  type CampusEventCategory,
} from "@/lib/campus-data"

const categoryTone: Record<CampusEventCategory, string> = {
  Technical: "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-300",
  Cultural: "bg-fuchsia-500/10 text-fuchsia-600 ring-fuchsia-500/20 dark:text-fuchsia-300",
  Sports: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  Workshops: "bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  Hackathons: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-300",
  Societies: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-300",
}

type RegRole = "core" | "attend" | "participate"

const roles: {
  key: RegRole
  label: string
  short: string
  blurb: string
  icon: typeof Crown
  tone: string
}[] = [
  {
    key: "core",
    label: "Register for Core Team",
    short: "Core Team",
    blurb: "Help organise and run the event from behind the scenes.",
    icon: Crown,
    tone: "from-amber-500 to-orange-500",
  },
  {
    key: "attend",
    label: "Register to Attend",
    short: "Attending",
    blurb: "Reserve a seat and join as part of the audience.",
    icon: Ticket,
    tone: "from-sky-500 to-indigo-500",
  },
  {
    key: "participate",
    label: "Register to Participate",
    short: "Participating",
    blurb: "Compete or perform as an active participant.",
    icon: Handshake,
    tone: "from-violet-600 to-fuchsia-600",
  },
]

function RegistrationModal({
  event,
  onClose,
  onConfirm,
}: {
  event: CampusEvent
  onClose: () => void
  onConfirm: (role: RegRole) => void
}) {
  const [step, setStep] = useState<"choose" | "form">("choose")
  const [role, setRole] = useState<RegRole | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [team, setTeam] = useState("")
  const [motivation, setMotivation] = useState("")
  const [timeCommitment, setTimeCommitment] = useState("")
  const [skills, setSkills] = useState("")

  // Close on Escape and lock body scroll while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  const activeRole = roles.find((r) => r.key === role) ?? null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${event.name}`}
      onClick={onClose}
    >
      <div
        className="cc-fade-up w-full max-w-md overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
              {event.society}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold leading-snug text-foreground">{event.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        {step === "choose" ? (
          <div className="space-y-2.5 p-5">
            <p className="mb-1 text-sm text-muted-foreground">How would you like to join?</p>
            {roles.map((r) => {
              const Icon = r.icon
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => {
                    setRole(r.key)
                    setStep("form")
                  }}
                  className="cc-lift flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-violet-500/40"
                >
                  <span
                    className={
                      "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white " +
                      r.tone
                    }
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{r.short}</span>
                    <span className="block text-xs leading-snug text-muted-foreground">{r.blurb}</span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <form
            className="space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (role) onConfirm(role)
            }}
          >
            {activeRole ? (
              <div className="flex items-center gap-2.5 rounded-2xl bg-muted/60 p-3">
                <span
                  className={
                    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white " +
                    activeRole.tone
                  }
                >
                  <activeRole.icon className="size-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{activeRole.label}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("choose")
                      setTeam("")
                      setMotivation("")
                      setTimeCommitment("")
                      setSkills("")
                    }}
                    className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="text-xs font-semibold text-foreground">
                Full name
              </label>
              <input
                id="reg-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ishmita Sharma"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-foreground">
                College email
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@igdtuw.ac.in"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {role === "core" ? (
              <div className="space-y-1.5">
                <label htmlFor="reg-team" className="text-xs font-semibold text-foreground">
                  Which team do you want to join?
                </label>
                <select
                  id="reg-team"
                  required
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  <option value="Event Management">Event Management (EM)</option>
                  <option value="Public Relations">Public Relations (PR)</option>
                  <option value="Security">Security</option>
                  <option value="Sponsorship">Sponsorship</option>
                </select>
              </div>
            ) : null}

            {role === "core" || role === "participate" ? (
              <div className="space-y-1.5">
                <label htmlFor="reg-motivation" className="text-xs font-semibold text-foreground">
                  {role === "core" ? "Why would you want to join this team?" : "Why do you want to participate?"}
                </label>
                <textarea
                  id="reg-motivation"
                  required
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Tell us a little about your motivation…"
                  className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            ) : null}

            {role === "core" ? (
              <div className="space-y-1.5">
                <label htmlFor="reg-time" className="text-xs font-semibold text-foreground">
                  How much time can you give for the preparation?
                </label>
                <select
                  id="reg-time"
                  required
                  value={timeCommitment}
                  onChange={(e) => setTimeCommitment(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="" disabled>
                    Select availability
                  </option>
                  <option value="1-3 hrs/week">1–3 hours a week</option>
                  <option value="4-7 hrs/week">4–7 hours a week</option>
                  <option value="8-12 hrs/week">8–12 hours a week</option>
                  <option value="12+ hrs/week">12+ hours a week</option>
                </select>
              </div>
            ) : null}

            {role === "core" || role === "participate" ? (
              <div className="space-y-1.5">
                <label htmlFor="reg-skills" className="text-xs font-semibold text-foreground">
                  Skills
                </label>
                <input
                  id="reg-skills"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. design, public speaking, coding"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Confirm registration
            </button>
          </form>
        )}

        {event.website ? (
          <div className="border-t border-border px-5 py-4">
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="cc-lift flex items-center gap-2.5 rounded-2xl border border-border bg-background px-3.5 py-3 text-left transition-colors hover:border-violet-500/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                <Globe className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-foreground">Visit the official event site</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {event.websiteLabel ?? event.website.replace(/^https?:\/\//, "")}
                </span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function EventCard({ event, index }: { event: CampusEvent; index: number }) {
  const [role, setRole] = useState<RegRole | null>(event.registered ? "attend" : null)
  const [open, setOpen] = useState(false)

  const registeredRole = role ? roles.find((r) => r.key === role) : null

  return (
    <>
      <article
        className="cc-lift cc-fade-up flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-violet-500/30"
        style={{ animationDelay: `${index * 70}ms` }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset " +
              categoryTone[event.category]
            }
          >
            {event.category}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">{event.date}</span>
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">{event.name}</h3>
        <p className="mt-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">{event.society}</p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{event.description}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            {event.location}
          </span>
          {event.audience ? (
            <span className="inline-flex items-center gap-1.5">
              <Target className="size-3.5" aria-hidden="true" />
              {event.audience}
            </span>
          ) : null}
        </div>

        {registeredRole ? (
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="size-4" aria-hidden="true" />
              {registeredRole.short}
            </span>
            <button
              type="button"
              onClick={() => setRole(null)}
              className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Register
          </button>
        )}
      </article>

      {open ? (
        <RegistrationModal
          event={event}
          onClose={() => setOpen(false)}
          onConfirm={(r) => {
            setRole(r)
            setOpen(false)
          }}
        />
      ) : null}
    </>
  )
}

function AddEventModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (event: CampusEvent) => void
}) {
  const [name, setName] = useState("")
  const [host, setHost] = useState("")
  const [category, setCategory] = useState<CampusEventCategory>("Technical")
  const [audience, setAudience] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")

  // Close on Escape and lock body scroll while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  const fieldClass =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onCreate({
      id: `user-${Date.now()}`,
      name: name.trim(),
      society: host.trim(),
      host: host.trim(),
      category,
      audience: audience.trim() || undefined,
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      registered: false,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add a new event"
      onClick={onClose}
    >
      <div
        className="cc-fade-up flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
              New event
            </p>
            <h2 className="mt-0.5 text-lg font-semibold leading-snug text-foreground">Add an event for students</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        <form className="space-y-4 overflow-y-auto p-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="add-name" className="text-xs font-semibold text-foreground">
              Event name
            </label>
            <input
              id="add-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="AI & Robotics Meetup"
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="add-host" className="text-xs font-semibold text-foreground">
              Host name
            </label>
            <div className="flex items-center gap-2">
              <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                id="add-host"
                required
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="Robotics Society"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="add-category" className="text-xs font-semibold text-foreground">
              Category
            </label>
            <select
              id="add-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CampusEventCategory)}
              className={fieldClass}
            >
              {campusEventCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="add-audience" className="text-xs font-semibold text-foreground">
              Targeted audience
            </label>
            <input
              id="add-audience"
              required
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="1st & 2nd year students"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="add-date" className="text-xs font-semibold text-foreground">
                Date
              </label>
              <input
                id="add-date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="October 12"
                className={fieldClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="add-time" className="text-xs font-semibold text-foreground">
                Time
              </label>
              <input
                id="add-time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="5:00 PM"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="add-place" className="text-xs font-semibold text-foreground">
              Place
            </label>
            <input
              id="add-place"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Innovation Lab"
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="add-description" className="text-xs font-semibold text-foreground">
              Description
            </label>
            <textarea
              id="add-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share what the event is about, what students will do, and what to bring…"
              className={fieldClass + " resize-none"}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add event
          </button>
        </form>
      </div>
    </div>
  )
}

export function EventsView() {
  const [active, setActive] = useState<CampusEventCategory | "All">("All")
  const [events, setEvents] = useState<CampusEvent[]>(campusEvents)
  const [addOpen, setAddOpen] = useState(false)

  const visible = useMemo(
    () => (active === "All" ? events : events.filter((e) => e.category === active)),
    [active, events],
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
          <Users className="size-4.5 text-violet-500" aria-hidden="true" />
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{events.length}</span> events across{" "}
            <span className="font-semibold text-foreground">{campusEventCategories.length}</span> categories this month
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4.5" aria-hidden="true" />
          Add event
        </button>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(["All", ...campusEventCategories] as const).map((c) => {
          const selected = c === active
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors " +
                (selected
                  ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground")
              }
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((e, i) => (
          <EventCard key={e.id} event={e} index={i} />
        ))}
      </div>

      {addOpen ? (
        <AddEventModal
          onClose={() => setAddOpen(false)}
          onCreate={(event) => {
            setEvents((prev) => [event, ...prev])
            setActive("All")
            setAddOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
