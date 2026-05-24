import { Suspense, lazy, memo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Asset } from '@/lib/api'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { History, UserPlus, Package, AlertTriangle, X, ChevronRight, User as UserIcon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssetTableProps {
  assets: Asset[]
  isLoading: boolean
  error: Error | null
  token: string
}

const statusStyles: Record<Asset['status'], string> = {
  deployed: 'bg-network-teal/15 text-network-teal border-network-teal/30 shadow-[0_0_18px_rgba(0,166,153,0.08)]',
  stock: 'bg-nebra-blue/15 text-nebra-blue border-nebra-blue/30 shadow-[0_0_18px_rgba(0,123,255,0.08)]',
  maintenance: 'bg-amber-400/15 text-amber-300 border-amber-300/30',
  archived: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
}

const AssetDetails = lazy(() =>
  import('./AssetDetails').then((module) => ({ default: module.AssetDetails })),
)

export const AssetTable = memo(function AssetTable({ assets, isLoading, error, token }: AssetTableProps) {
  const queryClient = useQueryClient()
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const checkoutMutation = useMutation({
    mutationFn: ({ assetId, userId }: { assetId: string; userId: string }) =>
      apiClient.checkoutAsset(assetId, userId, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets', token] }),
  })

  const checkinMutation = useMutation({
    mutationFn: (assetId: string) => apiClient.checkinAsset(assetId, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets', token] }),
  })

  if (selectedAsset) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedAsset(null)}
              className="h-8 px-2 text-muted-foreground"
            >
              Assets
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="text-sm font-semibold text-white">{selectedAsset.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(null)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="rounded-xl border border-white/10 bg-background/50 p-8 text-center text-xs font-bold uppercase text-muted-foreground">
              Loading asset telemetry...
            </div>
          }
        >
          <AssetDetails asset={selectedAsset} token={token} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-background/50 shadow-inner">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-white/[0.035] text-[10px] uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-3 font-medium">Asset ID</th>
            <th className="px-3 py-3 font-medium">Name</th>
            <th className="px-3 py-3 font-medium">Type</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">Current User</th>
            <th className="px-3 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-nebra-blue border-t-transparent" />
                  Loading inventory...
                </div>
              </td>
            </tr>
          ) : null}
          {error ? (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-red-400">
                <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
                {error.message}
              </td>
            </tr>
          ) : null}
          {!isLoading && !error && assets.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-nebra-blue">
                    <Monitor className="h-6 w-6" />
                  </span>
                  <span>No assets found.</span>
                </div>
              </td>
            </tr>
          ) : null}
          {assets.map((asset, index) => (
            <tr 
              key={asset.id} 
              className="asset-row group cursor-pointer border-t border-white/10 text-muted-foreground transition-colors hover:bg-white/[0.045]"
              onClick={() => setSelectedAsset(asset)}
              style={{ animationDelay: `${index * 28}ms` }}
            >
              <td className="px-3 py-3 text-[11px] font-mono text-nebra-blue/70 group-hover:text-nebra-blue">
                {asset.id.slice(0, 8)}
              </td>
              <td className="px-3 py-3 text-slate-200">
                <div className="flex items-center gap-2 font-medium">
                  <span className="asset-spark" />
                  {asset.name}
                  {asset.hardware_info?.os?.system && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {asset.hardware_info.os.system}
                    </span>
                  )}
                  {(asset.hardware_info?.cpu?.total_usage > 90 || 
                    asset.hardware_info?.memory?.percentage > 90) && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  )}
                </div>
              </td>
              <td className="px-3 py-3 text-[11px]">{asset.asset_type}</td>
              <td className="px-3 py-3">
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[9px] font-black uppercase',
                    statusStyles[asset.status],
                  )}
                >
                  {asset.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-3 py-3 text-[10px]">
                {asset.hardware_info?.current_user ? (
                   <div className="flex items-center gap-2 text-network-teal">
                     <UserIcon className="h-3 w-3" />
                     {asset.hardware_info.current_user}
                   </div>
                ) : (
                  <span className="text-muted-foreground">---</span>
                )}
              </td>
              <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1">
                  {asset.status === 'stock' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 text-nebra-blue hover:bg-nebra-blue/10 p-0"
                      title="Check-out"
                      onClick={() => {
                        const userId = prompt('Enter User ID to assign to:')
                        if (userId) checkoutMutation.mutate({ assetId: asset.id, userId })
                      }}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>
                  ) : asset.status === 'deployed' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 text-network-teal hover:bg-network-teal/10 p-0"
                      title="Check-in"
                      onClick={() => checkinMutation.mutate(asset.id)}
                    >
                      <Package className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 text-muted-foreground hover:text-white p-0"
                    title="View History"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <History className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
})
