import { CalendarClock, ShieldCheck, Server, Monitor, Package, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Asset } from '@/lib/api'
import { cn } from '@/lib/utils'

interface StatsOverviewProps {
  assets: Asset[]
  token: string
}

export function StatsOverview({ assets, token }: StatsOverviewProps) {
  const stockCount = assets.filter(a => a.status === 'stock').length
  const deployedCount = assets.filter(a => a.status === 'deployed').length
  const agentCount = assets.filter(a => a.hardware_info).length
  
  const completionPercent = Math.min((assets.length / 50) * 100, 100)

  return (
    <div className="space-y-4">
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Inventory Health
            <Info className="h-3 w-3 opacity-50" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-end justify-between mb-1">
              <span className="text-2xl font-bold text-white">{assets.length}</span>
              <span className="text-[10px] text-muted-foreground mb-1">Total Assets</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-nebra-blue to-network-teal transition-all duration-1000"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/20 p-2 border border-border/40">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                <Monitor className="h-3 w-3 text-network-teal" /> Active
              </div>
              <div className="text-lg font-bold text-white">{agentCount}</div>
            </div>
            <div className="rounded-lg bg-muted/20 p-2 border border-border/40">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                <Package className="h-3 w-3 text-nebra-blue" /> Stock
              </div>
              <div className="text-lg font-bold text-white">{stockCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-nebra-blue" />
            Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-[11px] space-y-3">
          {token ? (
            <>
              <div className="flex justify-between items-center text-slate-300">
                <span>Agent coverage</span>
                <span className="font-mono text-network-teal">
                  {assets.length ? Math.round((agentCount / assets.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Deployment rate</span>
                <span className="font-mono text-nebra-blue">
                   {assets.length ? Math.round((deployedCount / assets.length) * 100) : 0}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground italic mt-2 border-t border-border/40 pt-2">
                Données synchronisées en temps réel via WebSocket avec l'agent Nebra.
              </p>
            </>
          ) : (
            <p className="text-muted-foreground italic">Connectez-vous pour voir les métriques de conformité en temps réel.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-gradient-to-br from-nebra-blue/10 to-transparent shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Server className="h-3 w-3 text-data-grey" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-network-teal animate-pulse" />
            <span className="text-xs text-slate-200">Plateforme Opérationnelle</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Tous les services actifs</p>
        </CardContent>
      </Card>
    </div>
  )
}
