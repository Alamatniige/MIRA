import { useRole } from '@/contexts/RoleContext';
import { NavLink } from '@/components/NavLink';
import { useSidebar } from '@/components/ui/sidebar';
import {
  LayoutDashboard, Box, ArrowLeftRight, BarChart3, QrCode, Users, Settings, Laptop,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger,
} from '@/components/ui/sidebar';

const allItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, roles: ['Staff', 'IT Department'] },
  { title: 'Assets', url: '/assets', icon: Box, roles: ['IT Department'] },
  { title: 'My Assets', url: '/my-assets', icon: Laptop, roles: ['Staff'] },
  { title: 'Registry', url: '/registry', icon: ArrowLeftRight, roles: ['IT Department'] },
  { title: 'Reports', url: '/reports', icon: BarChart3, roles: ['IT Department'] },
  { title: 'QR Scanner', url: '/qr-scanner', icon: QrCode, roles: ['IT Department'] },
  { title: 'Users', url: '/users', icon: Users, roles: ['IT Department'] },
  { title: 'Settings', url: '/settings', icon: Settings, roles: ['IT Department'] },
];

export function AppSidebar() {
  const { role } = useRole();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const items = allItems.filter(item => item.roles.includes(role));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          M
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-foreground tracking-tight">MIRA</span>
        )}
      </div>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === '/'} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
