import * as React from "react"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, LayoutDashboard, Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/hooks/auth/useLogin"

export default function SignIn() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const { mutate: login, isPending } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column - Branding / Visual */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 z-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* Primary Color Glow */}
          <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-accent/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <LayoutDashboard className="size-5 text-primary-foreground" />
          </div>
          Mira Dashboard
        </div>

        <div className="relative z-10 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <blockquote className="space-y-4">
              <p className="text-2xl font-medium tracking-tight text-zinc-100">
                "The ultimate tool to manage your projects, analyze data, and drive growth with incredible efficiency."
              </p>
              <footer className="text-base text-zinc-400">
                — Mira System
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:hidden">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <LayoutDashboard className="size-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="size-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 pl-11 bg-muted/40 border-transparent shadow-none hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="size-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 px-11 bg-muted/40 border-transparent shadow-none hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/10 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="group h-11 w-full text-base shadow-sm transition-all"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
