import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Asset, apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { History, UserPlus, Package } from 'lucide-react'

interface AssetTableProps {
  assets: Asset[]
  isLoading: boolean
  error: Error | null
  token: string
}

export function AssetTable({ assets, isLoading, error, token }: AssetTableProps) {
  const queryClient = useQueryClient()

  const checkoutMutation = useMutation({
    mutationFn: ({ assetId, userId }: { assetId: string; userId: string }) =>
      apiClient.checkoutAsset(assetId, userId, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets', token] }),
  })

  const checkinMutation = useMutation({
    mutationFn: (assetId: string) => apiClient.checkinAsset(assetId, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets', token] }),
  })

  return (
    <div className="overflow-hidden rounded-md border border-border/80">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/35 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Asset ID</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                Loading assets...
              </td>
            </tr>
          ) : null}
          {error ? (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-red-400">
                {error.message}
              </td>
            </tr>
          ) : null}
          {!isLoading && !error && assets.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                No assets yet. Create one with the form above.
              </td>
            </tr>
          ) : null}
          {assets.map((asset) => (
            <tr key={asset.id} className="border-t border-border/70 text-muted-foreground">
              <td className="px-3 py-2 text-nebra-blue">{asset.id.slice(0, 8)}</td>
              <td className="px-3 py-2 text-slate-100">
                {asset.name}
                {asset.hardware_info?.os?.system && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    ({asset.hardware_info.os.system})
                  </span>
                )}
              </td>
              <td className="px-3 py-2">{asset.asset_type}</td>
              <td className="px-3 py-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                    asset.status === 'deployed'
                      ? 'bg-network-teal/20 text-network-teal'
                      : asset.status === 'stock'
                        ? 'bg-nebra-blue/20 text-nebra-blue'
                        : 'bg-yellow-500/20 text-yellow-500',
                  )}
                >
                  {asset.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-3 py-2">{new Date(asset.created_at).toLocaleDateString()}</td>
              <td className="px-3 py-2">
                <div className="flex gap-1">
                  {asset.status === 'stock' ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-nebra-blue"
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
                      size="icon"
                      className="h-7 w-7 text-network-teal"
                      title="Check-in"
                      onClick={() => checkinMutation.mutate(asset.id)}
                    >
                      <Package className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-white"
                    title="View History"
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

import { cn } from '@/lib/utils'
