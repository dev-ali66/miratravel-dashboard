import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/ThemeProvider.tsx"
import { DevModeProvider } from "@/context/DevModeContext.tsx"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <DevModeProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
              <Toaster richColors position="top-center" />
            </BrowserRouter>
          </QueryClientProvider>
        </DevModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
