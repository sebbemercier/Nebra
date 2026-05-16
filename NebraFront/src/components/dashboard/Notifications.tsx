import { AlertCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type Alert = {
  id: string
  type: string
  message: string
  hostname: string
  timestamp: number
}

interface NotificationsProps {
  lastEvent: any
}

export function Notifications({ lastEvent }: NotificationsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (lastEvent?.type === 'HEARTBEAT' && lastEvent.alerts?.length > 0) {
      const newAlerts = lastEvent.alerts.map((a: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        ...a,
        hostname: lastEvent.hostname,
        timestamp: Date.now(),
      }))
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 5))
    }
  }, [lastEvent])

  if (alerts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex w-80 items-start gap-3 rounded-lg border border-red-500/50 bg-system-dark/95 p-3 shadow-lg animate-in fade-in slide-in-from-right-5"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold uppercase text-red-400">Critical Alert: {alert.hostname}</p>
            <p className="truncate text-sm text-slate-200">{alert.message}</p>
          </div>
          <button
            onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
            className="text-muted-foreground hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
