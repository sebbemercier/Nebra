import { Activity, FolderKanban, LayoutGrid, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const navItems = [
    { icon: LayoutGrid, active: true },
    { icon: FolderKanban, active: false },
    { icon: Activity, active: false },
    { icon: ShieldCheck, active: false },
  ]

  return (
    <aside className="border-r border-border/80 px-2 py-4">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-nebra-blue to-network-teal text-sm font-bold">
        N
      </div>
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground',
              item.active && 'bg-nebra-blue/20 text-nebra-blue',
            )}
            type="button"
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </nav>
    </aside>
  )
}
