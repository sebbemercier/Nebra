import { Activity, FolderKanban, LayoutGrid, ShieldCheck, Settings as SettingsIcon, LogOut } from 'lucide-react'
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
    <aside className="sidebar-rail flex flex-col border-r border-white/10 bg-card/90 py-6">
      <div className="mb-10 px-4">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-nebra-blue to-network-teal p-2 shadow-lg shadow-nebra-blue/20">
          <span className="brand-glint" />
          <img src="/logo-icon.png" alt="Nebra" className="h-full w-full object-contain brightness-0 invert" />
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200',
              activeTab === item.id 
                ? 'bg-white/[0.08] text-white shadow-md shadow-nebra-blue/20 ring-1 ring-nebra-blue/35' 
                : 'text-muted-foreground hover:bg-white/[0.055] hover:text-white',
            )}
            title={item.label}
            aria-label={item.label}
            type="button"
          >
            <item.icon className={cn("h-5 w-5 transition-transform", activeTab === item.id ? "scale-110 text-network-teal" : "group-hover:scale-110")} />
            {activeTab === item.id && (
              <div className="absolute -left-3 h-6 w-1 rounded-r-full bg-network-teal shadow-[0_0_18px_rgba(0,166,153,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-12 z-20 rounded-lg border border-white/10 bg-system-dark px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-xl transition group-hover:translate-x-1 group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="px-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
          title="Logout"
          type="button"
          onClick={() => {
            if (confirm('Logout?')) {
               window.localStorage.removeItem('nebra.auth.token')
               window.location.reload()
            }
          }}
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}
