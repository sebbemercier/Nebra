import { useState } from 'react'
import type { AssetCreatePayload } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Plus, X, Laptop, Hash, MapPin, Tag } from 'lucide-react'

interface AssetFormProps {
  onSubmit: (payload: AssetCreatePayload) => void
  isPending: boolean
  error: Error | null
}

export function AssetForm({ onSubmit, isPending, error }: AssetFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<AssetCreatePayload>({
    name: '',
    asset_type: '',
    serial_number: '',
    location: '',
  })

  function handleChange(field: keyof AssetCreatePayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
    setForm({ name: '', asset_type: '', serial_number: '', location: '' })
    setIsOpen(false)
  }

  const isValid = form.name && form.asset_type && form.serial_number && form.location

  if (!isOpen) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="mb-4 h-9 w-full justify-start gap-2 border border-dashed border-border/60 text-muted-foreground hover:border-nebra-blue/50 hover:text-nebra-blue"
      >
        <Plus className="h-4 w-4" />
        Register new asset...
      </Button>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-nebra-blue/30 bg-nebra-blue/5 p-4 shadow-[0_0_15px_rgba(0,123,255,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Laptop className="h-4 w-4 text-nebra-blue" />
          New Asset Registration
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <div className="relative">
          <Laptop className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full rounded-md border border-border/80 bg-background/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-nebra-blue/50 transition-colors"
            placeholder="Asset Name (e.g. MacBook Pro)"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="relative">
          <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full rounded-md border border-border/80 bg-background/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-nebra-blue/50 transition-colors"
            placeholder="Type (e.g. WORKSTATION)"
            value={form.asset_type}
            onChange={(e) => handleChange('asset_type', e.target.value)}
          />
        </div>
        <div className="relative">
          <Hash className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full rounded-md border border-border/80 bg-background/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-nebra-blue/50 transition-colors"
            placeholder="Serial Number"
            value={form.serial_number}
            onChange={(e) => handleChange('serial_number', e.target.value)}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full rounded-md border border-border/80 bg-background/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-nebra-blue/50 transition-colors"
            placeholder="Location"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
        
        {error && <p className="text-[10px] text-red-400 md:col-span-2">{error.message}</p>}
        
        <div className="flex justify-end gap-2 md:col-span-2 pt-1">
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            size="sm"
            disabled={!isValid || isPending}
            className="bg-nebra-blue text-xs hover:bg-nebra-blue/90"
          >
            {isPending ? 'Registering...' : 'Complete Registration'}
          </Button>
        </div>
      </form>
    </div>
  )
}
