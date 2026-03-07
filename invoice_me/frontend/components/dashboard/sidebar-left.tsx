"use client"

import { Settings, Smartphone, LogOut, User, ChevronDown, Zap } from "lucide-react"
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
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAppUser } from "@/lib/use-app-user"
import { useAuth } from "@/lib/auth-context"
import { getInitials } from "@/lib/utils"
import { navigationItems, settingsItems } from "@/lib/config/sidebar/config"

export function SidebarLeft() {
  const { user, logout } = useAuth();
  const { appUser, loading } = useAppUser();
  const pathname = usePathname()

  const handleLogout = async () => {
    console.log("Logging out...")
    await logout()
  }

  const displayName = user?.user_metadata?.full_name || appUser?.preferred_business_profile
  const userEmail = user?.email || "";
  const initials = getInitials(displayName, userEmail);
  const userImage = user?.user_metadata?.avatar_url

  const isActive = (url: string) => {
    if (!pathname) return false;
    if (pathname === url) return true;
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url + "/");
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 transition-all group-hover:bg-black">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">SisoNova</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform v1.2</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 px-4">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigationItems.map((item) => {
                const isSubActive = item.subItems?.some(sub => isActive(sub.url));
                const isItemActive = isActive(item.url);
                const activeAny = isSubActive || isItemActive;

                if (item.hasSubItems && item.subItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={activeAny}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={activeAny}
                            className="h-10 px-4 rounded-xl hover:bg-slate-50 transition-all data-[active=true]:bg-slate-900 data-[active=true]:text-white"
                          >
                            <item.icon className={`h-4 w-4 ${activeAny ? 'text-white' : 'text-slate-400'}`} />
                            <span className="text-[11px] font-black uppercase tracking-wider ml-1">{item.title}</span>
                            <ChevronDown className="ml-auto h-3 w-3 opacity-50 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 border-l border-slate-100 gap-1 mt-1">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(subItem.url)}
                                  className="h-9 rounded-lg data-[active=true]:bg-slate-50 data-[active=true]:text-slate-900"
                                >
                                  <a href={subItem.url} className="flex items-center gap-3">
                                    <subItem.icon className={`h-3.5 w-3.5 ${isActive(subItem.url) ? 'text-slate-900' : 'text-slate-400'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isItemActive}
                      className="h-10 px-4 rounded-xl hover:bg-slate-50 transition-all data-[active=true]:bg-slate-900 data-[active=true]:text-white shadow-none"
                    >
                      <a href={item.url}>
                        <item.icon className={`h-4 w-4 ${isItemActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="text-[11px] font-black uppercase tracking-wider ml-1">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 px-4">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-10 px-4 rounded-xl hover:bg-slate-50 data-[active=true]:bg-slate-900 data-[active=true]:text-white"
                  >
                    <a href={item.url}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-white' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-black uppercase tracking-wider ml-1">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="p-4 border-t border-slate-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6 h-auto hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
              <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm">
                <AvatarImage src={userImage} alt={displayName} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-slate-900 text-white text-xs font-black rounded-xl">
                  {loading ? "..." : initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left overflow-hidden">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight truncate w-full">
                  {loading ? "AUTHENTICATING..." : displayName}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate w-full">
                  {userEmail}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-[1.5rem] shadow-2xl border-slate-100">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Identity</p>
                <p className="text-sm font-black text-slate-900">{displayName}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer">
              <a href="/dashboard/profile" className="flex items-center text-[11px] font-black uppercase tracking-wider">
                <User className="mr-3 h-4 w-4 text-slate-400" /> Profile Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl h-10 px-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-[11px] font-black uppercase tracking-wider">Terminate Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}