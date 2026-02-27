"use client";
import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Search, Bell, User, Package, Users, FileText, Calendar, X, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/assets": "Asset Registry",
  "/assignment": "Asset Assignment",
  "/reports": "Reports",
  "/users": "Users",
  "/settings": "Settings",
  "/profile": "Profile",
};

// Mock data for search
const mockAssets = [
  { id: "AST-1042", name: "Dell Latitude 5520", type: "asset", href: "/assets" },
  { id: "AST-1038", name: "HP EliteDisplay E243", type: "asset", href: "/assets" },
  { id: "AST-1021", name: 'MacBook Pro 14"', type: "asset", href: "/assets" },
  { id: "AST-1015", name: "Lenovo ThinkPad X1", type: "asset", href: "/assets" },
];

const mockUsers = [
  { id: "1", name: "Maria Santos", email: "maria.santos@company.com", type: "user", href: "/users" },
  { id: "2", name: "John Doe", email: "john.doe@company.com", type: "user", href: "/users" },
  { id: "3", name: "Jane Smith", email: "jane.smith@company.com", type: "user", href: "/users" },
];

const mockAssignments = [
  { id: "AST-1042", name: "Assignment to John Doe", type: "assignment", href: "/assignment" },
  { id: "AST-1021", name: "Assignment to Jane Smith", type: "assignment", href: "/assignment" },
];

// Mock notifications
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "assignment" | "maintenance" | "alert" | "info";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Assignment",
    message: "AST-1042 has been assigned to John Doe",
    time: "2 minutes ago",
    read: false,
    type: "assignment",
  },
  {
    id: "2",
    title: "Maintenance Required",
    message: "AST-1038 requires maintenance",
    time: "1 hour ago",
    read: false,
    type: "maintenance",
  },
  {
    id: "3",
    title: "Critical Alert",
    message: "AST-1021 has a critical health issue",
    time: "3 hours ago",
    read: true,
    type: "alert",
  },
  {
    id: "4",
    title: "Weekly Report",
    message: "Your weekly asset report is ready",
    time: "1 day ago",
    read: true,
    type: "info",
  },
];

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const displayTitle = title ?? (pathname ? routeTitles[pathname] : undefined) ?? "Dashboard";
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { assets: [], users: [], assignments: [] };

    const query = searchQuery.toLowerCase();
    return {
      assets: mockAssets.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query)
      ),
      users: mockUsers.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
      ),
      assignments: mockAssignments.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  const handleSearchSelect = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return <Package className="h-4 w-4" />;
      case "maintenance":
        return <Calendar className="h-4 w-4" />;
      case "alert":
        return <Bell className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "alert":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400";
    }
  };

  return (
    <>
      <header 
        className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-teal-200/50 bg-white pl-4 pr-8 shadow-sm dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-white)]"
      >
        {/* Left: Sidebar Toggle + Page Title */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center rounded-xl p-2.5 text-teal-600 transition-all duration-200 hover:bg-teal-50 hover:shadow-sm hover:scale-105 dark:text-[var(--mira-teal)] dark:hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <Icon icon="mynaui:sidebar" className="h-6 w-6 text-teal-600 dark:text-[var(--mira-teal)]" />
          </button>
          <h1 className="text-xl font-bold text-teal-700 dark:text-[var(--foreground)]">
            {displayTitle}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500 transition-colors group-focus-within:text-teal-600 dark:text-[var(--mira-gray-500)]" />
            <input
              type="search"
              placeholder="Search..."
              onClick={() => setSearchOpen(true)}
              className="h-10 w-64 cursor-pointer rounded-xl border border-teal-200/60 bg-white/80 pl-9 pr-4 text-sm placeholder:text-teal-400/70 shadow-sm transition-all duration-200 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-300/30 focus:shadow-md hover:border-teal-300 dark:border-[var(--mira-gray-200)] dark:bg-white/10 dark:placeholder-[var(--mira-gray-500)] dark:focus:border-[var(--mira-teal)] dark:focus:bg-white/15 dark:hover:border-[var(--mira-gray-300)]"
            />
          </div>

          {/* Notifications */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-teal-600 transition-all duration-200 hover:bg-teal-50 hover:shadow-sm hover:scale-105 dark:text-[var(--mira-teal)] dark:hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.75} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 ring-2 ring-white shadow-sm dark:ring-[var(--mira-gray-200)]" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-0 bg-white dark:bg-[var(--mira-white)]" 
              align="end"
              sideOffset={8}
            >
              <div className="flex items-center justify-between border-b border-teal-200/50 px-4 py-3 dark:border-[var(--mira-gray-200)]">
                <h3 className="text-sm font-semibold text-teal-900 dark:text-[var(--foreground)]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-teal-600 hover:text-teal-700 dark:text-[var(--mira-teal)] dark:hover:text-teal-400"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-8 w-8 text-teal-300 dark:text-[var(--mira-gray-400)] mb-2" />
                    <p className="text-sm text-teal-600 dark:text-[var(--mira-gray-500)]">
                      No notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-teal-200/50 dark:divide-[var(--mira-gray-200)]">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={cn(
                          "flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-teal-50 dark:hover:bg-[var(--mira-gray-100)]",
                          !notification.read && "bg-teal-50 dark:bg-[var(--mira-gray-100)]"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                            getNotificationColor(notification.type)
                          )}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-teal-900 dark:text-[var(--foreground)]">
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-teal-600/80 dark:text-[var(--mira-gray-500)] line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1 text-xs text-teal-500 dark:text-[var(--mira-gray-400)]">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-teal-500 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile - clickable, goes to profile page */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-xl border border-teal-200/60 bg-white/80 px-3 py-2 shadow-sm transition-all duration-200 hover:border-teal-300 hover:shadow-md cursor-pointer group dark:border-[var(--mira-gray-200)] dark:bg-white/10 dark:hover:border-[var(--mira-gray-300)]"
            aria-label="Open profile"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d9488] text-white shadow-md transition-transform group-hover:scale-110 dark:bg-[var(--mira-teal)]"
            >
              <User className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-teal-900 dark:text-[var(--foreground)]">
                IT Admin
              </p>
              <p className="text-xs text-teal-600/80 dark:text-[var(--mira-gray-500)]">admin@company.com</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search assets, users, assignments..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {searchResults.assets.length > 0 && (
            <CommandGroup heading="Assets">
              {searchResults.assets.map((asset) => (
                <CommandItem
                  key={asset.id}
                  value={`${asset.id} ${asset.name}`}
                  onSelect={() => handleSearchSelect(asset.href)}
                  className="cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4 text-teal-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{asset.name}</span>
                    <span className="text-xs text-teal-600/70">{asset.id}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults.users.length > 0 && (
            <CommandGroup heading="Users">
              {searchResults.users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.email}`}
                  onSelect={() => handleSearchSelect(user.href)}
                  className="cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4 text-teal-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-teal-600/70">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults.assignments.length > 0 && (
            <CommandGroup heading="Assignments">
              {searchResults.assignments.map((assignment) => (
                <CommandItem
                  key={assignment.id}
                  value={`${assignment.id} ${assignment.name}`}
                  onSelect={() => handleSearchSelect(assignment.href)}
                  className="cursor-pointer"
                >
                  <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{assignment.name}</span>
                    <span className="text-xs text-teal-600/70">{assignment.id}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
