import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Bell, Cpu, User, CheckCircle2 } from 'lucide-react'
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
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xl mt-4">
      <CardHeader className="pb-2 border-b border-border/40">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
          <Bell className="h-3.5 w-3.5 text-nebra-blue" />
          Live Event Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto scrollbar-none">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-40">
               <Activity className="h-8 w-8 mb-2" />
               <p className="text-[10px] uppercase font-semibold">Monitoring signals...</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="group border-b border-border/40 p-3 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 rounded-full p-1",
                    event.type === 'HEARTBEAT' ? "bg-network-teal/10 text-network-teal" : "bg-nebra-blue/10 text-nebra-blue"
                  )}>
                    {event.alerts?.length > 0 ? (
                      <Bell className="h-3 w-3 animate-bounce" />
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
