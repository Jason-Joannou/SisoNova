"use client"

import { SidebarLeft } from "@/components/dashboard/sidebar-left"
import SubscriptionSettings from "@/components/dashboard/settings/subscription-settings"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function SubscriptionPage() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset className="bg-[#F1F5F9]">
        <header className="bg-white/70 backdrop-blur-md sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 z-10 px-4">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-slate-900 transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Settings / Plan & Billing
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <main className="p-4 lg:p-10">
          <SubscriptionSettings />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}