import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, Search, Activity, Monitor } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/layout/Sidebar'
import { AssetTable } from '@/components/dashboard/AssetTable'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { AuthForms } from '@/components/auth/AuthForms'
import { AssetForm } from '@/components/dashboard/AssetForm'
import { Notifications } from '@/components/dashboard/Notifications'
import { DashboardFeed } from '@/components/dashboard/DashboardFeed'
import { SettingsPanel } from '@/components/dashboard/SettingsPanel'
import { useRealtime } from '@/lib/use-realtime'
import { cn } from '@/lib/utils'

const TOKEN_STORAGE_KEY = 'nebra.auth.token'

function getInitialToken() {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
  } catch (e) {
    console.error("Failed to access localStorage", e)
    return ''
  }
}

// Simple ErrorBoundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-system-dark p-10 text-white">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Something went wrong.</h1>
          <pre className="max-w-full overflow-auto rounded bg-black/50 p-4 text-xs text-red-400">
            {this.state.error?.toString()}
          </pre>
          <Button 
            className="mt-6" 
            onClick={() => {
               window.localStorage.removeItem(TOKEN_STORAGE_KEY)
               window.location.reload()
            }}
          >
            Clear Session & Reload
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

function MainApp() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string>(() => getInitialToken())
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
    queryFn: () => apiClient.listAssets(token),
    enabled: token.length > 0,
  })

  const loginMutation = useMutation({
    mutationFn: ({ userEmail, userPassword }: any) => apiClient.login(userEmail, userPassword),
    onSuccess: (result) => {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, result.access_token)
      setToken(result.access_token)
    },
  })

  const registerMutation = useMutation({
    mutationFn: ({ userEmail, userFullName, userPassword }: any) =>
      apiClient.register({ email: userEmail, full_name: userFullName, password: userPassword }),
    onSuccess: (_, variables) => {
      loginMutation.mutate({ userEmail: variables.userEmail, userPassword: variables.userPassword })
    },
  })

  const createAssetMutation = useMutation({
    mutationFn: (payload: any) => apiClient.createAsset(payload, token),
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

  function clearSession() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken('')
    queryClient.removeQueries({ queryKey: ['assets'] })
  }

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
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Enterprise Asset Intelligence</p>
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
                  <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-network-teal animate-pulse" : "bg-red-500")} />
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">{isConnected ? "Live" : "Offline"}</span>
                </div>
                {token ? (
                  <Button variant="ghost" size="sm" onClick={clearSession} className="text-muted-foreground hover:text-red-400">
                    <LogOut className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            {activeTab === 'inventory' ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-4">
                  <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/40">
                       <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">Asset Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {!token ? (
                        <div className="py-12">
                          <div className="mb-8 flex justify-center">
                            <img src="/logo-full.png" alt="Nebra Logo" className="h-20 object-contain drop-shadow-[0_0_15px_rgba(0,123,255,0.3)]" />
                          </div>
                          <AuthForms
                            onLogin={(email, pass) => loginMutation.mutate({ userEmail: email, userPassword: pass })}
                            onRegister={(email, name, pass) =>
                              registerMutation.mutate({ userEmail: email, userFullName: name, userPassword: pass })
                            }
                            isPending={loginMutation.isPending || registerMutation.isPending}
                            error={(loginMutation.error as Error) || (registerMutation.error as Error)}
                          />
                        </div>
                      ) : (
                        <>
                          <AssetForm
                            onSubmit={(payload) => createAssetMutation.mutate(payload)}
                            isPending={createAssetMutation.isPending}
                            error={createAssetMutation.error as Error}
                          />
                          <AssetTable
                            assets={filteredAssets}
                            isLoading={assetsQuery.isPending}
                            error={assetsQuery.error as Error}
                            token={token}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <StatsOverview assets={filteredAssets} token={token} />
                  <DashboardFeed lastEvent={lastEvent} />
                </div>
              </div>
            ) : activeTab === 'settings' ? (
              <SettingsPanel token={token} />
            ) : (
              <div className="flex flex-col h-[60vh] items-center justify-center text-muted-foreground gap-4">
                <div className="h-20 w-20 rounded-full bg-card/40 border border-border/40 flex items-center justify-center text-nebra-blue opacity-20">
                  <Activity className="h-10 w-10" />
                </div>
                <p className="text-sm font-medium tracking-wide uppercase opacity-30">Module "{activeTab}" under development</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Notifications lastEvent={lastEvent} />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  )
}
