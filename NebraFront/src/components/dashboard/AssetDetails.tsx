import { useQuery } from '@tanstack/react-query'
import type { Asset } from '@/lib/api'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layout, Activity, Clock, User as UserIcon } from 'lucide-react'
import { MetricsPanel } from './MetricsPanel'

interface AssetDetailsProps {
  asset: Asset
  token: string
}

export function AssetDetails({ asset, token }: AssetDetailsProps) {
  const historyQuery = useQuery({
    queryKey: ['asset-history', asset.id, token],
    queryFn: () => apiClient.getAssetHistory(asset.id, token),
  })

  const hw = asset.hardware_info

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Layout className="h-3 w-3 text-nebra-blue" />
              Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SN:</span>
              <span className="font-mono text-slate-200">{asset.serial_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="text-slate-200">{asset.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-slate-200">{asset.asset_type}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <UserIcon className="h-3 w-3 text-network-teal" />
              Current User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-network-teal/20 flex items-center justify-center text-network-teal font-bold border border-network-teal/30">
                 {(hw?.os?.current_user || "U").charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="text-slate-100 font-semibold">{hw?.os?.current_user || "Not logged in"}</p>
                 <p className="text-[10px] text-muted-foreground italic">Detected by agent</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Clock className="h-3 w-3 text-nebra-blue" />
              Lifecycle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registered:</span>
              <span className="text-slate-200">{new Date(asset.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-nebra-blue uppercase font-bold text-[9px]">{asset.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <MetricsPanel asset={asset} />

      <Card className="border-border/40 bg-card/20">
        <CardHeader className="pb-2 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
            <Activity className="h-4 w-4 text-nebra-blue" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[300px] overflow-y-auto pt-4 scrollbar-thin scrollbar-thumb-border">
          <div className="space-y-4">
            {historyQuery.data?.map((item) => (
              <div key={item.id} className="relative pl-6 border-l border-border/60 pb-4 last:pb-0">
                <div className="absolute -left-1 top-1 h-2 w-2 rounded-full bg-nebra-blue shadow-[0_0_8px_rgba(0,123,255,0.4)]" />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-300 bg-muted/50 px-1.5 py-0.5 rounded">
                    {item.action}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.details}</p>
              </div>
            ))}
            {historyQuery.data?.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No activities logged yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
