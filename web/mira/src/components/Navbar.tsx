import { useRole } from '@/contexts/RoleContext';
import { Switch } from '@/components/ui/switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, User } from 'lucide-react';

export function Navbar() {
  const { role, toggleRole } = useRole();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-2" />
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground">MIRA</h1>
          <p className="text-[11px] text-muted-foreground">IT Asset Management</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Staff</span>
          <Switch checked={role === 'IT Department'} onCheckedChange={toggleRole} className="scale-75" />
          <span className="text-xs text-muted-foreground">IT Dept</span>
        </div>

        <button className="relative rounded-full p-2 hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium">{role === 'IT Department' ? 'David Kim' : 'Sarah Chen'}</p>
            <p className="text-[10px] text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
