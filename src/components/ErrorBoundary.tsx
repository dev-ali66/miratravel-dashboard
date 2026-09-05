import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "./ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
          {/* Decorative background blobs */}
          <div className="pointer-events-none absolute top-1/4 -left-1/4 h-125 w-125 rounded-full bg-primary/5 blur-[100px]" />
          <div className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-125 w-125 rounded-full bg-destructive/10 blur-[100px]" />

          {/* Glassmorphic card */}
          <div className="animate-fade-in relative z-10 mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-6 rounded-[2rem] border border-border/50 bg-card/60 p-8 text-center shadow-2xl shadow-black/5 backdrop-blur-2xl sm:p-12">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
              <div
                className="absolute inset-0 animate-ping rounded-full bg-destructive/20 opacity-20"
                style={{ animationDuration: "3s" }}
              />
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Oops, something went wrong!
              </h1>
              <p className="text-sm text-muted-foreground">
                We're sorry, but an unexpected error has occurred. Please try
                reloading the page or return to the dashboard.
              </p>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-destructive/10 bg-destructive/5 p-4 text-left">
              <div className="mb-2 flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-xs font-semibold tracking-wider text-destructive uppercase">
                  Error Details
                </span>
              </div>
              <p className="font-mono text-sm wrap-break-word text-destructive/90">
                {this.state.error?.message ||
                  "An unexpected error occurred in the application."}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
              <Button
                size="lg"
                className="w-full rounded-xl sm:w-1/2"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-xl sm:w-1/2"
                onClick={() => (window.location.href = "/")}
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
