import { Asset } from '@/lib/api'

interface AssetTableProps {
  assets: Asset[]
  isLoading: boolean
  error: Error | null
}

export function AssetTable({ assets, isLoading, error }: AssetTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border/80">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/35 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Asset ID</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Location</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Created</th>
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
              <td className="px-3 py-2">{asset.location}</td>
              <td className="px-3 py-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                    asset.status === 'verified'
                      ? 'bg-network-teal/20 text-network-teal'
                      : 'bg-yellow-500/20 text-yellow-500',
                  )}
                >
                  {asset.status}
                </span>
              </td>
              <td className="px-3 py-2">{new Date(asset.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import { cn } from '@/lib/utils'
