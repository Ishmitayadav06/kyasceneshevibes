"use client"

import { useCallback, useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { AnimatedIntro } from "@/components/animated-intro"
import { AnimatedBackground } from "@/components/animated-background"
import { AuthScreen } from "@/components/auth-screen"
import { TaskProvider } from "@/components/task-provider"
import { WelcomeMessage } from "@/components/welcome-message"
import { UserProvider } from "@/components/user-provider"
import { CampusHeader } from "@/components/campus-header"
import { MobileNav, Sidebar, VIEW_TITLES } from "@/components/app-nav"
import { AIAssistant } from "@/components/ai-assistant"
import { NotificationPanel } from "@/components/notification-panel"
import { SearchCommand } from "@/components/search-command"
import { DashboardView } from "@/components/views/dashboard-view"
import { FeedView } from "@/components/views/feed-view"
import { CalendarView } from "@/components/calendar-view"
import { TimetableView } from "@/components/views/timetable-view"
import { EventsView } from "@/components/views/events-view"
import { SocietiesView } from "@/components/views/societies-view"
import { SummarizerView } from "@/components/views/summarizer-view"
import { BestieView } from "@/components/views/bestie-view"
import { notifications as seedNotifications, type NavView } from "@/lib/campus-data"

export function AppShell() {
  const [showIntro, setShowIntro] = useState(true)
  const [introDuration, setIntroDuration] = useState(4200)
  const [authed, setAuthed] = useState(false)
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const [view, setView] = useState<NavView>("dashboard")
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [notifItems, setNotifItems] = useState(seedNotifications)

  const unread = notifItems.filter((n) => !n.read).length

  // Full intro on the first visit of a session, short one on reloads afterwards.
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("cc-intro-seen")
      setIntroDuration(seen ? 1400 : 4200)
    } catch {
      /* ignore */
    }
  }, [])

  const finishIntro = useCallback(() => {
    setShowIntro(false)
    try {
      sessionStorage.setItem("cc-intro-seen", "1")
    } catch {
      /* ignore */
    }
  }, [])

  // "/" opens search from anywhere (unless typing in a field).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      if (e.key === "/" && !typing && !searchOpen) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [searchOpen])

  const navigate = useCallback((v: NavView) => {
    setView(v)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Let any card deep in the tree request a section change via a custom event.
  useEffect(() => {
    function onNavigate(e: Event) {
      const detail = (e as CustomEvent<NavView>).detail
      if (detail) navigate(detail)
    }
    window.addEventListener("kya:navigate", onNavigate as EventListener)
    return () => window.removeEventListener("kya:navigate", onNavigate as EventListener)
  }, [navigate])

  const meta = VIEW_TITLES[view]

  // Stage 1 — cover / intro page.
  if (showIntro) {
    return (
      <>
        <AnimatedBackground />
        <AnimatedIntro duration={introDuration} onDone={finishIntro} />
      </>
    )
  }

  // Stage 2 — standalone login / signup page.
  if (!authed) {
    return (
      <>
        <AnimatedBackground />
        <AuthScreen
          onAuthed={(name) => {
            setUserName(name)
            setAuthed(true)
          }}
        />
      </>
    )
  }

  // Stage 3 — the app.
  return (
    <UserProvider name={userName}>
    <TaskProvider>
      <AnimatedBackground />

      <div className="flex min-h-dvh">
        <Sidebar view={view} onNavigate={navigate} />

        <div className="flex min-w-0 flex-1 flex-col">
          <CampusHeader
            title={meta.title}
            subtitle={meta.subtitle}
            unread={unread}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenNotifications={() => setNotifOpen(true)}
          />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
            <div key={view} className="cc-fade-up">
              {view === "dashboard" && <DashboardView onNavigate={navigate} onAskAI={() => setAssistantOpen(true)} />}
              {view === "feed" && <FeedView />}
              {view === "calendar" && <CalendarView />}
              {view === "timetable" && <TimetableView />}
              {view === "events" && <EventsView />}
              {view === "societies" && <SocietiesView />}
              {view === "summarizer" && <SummarizerView />}
              {view === "bestie" && <BestieView />}
            </div>
          </main>
        </div>
      </div>

      <MobileNav view={view} onNavigate={navigate} />

      {/* Floating AI assistant trigger */}
      <button
        type="button"
        onClick={() => setAssistantOpen(true)}
        aria-label="Open Kya Scene? assistant"
        className="group fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 py-3 pl-3 pr-4 text-sm font-semibold text-white shadow-xl shadow-violet-900/30 transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
      >
        <span className="relative inline-flex size-6 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-white/30 opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100" />
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      <WelcomeMessage name={userName === "user" ? undefined : userName} onGoToTasks={() => navigate("feed")} />

      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      <NotificationPanel
        open={notifOpen}
        items={notifItems}
        onClose={() => setNotifOpen(false)}
        onMarkAllRead={() => setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })))}
      />
      <AIAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </TaskProvider>
    </UserProvider>
  )
}
