"use client"

import { Calendar, CreditCard, FileText, Home, Settings, TrendingUp, Smartphone, LogOut, User, Zap } from "lucide-react"
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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigationItems = [
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
    title: "Invoicing",
    url: "/dashboard/invoicing",
    icon: Smartphone,
    color: "text-purple-600"
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    color: "text-slate-600"
  },
  {
    title: "Grow Your Business", // New section
    url: "/dashboard/grow",
    icon: TrendingUp,
    color: "text-emerald-600"
  },
]

const settingsItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    color: "text-slate-600"
  },
]

// Mock user data - replace with actual user data from your auth system
const userData = {
  name: "Jason Joannou",
  email: "jjoannou@bscglobal.com",
  avatar: "", // Add avatar URL if available
  initials: "JJ"
}

export function SidebarLeft() {
  const handleLogout = () => {
    // Add your logout logic here
    // For example: signOut(), clear tokens, redirect to login, etc.
    console.log("Logging out...")
    // window.location.href = "/login"
  }

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">PayFlow</h2>
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
                  <SidebarMenuButton asChild className="hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700">
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

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium text-xs uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-slate-50">
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
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium text-slate-900">{userData.name}</span>
                <span className="text-xs text-slate-500">{userData.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData.name}</p>
                <p className="text-xs leading-none text-slate-500">{userData.email}</p>
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