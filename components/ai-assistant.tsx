"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Sparkles, X } from "lucide-react"
import { assistantSuggestions, getChatReply } from "@/lib/campus-data"
import { useUser } from "@/components/user-provider"

type Message = { id: number; role: "user" | "ai"; text: string }

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { name } = useUser()
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 0,
      role: "ai",
      text: `Hi ${name}! I'm your Kya Scene? assistant. Ask me what to prioritize, what's due this week, or about upcoming events — I watch every campus channel for you.`,
    },
  ])
  const idRef = useRef(1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open, typing])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  function ask(question: string) {
    const q = question.trim()
    if (!q || typing) return
    const userMsg: Message = { id: idRef.current++, role: "user", text: q }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTyping(true)
    const reply = getChatReply(q)
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: idRef.current++, role: "ai", text: reply }])
      setTyping(false)
    }, 750)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Kya Scene? assistant">
      <button
        type="button"
        aria-label="Close assistant"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="cc-scale-in absolute bottom-0 right-0 flex h-[85vh] w-full flex-col border border-border bg-background shadow-2xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shadow-violet-600/40">
              <Sparkles className="size-4.5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">Kya Scene? AI</p>
              <p className="text-[11px] text-muted-foreground">Powered by your campus feeds</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  "cc-fade-up max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed " +
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
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5 py-3">
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

        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {assistantSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-foreground"
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
              placeholder="Ask about deadlines, events, hostels…"
              aria-label="Ask Kya Scene? a question"
              className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-violet-600"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || typing}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/30 transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="size-4.5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
