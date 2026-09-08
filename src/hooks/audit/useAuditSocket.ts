import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"

export interface LiveAuditLog {
  id: string
  timestamp: string
  actorName: string
  actorEmail: string
  actorRole: string
  action: string
  entityType: string
  entityId: string
  status: "SUCCESS" | "WARNING" | "FAILED"
  ipAddress: string
  details: string
  method?: string
  path?: string
  metadata?: Record<string, any>
}

export function useAuditSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [liveLogs, setLiveLogs] = useState<LiveAuditLog[]>([])
  const [streamCount, setStreamCount] = useState(0)
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
      socket.emit("audit:subscribe")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    const handleNewLog = (log: LiveAuditLog) => {
      setLiveLogs((prev) => [log, ...prev.slice(0, 99)]) // Keep latest 100 in terminal stream
      setStreamCount((c) => c + 1)
    }

    socket.on("audit:stream:new", handleNewLog)
    socket.on("audit:log", handleNewLog)

    return () => {
      socket.emit("audit:unsubscribe")
      socket.disconnect()
    }
  }, [])

  const clearStream = () => {
    setLiveLogs([])
  }

  return {
    isConnected,
    liveLogs,
    streamCount,
    clearStream,
    socket: socketRef.current,
  }
}
