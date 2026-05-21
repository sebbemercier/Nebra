import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, Search, Monitor } from 'lucide-react'
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

  // Auto-refresh assets on heartbeat
  useEffect(() => {
    if (lastEvent?.type === 'HEARTBEAT' && token) {
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

  const filteredAssets = useMemo(() => {
    const allAssets = assetsQuery.data ?? []
    if (!search.trim()) return allAssets
    const term = search.toLowerCase()
    return allAssets.filter((a) =>
      [a.name, a.asset_type, a.serial_number, a.location].join(' ').toLowerCase().includes(term),
    )
  }, [assetsQuery.data, search])

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-[1440px] rounded-2xl border border-border/40 bg-system-dark/80 backdrop-blur-xl shadow-2xl shadow-black/50">
        <div className="grid min-h-[88vh] grid-cols-[68px_1fr]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-nebra-blue" />
                  {healthQuery.data?.service ?? 'nebra'}
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                  IT Asset Management & CMDB
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-64 rounded-lg border border-border/60 bg-card/50 py-2 pl-9 pr-4 text-sm text-foreground outline-none focus:border-nebra-blue/50 transition-all"
                    placeholder="Search inventory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/40 border border-border/40">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      isConnected ? 'bg-network-teal animate-pulse' : 'bg-red-500',
                    )}
                  />
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    {isConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {activeTab === 'inventory' ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-4">
                  <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/40">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">
                        Asset Inventory
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <AssetForm
                        onSubmit={(payload) => createAssetMutation.mutate(payload)}
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
