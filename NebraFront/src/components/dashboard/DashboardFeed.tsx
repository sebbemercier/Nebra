import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Bell, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardFeedProps {
  lastEvent: any
}

export function DashboardFeed({ lastEvent }: DashboardFeedProps) {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (lastEvent) {
      setEvents((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          ...lastEvent
        },
        ...prev
      ].slice(0, 10))
    }
  }, [lastEvent])

  return (
    <Card className="mt-4 border-white/10 bg-card/90 shadow-lg">
      <CardHeader className="border-b border-white/10 pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-black uppercase text-white">
          <Bell className="h-3.5 w-3.5 text-nebra-blue" />
          Live Event Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto scrollbar-none">
          {events.length === 0 ? (
            <div className="feed-empty flex flex-col items-center justify-center py-10 text-muted-foreground">
               <span className="feed-radar mb-3">
                 <Activity className="h-8 w-8" />
               </span>
               <p className="text-[10px] font-black uppercase">Monitoring signals...</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={event.id} className="feed-row group border-b border-white/10 p-3 transition-colors hover:bg-white/5" style={{ animationDelay: `${index * 35}ms` }}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 rounded-full border p-1",
                    event.type === 'HEARTBEAT' ? "bg-network-teal/10 text-network-teal" : "bg-nebra-blue/10 text-nebra-blue"
                  )}>
                    {event.alerts?.length > 0 ? (
                      <Bell className="h-3 w-3" />
                    ) : event.type === 'HEARTBEAT' ? (
                      <Cpu className="h-3 w-3" />
                    ) : (
                      <Activity className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                       <p className="text-[11px] font-bold text-slate-200">
                         {event.hostname || 'System Event'}
                       </p>
                       <span className="text-[9px] text-muted-foreground font-mono">
                         {event.timestamp.toLocaleTimeString([], { hour12: false })}
                       </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {event.alerts?.length > 0 
                        ? event.alerts[0].message 
                        : event.type === 'HEARTBEAT' 
                          ? `Heartbeat received from ${event.serial_number}` 
                          : 'Operational status updated'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
