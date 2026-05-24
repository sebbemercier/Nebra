import { Activity, Info, Monitor, Package, Server, ShieldCheck } from 'lucide-react'
import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Asset } from '@/lib/api'

interface StatsOverviewProps {
  assets: Asset[]
  token: string
}

const complianceRows = [
  { key: 'coverage', label: 'Agent coverage', color: 'bg-network-teal' },
  { key: 'deployment', label: 'Deployment rate', color: 'bg-nebra-blue' },
  { key: 'stock', label: 'Stock reserve', color: 'bg-amber-300' },
] as const

export const StatsOverview = memo(function StatsOverview({ assets, token }: StatsOverviewProps) {
  let stockCount = 0
  let deployedCount = 0
  let agentCount = 0

  for (const asset of assets) {
    if (asset.status === 'stock') stockCount += 1
    if (asset.status === 'deployed') deployedCount += 1
    if (asset.hardware_info) agentCount += 1
  }

  const coverage = assets.length ? Math.round((agentCount / assets.length) * 100) : 0
  const deployment = assets.length ? Math.round((deployedCount / assets.length) * 100) : 0
  const stock = assets.length ? Math.round((stockCount / assets.length) * 100) : 0
  const readiness = Math.round(coverage * 0.55 + deployment * 0.35 + Math.min(stock, 30) * 0.1)

  const values = { coverage, deployment, stock }

  return (
    <div className="space-y-4">
      <Card className="radar-card border-white/10 bg-card/90 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-xs font-black uppercase text-muted-foreground">
            Inventory Health
            <Info className="h-3.5 w-3.5 opacity-60" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="dial-ring"
              style={{
                background: `conic-gradient(#00A699 ${readiness * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div className="dial-inner">
                <span>{readiness}</span>
                <small>score</small>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-3xl font-black text-white">{assets.length}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground">Total Assets</p>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                {agentCount} agents remontent des signaux, {deployedCount} assets sont deployes.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="mini-stat">
              <Monitor className="h-3.5 w-3.5 text-network-teal" />
              <span>Active</span>
              <strong>{agentCount}</strong>
            </div>
            <div className="mini-stat">
              <Package className="h-3.5 w-3.5 text-nebra-blue" />
              <span>Stock</span>
              <strong>{stockCount}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/90 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-nebra-blue" />
            Compliance Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-[11px]">
          {token ? (
            <>
              {complianceRows.map((row) => (
                <div key={row.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{row.label}</span>
                    <span className="font-mono text-slate-100">{values[row.key]}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border/40">
                    <div
                      className={`h-full rounded-full ${row.color} transition-[width] duration-500`}
                      style={{ width: `${values[row.key]}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="border-t border-white/10 pt-3 text-[10px] text-muted-foreground">
                Donnees synchronisees en temps reel via WebSocket avec l'agent Nebra.
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">Connectez-vous pour voir les metriques de conformite.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-gradient-to-br from-nebra-blue/10 via-card/80 to-network-teal/10 shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
            <Server className="h-3.5 w-3.5 text-data-grey" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="live-dot" />
            <span className="text-sm font-bold text-slate-100">Plateforme operationnelle</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">API, agent stream et dashboard prets.</p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-bold uppercase text-slate-400">
            <Activity className="h-3 w-3 text-network-teal" />
            Tous les services actifs
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
