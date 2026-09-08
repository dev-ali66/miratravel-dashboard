import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"

export interface LiveTelemetrySnapshot {
  timestamp: string
  status: "HEALTHY" | "DEGRADED" | "DOWN"
  responseTimeMs: number
  database: {
    provider: string
    status: string
    latencyMs: number
  }
  redis: {
    status: string
    latencyMs: number
  }
  system: {
    platform: string
    cpus: number
    nodeVersion: string
    uptimeFormatted: string
    memory: {
      rssMb: number
      heapTotalMb: number
      heapUsedMb: number
      usagePercentage: number
    }
  }
}

export function useSystemSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [liveTelemetry, setLiveTelemetry] = useState<LiveTelemetrySnapshot | null>(null)
  const [latestAudit, setLatestAudit] = useState<any | null>(null)
  const [recentAudits, setRecentAudits] = useState<any[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5010"

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("system:subscribe")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("system:telemetry:stream", (data: LiveTelemetrySnapshot) => {
      setLiveTelemetry(data)
    })

    socket.on("system:audit:new", (auditLog: any) => {
      setLatestAudit(auditLog)
      setRecentAudits((prev) => [auditLog, ...prev.slice(0, 19)])
    })

    return () => {
      socket.emit("system:unsubscribe")
      socket.disconnect()
    }
  }, [])

  return {
    isConnected,
    liveTelemetry,
    latestAudit,
    recentAudits,
    socket: socketRef.current,
  }
}
