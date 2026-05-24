import { Settings as SettingsIcon, Save, SlidersHorizontal } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', token] })
  })

  if (isLoading) return <div className="p-4 text-muted-foreground text-sm">Loading settings...</div>

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-card/90 shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-black text-white">
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
            <div key={field.key} className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-network-teal" />
                    {field.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{field.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-20 rounded-lg border border-white/10 bg-background/70 px-2 py-1.5 text-right text-sm outline-none focus:border-nebra-blue/50"
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
              <input
                type="range"
                min="1"
                max="100"
                value={localValues[field.key] || 0}
                onChange={(e) => setLocalValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="accent-nebra-blue"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
