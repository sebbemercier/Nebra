import { Settings as SettingsIcon, Save } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface Setting {
  key: string
  value: string
  category: string
  description: string
}

export function SettingsPanel({ token }: { token: string }) {
  const queryClient = useQueryClient()
  const [localValues, setLocalValues] = useState<Record<string, string>>({})

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', token],
    queryFn: () => fetch('http://localhost:8000/api/v1/settings', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
  })

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const vals: Record<string, string> = {}
      settings.forEach((s: any) => vals[s.key] = s.value)
      setLocalValues(vals)
    }
  }, [settings])

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string, value: string }) =>
      fetch(`http://localhost:8000/api/v1/settings/${key}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  })

  if (isLoading) return <div className="p-4 text-muted-foreground text-sm">Loading settings...</div>

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <SettingsIcon className="h-4 w-4 text-nebra-blue" />
            Monitoring Thresholds
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Configure when Nebra should trigger critical alerts for your devices.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'threshold_cpu', label: 'CPU Usage (%)', desc: 'Critical threshold for CPU load' },
            { key: 'threshold_ram', label: 'RAM Usage (%)', desc: 'Critical threshold for memory usage' },
            { key: 'threshold_disk', label: 'Disk Usage (%)', desc: 'Critical threshold for storage capacity' },
          ].map((field) => (
            <div key={field.key} className="grid gap-2 border-b border-border/50 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-100">{field.label}</p>
                  <p className="text-xs text-muted-foreground">{field.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-20 rounded-md border border-border/90 bg-muted/30 px-2 py-1 text-sm text-right outline-none"
                    value={localValues[field.key] || ''}
                    onChange={(e) => setLocalValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => updateMutation.mutate({ key: field.key, value: localValues[field.key] })}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="h-4 w-4 text-network-teal" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
