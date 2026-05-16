import { useState } from 'react'
import { AssetCreatePayload } from '@/lib/api'

interface AssetFormProps {
  onSubmit: (payload: AssetCreatePayload) => void
  isPending: boolean
  error: Error | null
}

export function AssetForm({ onSubmit, isPending, error }: AssetFormProps) {
  const [form, setForm] = useState<AssetCreatePayload>({
    name: '',
    asset_type: '',
    serial_number: '',
    location: '',
  })

  function handleChange(field: keyof AssetCreatePayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    onSubmit(form)
    setForm({ name: '', asset_type: '', serial_number: '', location: '' })
  }

  const isValid = form.name && form.asset_type && form.serial_number && form.location

  return (
    <div className="mb-4 grid gap-2 rounded-md border border-border/70 p-3 md:grid-cols-4">
      {[
        ['Name', 'name'],
        ['Type', 'asset_type'],
        ['Serial', 'serial_number'],
        ['Location', 'location'],
      ].map(([label, field]) => (
        <input
          key={field}
          className="rounded-md border border-border/90 bg-muted/30 px-3 py-2 text-sm outline-none"
          placeholder={label}
          value={form[field as keyof AssetCreatePayload] ?? ''}
          onChange={(e) => handleChange(field as keyof AssetCreatePayload, e.target.value)}
        />
      ))}
      {error && <p className="text-xs text-red-400 md:col-span-4">{error.message}</p>}
      <div className="md:col-span-4 flex justify-end">
         <Button 
           variant="primary" 
           size="sm"
           onClick={handleSubmit} 
           disabled={!isValid || isPending}
         >
           <Plus className="mr-1 h-4 w-4" />
           Add asset
         </Button>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
