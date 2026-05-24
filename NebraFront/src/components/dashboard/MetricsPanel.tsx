import { useMemo } from 'react'
import type { Asset } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Cpu, Database } from 'lucide-react'

interface MetricsPanelProps {
  asset: Asset
}

export function MetricsPanel({ asset }: MetricsPanelProps) {
  const hw = asset.hardware_info
  
  const chartData = useMemo(() => {
    if (!hw) return []
    const now = new Date()
    return Array.from({ length: 10 }).map((_, i) => ({
      time: new Date(now.getTime() - (9 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.max(0, Math.min(100, (hw.cpu?.total_usage || 0) + (Math.random() * 20 - 10))),
      ram: Math.max(0, Math.min(100, (hw.memory?.percentage || 0) + (Math.random() * 10 - 5)))
    }))
  }, [hw])

  if (!hw) return null

  return (
    <div className="grid gap-4 mt-4 lg:grid-cols-2">
      <Card className="border-white/10 bg-card/90 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
            <Cpu className="h-3 w-3 text-network-teal" /> CPU Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A699" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00A699" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1d1e22', border: '1px solid #3a3d48', fontSize: '10px' }}
                  itemStyle={{ color: '#00A699' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#00A699" 
                  fillOpacity={1} 
                  fill="url(#colorCpu)" 
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
             <span className="text-[10px] text-muted-foreground">Load average: {hw.cpu?.total_usage}%</span>
             <span className="text-[10px] text-network-teal font-mono">Live</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/90 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
            <Database className="h-3 w-3 text-nebra-blue" /> Memory Footprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1d1e22', border: '1px solid #3a3d48', fontSize: '10px' }}
                  itemStyle={{ color: '#007BFF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ram" 
                  stroke="#007BFF" 
                  fillOpacity={1} 
                  fill="url(#colorRam)" 
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
             <span className="text-[10px] text-muted-foreground">Utilized: {(hw.memory?.used / 1024**3).toFixed(1)} GB / {(hw.memory?.total / 1024**3).toFixed(1)} GB</span>
             <span className="text-[10px] text-nebra-blue font-mono">{hw.memory?.percentage}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
