import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, LogOut, UserCircle2, Search } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/layout/Sidebar'
import { AssetTable } from '@/components/dashboard/AssetTable'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { AuthForms } from '@/components/auth/AuthForms'
import { AssetForm } from '@/components/dashboard/AssetForm'

const TOKEN_STORAGE_KEY = 'nebra.auth.token'

function getInitialToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

function App() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string>(() => getInitialToken())
  const [search, setSearch] = useState('')

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
      <div className="mx-auto max-w-[1280px] rounded-2xl border border-border/80 bg-system-dark/90 shadow-2xl shadow-black/35">
        <div className="grid min-h-[86vh] grid-cols-[58px_1fr]">
          <Sidebar />

          <main className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold tracking-tight text-white">
                  {healthQuery.data?.service ?? 'nebra'}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Inventory</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 rounded-md border border-border/90 bg-card px-3 py-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <input
                    className="w-52 border-none bg-transparent text-sm text-foreground outline-none"
                    placeholder="Search assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <div className="rounded-full bg-card p-1.5">
                  <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>
                {token ? (
                  <Button variant="ghost" size="sm" onClick={clearSession}>
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="border-border/80 bg-card/95">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base text-white">Assets Management</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      API: {healthQuery.isPending ? 'connexion...' : healthQuery.data?.status ?? 'indisponible'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!token ? (
                    <>
                      <div className="mb-6 flex justify-center">
                        <img src="/logo-full.png" alt="Nebra Logo" className="h-16 object-contain" />
                      </div>
                      <AuthForms
                        onLogin={(email, pass) => loginMutation.mutate({ userEmail: email, userPassword: pass })}
                      onRegister={(email, name, pass) =>
                        registerMutation.mutate({ userEmail: email, userFullName: name, userPassword: pass })
                      }
                      isPending={loginMutation.isPending || registerMutation.isPending}
                      error={(loginMutation.error as Error) || (registerMutation.error as Error)}
                    />
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
                      />
                    </>
                  )}
                </CardContent>
              </Card>

              <StatsOverview assets={filteredAssets} token={token} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
