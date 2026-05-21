import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Asset } from '@/lib/api'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { History, UserPlus, Package, AlertTriangle, X, ChevronRight, User as UserIcon } from 'lucide-react'
import { AssetDetails } from './AssetDetails'
import { cn } from '@/lib/utils'

interface AssetTableProps {
  assets: Asset[]
  isLoading: boolean
  error: Error | null
  token: string
}

export function AssetTable({ assets, isLoading, error, token }: AssetTableProps) {
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
        <AssetDetails asset={selectedAsset} token={token} />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-border/80 bg-card/50">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/35 text-[10px] uppercase tracking-wider text-muted-foreground">
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
                No assets found.
              </td>
            </tr>
          ) : null}
          {assets.map((asset) => (
            <tr 
              key={asset.id} 
              className="group border-t border-border/40 text-muted-foreground hover:bg-muted/10 transition-colors cursor-pointer"
              onClick={() => setSelectedAsset(asset)}
            >
              <td className="px-3 py-3 text-[11px] font-mono text-nebra-blue/70 group-hover:text-nebra-blue">
                {asset.id.slice(0, 8)}
              </td>
              <td className="px-3 py-3 text-slate-200">
                <div className="flex items-center gap-2 font-medium">
                  {asset.name}
                  {asset.hardware_info?.os?.system && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {asset.hardware_info.os.system}
                    </span>
                  )}
                  {(asset.hardware_info?.cpu?.total_usage > 90 || 
                    asset.hardware_info?.memory?.percentage > 90) && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                  )}
                </div>
              </td>
              <td className="px-3 py-3 text-[11px]">{asset.asset_type}</td>
              <td className="px-3 py-3">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight',
                    asset.status === 'deployed'
                      ? 'bg-network-teal/15 text-network-teal border border-network-teal/30'
                      : asset.status === 'stock'
                        ? 'bg-nebra-blue/15 text-nebra-blue border border-nebra-blue/30'
                        : 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30',
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
  )
}
