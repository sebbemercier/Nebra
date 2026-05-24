import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Activity, Gauge, LogOut, Monitor, Package, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/layout/Sidebar'
import { AssetTable } from '@/components/dashboard/AssetTable'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { AssetForm } from '@/components/dashboard/AssetForm'
import { Notifications } from '@/components/dashboard/Notifications'
import { DashboardFeed } from '@/components/dashboard/DashboardFeed'
import { SettingsPanel } from '@/components/dashboard/SettingsPanel'
import { useRealtime } from '@/lib/use-realtime'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const queryClient = useQueryClient()
  const { token, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('inventory')
  const { lastEvent, isConnected } = useRealtime()
  const deferredSearch = useDeferredValue(search)
  const lastHeartbeatRefreshRef = useRef(0)

  // Auto-refresh assets on heartbeat
  useEffect(() => {
    if (lastEvent?.type === 'HEARTBEAT' && token) {
      const now = Date.now()
      if (now - lastHeartbeatRefreshRef.current < 5_000) return
      lastHeartbeatRefreshRef.current = now
      queryClient.invalidateQueries({ queryKey: ['assets', token] })
    }
  }, [lastEvent, token, queryClient])

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealth(),
  })

  const assetsQuery = useQuery({
    queryKey: ['assets', token],
    queryFn: () => apiClient.listAssets(token!),
    enabled: !!token,
  })

  const createAssetMutation = useMutation({
    mutationFn: (payload: any) => apiClient.createAsset(payload, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets', token] }),
  })
  const { mutate: createAsset } = createAssetMutation

  const handleCreateAsset = useCallback(
    (payload: Parameters<typeof apiClient.createAsset>[0]) => {
      createAsset(payload)
    },
    [createAsset],
  )

  const assets = useMemo(() => assetsQuery.data ?? [], [assetsQuery.data])

  const filteredAssets = useMemo(() => {
    if (!deferredSearch.trim()) return assets
    const term = deferredSearch.toLowerCase()
    return assets.filter((a) =>
      [a.name, a.asset_type, a.serial_number, a.location].join(' ').toLowerCase().includes(term),
    )
  }, [assets, deferredSearch])

  const dashboardStats = useMemo(() => {
    let deployed = 0
    let withAgent = 0
    let critical = 0

    for (const asset of assets) {
      if (asset.status === 'deployed') deployed += 1
      if (asset.hardware_info) withAgent += 1
      const cpu = asset.hardware_info?.cpu?.total_usage ?? 0
      const memory = asset.hardware_info?.memory?.percentage ?? 0
      if (cpu > 90 || memory > 90) critical += 1
    }

    return [
      {
        label: 'Total Assets',
        value: assets.length,
        icon: Package,
        tone: 'text-nebra-blue',
        detail: `${filteredAssets.length} visibles`,
      },
      {
        label: 'Déployés',
        value: deployed,
        icon: ShieldCheck,
        tone: 'text-network-teal',
        detail: `${assets.length ? Math.round((deployed / assets.length) * 100) : 0}% du parc`,
      },
      {
        label: 'Agents',
        value: withAgent,
        icon: Activity,
        tone: 'text-cyan-300',
        detail: isConnected ? 'live websocket' : 'signal perdu',
      },
      {
        label: 'Risques',
        value: critical,
        icon: Gauge,
        tone: critical ? 'text-amber-300' : 'text-slate-400',
        detail: critical ? 'à investiguer' : 'stable',
      },
    ]
  }, [assets, filteredAssets.length, isConnected])

  const latestSignal =
    lastEvent?.hostname || lastEvent?.serial_number || lastEvent?.type || 'En attente du prochain heartbeat'

  return (
    <div className="dashboard-shell min-h-screen bg-background p-4 text-foreground sm:p-6">
      <div className="ops-grid" />
      <div className="app-frame mx-auto max-w-[1500px] overflow-hidden rounded-2xl border border-white/10 bg-system-dark/95 shadow-2xl shadow-black/50">
        <div className="grid min-h-[88vh] grid-cols-[68px_minmax(0,1fr)]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="min-w-0 p-4 sm:p-6 lg:p-7">
            <div className="command-panel mb-6 rounded-2xl border border-white/10 bg-card/90 p-4 shadow-xl sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-network-teal/25 bg-network-teal/10 px-3 py-1.5 text-[10px] font-black uppercase text-network-teal">
                    <Sparkles className="h-3.5 w-3.5" />
                    Command center
                  </div>
                  <h1 className="flex flex-wrap items-center gap-3 text-3xl font-black text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                      <Monitor className="h-5 w-5 text-nebra-blue" />
                    </span>
                    {healthQuery.data?.service ?? 'nebra'}
                  </h1>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    IT Asset Management & CMDB avec signaux temps reel, audit et cycle de vie.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative min-w-0 sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="h-11 w-full rounded-xl border border-white/10 bg-background/70 py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-nebra-blue/60 focus:ring-4 focus:ring-nebra-blue/10"
                      placeholder="Search inventory..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="live-pill">
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        isConnected ? 'bg-network-teal shadow-[0_0_18px_rgba(0,166,153,0.85)]' : 'bg-red-500',
                      )}
                    />
                    <span>{isConnected ? 'Live' : 'Offline'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-muted-foreground hover:bg-red-500/10 hover:text-red-300"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map(({ icon: Icon, ...stat }) => (
                  <div key={stat.label} className="metric-tile">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">{stat.label}</p>
                        <p className="mt-1 text-3xl font-black text-white">{stat.value}</p>
                      </div>
                      <Icon className={cn('h-5 w-5', stat.tone)} />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">{stat.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-background/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="signal-rail" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-100">Dernier signal: {latestSignal}</p>
                    <p className="text-xs text-muted-foreground">Les heartbeats rafraichissent automatiquement l'inventaire.</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase text-muted-foreground">
                  {healthQuery.data?.version ?? 'v0.1.0'}
                </span>
              </div>
            </div>

            {activeTab === 'inventory' ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-4">
                  <Card className="overflow-hidden border-white/10 bg-card/90 shadow-2xl shadow-black/25">
                    <CardHeader className="border-b border-white/10 pb-3">
                      <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-sm font-black uppercase text-white">
                        Asset Inventory
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] text-muted-foreground">
                          {filteredAssets.length} / {assets.length}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <AssetForm
                        onSubmit={handleCreateAsset}
                        isPending={createAssetMutation.isPending}
                        error={createAssetMutation.error as Error}
                      />
                      <AssetTable
                        assets={filteredAssets}
                        isLoading={assetsQuery.isPending}
                        error={assetsQuery.error as Error}
                        token={token!}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <StatsOverview assets={filteredAssets} token={token!} />
                  <DashboardFeed lastEvent={lastEvent} />
                </div>
              </div>
            ) : activeTab === 'settings' ? (
              <SettingsPanel token={token!} />
            ) : (
              <div className="flex flex-col h-[60vh] items-center justify-center text-muted-foreground gap-4">
                <div className="h-20 w-20 rounded-full bg-card/40 border border-border/40 flex items-center justify-center text-nebra-blue opacity-20">
                  <Monitor className="h-10 w-10" />
                </div>
                <p className="text-sm font-medium tracking-wide uppercase opacity-30">
                  Module "{activeTab}" under development
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Notifications lastEvent={lastEvent} />
    </div>
  )
}
