"use client"

import { useState } from "react"
import { GraduationCap, Mail, Lock, User, ArrowRight, Sparkles, GitBranch } from "lucide-react"

type Mode = "login" | "signup"

const branches = [
  "CSE",
  "CSE (AI)",
  "IT",
  "ECE",
  "ECE (AI)",
  "MAE",
  "B.Arch",
  "Digital Media",
  "Other",
] as const

export function AuthScreen({ onAuthed }: { onAuthed: (name?: string) => void }) {
  const [mode, setMode] = useState<Mode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [branch, setBranch] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === "signup"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // Demo only — no real auth. Brief delay so the button state reads as a submit.
    window.setTimeout(() => {
      const first = name.trim().split(/\s+/)[0] || email.trim().split("@")[0]
      onAuthed(first || undefined)
    }, 650)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <div className="cc-fade-up w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-background/70 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40">
              <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 [animation:cc-shimmer_3s_ease-in-out_infinite] motion-reduce:animate-none" />
              <GraduationCap className="size-7" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup ? "Join Kya Scene? to organize your campus life." : "Sign in to pick up where you left off."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-muted/60 p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignup && (
              <Field
                icon={<User className="size-4" aria-hidden="true" />}
                label="Full name"
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={setName}
                autoComplete="name"
                required
              />
            )}
            <Field
              icon={<Mail className="size-4" aria-hidden="true" />}
              label="Email"
              type="email"
              placeholder="you@igdtuw.ac.in"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />
            <Field
              icon={<Lock className="size-4" aria-hidden="true" />}
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Branch</span>
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 transition-colors focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/20">
                <span className="text-muted-foreground">
                  <GitBranch className="size-4" aria-hidden="true" />
                </span>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none [color-scheme:light] dark:[color-scheme:dark] [&>option]:bg-popover [&>option]:text-popover-foreground"
                  style={{ color: branch ? "var(--foreground)" : "var(--muted-foreground)" }}
                >
                  <option value="" disabled>
                    Select your branch
                  </option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            {!isSignup && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-violet-400 hover:text-violet-300">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {submitting ? (
                "Just a sec…"
              ) : (
                <>
                  {isSignup ? "Create account" : "Log in"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => onAuthed("user")}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Continue as guest
          </button>
        </div>

        <p className="mt-4 px-4 text-center text-xs leading-relaxed text-muted-foreground">
          This is a demo page — the details you enter aren&apos;t stored anywhere.
        </p>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
}: {
  icon: React.ReactNode
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 transition-colors focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/20">
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </span>
    </label>
  )
}
