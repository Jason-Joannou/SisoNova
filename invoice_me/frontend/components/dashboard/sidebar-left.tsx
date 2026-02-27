"use client"

import { BarChart3, Home, Settings, TrendingUp, Smartphone, LogOut, User, Zap, ChevronDown, LayoutDashboard, Plus, CalendarDays } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationItem, NavigationSubItem } from "@/lib/types/user-interface"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAppUser } from "@/lib/use-app-user"
import { useAuth } from "@/lib/auth-context"
import { getInitials } from "@/lib/utils"

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    color: "text-slate-600"
  },
  {
    title: "Financing",
    url: "/dashboard/financing",
    icon: Zap,
    color: "text-emerald-600"
  },
  {
    title: "Collections",
    url: "/dashboard/collections",
    icon: TrendingUp,
    color: "text-blue-600"
  },
  {
    title: "Grow Your Business",
    url: "/dashboard/grow",
    icon: TrendingUp,
    color: "text-emerald-600"
  },
]

// Invoicing submenu items
const invoicingSubItems: NavigationSubItem[] = [
  {
    title: "Overview",
    url: "/dashboard/invoicing",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    url: "/dashboard/invoicing/analytics",
    icon: BarChart3,
  },
  {
    title: "Create Invoice",
    url: "/dashboard/invoicing/create",
    icon: Plus,
  },
  {
    title: "Calendar",
    url: "/dashboard/invoicing/calendar",
    icon: CalendarDays,
  },
]

const settingsItems: NavigationItem[] = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    color: "text-slate-600"
  },
]


export function SidebarLeft() {
  const { user, logout } = useAuth(); // 'user' is the Supabase Auth user
  const { appUser, loading } = useAppUser(); // 'appUser' is your MongoDB user
  const pathname = usePathname()
  const [isInvoicingOpen, setIsInvoicingOpen] = useState(
    pathname?.startsWith("/dashboard/invoicing") || false
  )

  const handleLogout = async () => {
    // Add your logout logic here
    console.log("Logging out...")
    await logout()
    // window.location.href = "/login"
  }

  const displayName = user?.user_metadata?.full_name || appUser?.preferred_business_profile
  const userEmail = user?.email || "";
  const initials = getInitials(displayName, userEmail);
  const userImage = user?.user_metadata?.avatar_url
  const isValidImage = userImage && userImage.startsWith("http");

  const isActive = (url: string) => {
    if (url === "/dashboard/invoicing") {
      return pathname === url
    }
    return pathname === url || pathname?.startsWith(url + "/")
  }

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">SisoNova</h2>
            <p className="text-xs text-slate-500">Receivables Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium text-xs uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                    isActive={isActive(item.url)}
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-slate-700 font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Invoicing with Collapsible Submenu */}
              <Collapsible
                open={isInvoicingOpen}
                onOpenChange={setIsInvoicingOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="hover:bg-slate-50 data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700"
                      isActive={pathname?.startsWith("/dashboard/invoicing")}
                    >
                      <Smartphone className="h-4 w-4 text-purple-600" />
                      <span className="text-slate-700 font-medium">Invoicing</span>
                      <ChevronDown className={`ml-auto h-4 w-4 text-slate-500 transition-transform duration-200 ${isInvoicingOpen ? "rotate-180" : ""
                        }`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {invoicingSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                            className="hover:bg-slate-50 data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700"
                          >
                            <a href={subItem.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                              <subItem.icon className="h-4 w-4 text-purple-500" />
                              <span className="text-slate-700">{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium text-xs uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-slate-50"
                    isActive={isActive(item.url)}
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-slate-700 font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile & Logout */}
      <SidebarFooter className="border-t border-slate-200 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 h-auto hover:bg-slate-50">
              <Avatar className="h-8 w-8">
                {/* Supabase user metadata often stores avatar_url from Google/OAuth */}
                <AvatarImage src={userImage} alt={displayName} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                  {loading ? "..." : initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left overflow-hidden">
                <span className="text-sm font-medium text-slate-900 truncate w-full">
                  {loading ? "Loading..." : displayName}
                </span>
                <span className="text-xs text-slate-500 truncate w-full">
                  {userEmail}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-slate-500">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/dashboard/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}