import { Activity, FolderKanban, LayoutGrid, ShieldCheck, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'inventory', icon: LayoutGrid, label: 'Inventory' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'security', icon: ShieldCheck, label: 'Security' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ]

  return (
    <aside className="border-r border-border/80 px-2 py-4">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-card overflow-hidden border border-border/50">
        <img src="/logo-icon.png" alt="Nebra" className="h-7 w-7 object-contain" />
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground',
              activeTab === item.id && 'bg-nebra-blue/20 text-nebra-blue',
            )}
            title={item.label}
            type="button"
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </nav>
    </aside>
  )
}
