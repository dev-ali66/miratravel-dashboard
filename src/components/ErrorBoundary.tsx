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
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
          {/* Decorative background blobs */}
          <div className="absolute top-1/4 -left-1/4 h-125 w-125 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -right-1/4 h-125 w-125 rounded-full bg-destructive/10 blur-[100px] pointer-events-none" />

          {/* Glassmorphic card */}
          <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-6 text-center bg-card/60 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-black/5 rounded-[2rem] p-8 sm:p-12 animate-fade-in">
            
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Oops, something went wrong!
              </h1>
              <p className="text-muted-foreground text-sm">
                We're sorry, but an unexpected error has occurred. Please try reloading the page or return to the dashboard.
              </p>
            </div>

            <div className="w-full overflow-hidden rounded-2xl bg-destructive/5 border border-destructive/10 p-4 text-left">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Error Details</span>
              </div>
              <p className="text-sm font-mono text-destructive/90 wrap-break-word">
                {this.state.error?.message || "An unexpected error occurred in the application."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full gap-3 pt-4">
              <Button 
                size="lg"
                className="w-full sm:w-1/2 rounded-xl"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-1/2 rounded-xl"
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
