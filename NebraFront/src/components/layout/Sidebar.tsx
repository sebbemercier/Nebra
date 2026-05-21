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
    <aside className="flex flex-col border-r border-border/40 bg-card/30 py-6">
      <div className="mb-10 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-nebra-blue to-nebra-blue/60 p-2 shadow-lg shadow-nebra-blue/20">
          <img src="/logo-icon.png" alt="Nebra" className="h-full w-full object-contain brightness-0 invert" />
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
              activeTab === item.id 
                ? 'bg-nebra-blue text-white shadow-md shadow-nebra-blue/20' 
                : 'text-muted-foreground hover:bg-muted/10 hover:text-white',
            )}
            title={item.label}
            type="button"
          >
            <item.icon className={cn("h-5 w-5", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} />
            {activeTab === item.id && (
              <div className="absolute -left-3 h-5 w-1 rounded-r-full bg-nebra-blue" />
            )}
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
