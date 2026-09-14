"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircleHeart, Send, Sparkles } from "lucide-react"
import { assistantSuggestions, getChatReply } from "@/lib/campus-data"
import { useUser } from "@/components/user-provider"

type Message = { id: number; role: "user" | "ai"; text: string }

const OPENERS = [
  "Spill the tea — what's stressing you out today?",
  "Deadlines, drama, or dinner plans? I'm on it.",
  "Ask me anything, no judgment. That's what besties are for.",
]

export function BestieView() {
  const { name } = useUser()
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 0,
      role: "ai",
      text: `Heyyy ${name}! I'm Bestie, your always-online campus BFF. I keep an eye on every notice, group chat, and deadline so you don't have to. ${OPENERS[0]}`,
    },
  ])
  const idRef = useRef(1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  function ask(question: string) {
    const q = question.trim()
    if (!q || typing) return
    setMessages((prev) => [...prev, { id: idRef.current++, role: "user", text: q }])
    setInput("")
    setTyping(true)
    const reply = getChatReply(q)
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: idRef.current++, role: "ai", text: reply }])
      setTyping(false)
    }, 750)
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] max-w-3xl flex-col">
      {/* Hero header */}
      <div className="cc-pop flex items-center gap-3 rounded-3xl border border-border bg-gradient-to-br from-violet-600/10 via-card to-fuchsia-500/10 p-4">
        <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30">
          <MessageCircleHeart className="size-6" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-card bg-emerald-400" aria-hidden="true" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="flex items-center gap-1.5 text-base font-bold tracking-tight">
            Bestie
            <span className="text-sm font-semibold text-violet-500">(solution to every mess)</span>
            <Sparkles className="size-4 text-violet-500" aria-hidden="true" />
          </p>
          <p className="truncate text-xs font-medium text-emerald-500">
            Online now · your campus BFF who never misses a notice
          </p>
        </div>
      </div>

      {/* Chat thread */}
      <div className="mt-3 flex-1 space-y-3 overflow-y-auto rounded-3xl border border-border bg-card/40 p-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "cc-fade-up max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed " +
                (m.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                  : "rounded-bl-md bg-muted text-foreground")
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="mt-3">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {assistantSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="cc-pop shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                ask(input)
              }
            }}
            placeholder="Message Bestie… ask about deadlines, events, or what you missed"
            aria-label="Message Bestie"
            className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-violet-600"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || typing}
            className="cc-pop inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-sm shadow-violet-600/30 disabled:opacity-40"
          >
            <Send className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
