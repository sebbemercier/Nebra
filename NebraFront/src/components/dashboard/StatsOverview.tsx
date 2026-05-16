import { CalendarClock, ShieldCheck, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Asset } from '@/lib/api'

interface StatsOverviewProps {
  assets: Asset[]
  token: string
}

export function StatsOverview({ assets, token }: StatsOverviewProps) {
  const latestAsset = assets[0]

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <CalendarClock className="h-4 w-4 text-network-teal" />
            Renewal calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <p className="mb-3">Inventory completion</p>
          <div className="h-2 rounded-full bg-muted/50">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-nebra-blue to-network-teal"
              style={{
                width: `${Math.min((assets.length / 20) * 100, 100)}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <ShieldCheck className="h-4 w-4 text-nebra-blue" />
            Audit trail
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {token ? (
            <div className="space-y-1">
              <p>{assets.length} assets loaded from API.</p>
              <p className="text-nebra-blue">
                {assets.filter((a) => a.hardware_info).length} agent-managed devices.
              </p>
            </div>
          ) : (
            'Authenticate to query and mutate live data.'
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <Server className="h-4 w-4 text-data-grey" />
            Asset tag
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-100">
          {latestAsset ? latestAsset.serial_number : 'No asset selected'}
        </CardContent>
      </Card>
    </div>
  )
}
