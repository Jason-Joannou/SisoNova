import { NavigationItem, NavigationSubItem } from "@/lib/types/user-interface"
import { BarChart3, Home, Settings, TrendingUp, Smartphone, LogOut, User, Zap, ChevronDown, LayoutDashboard, Plus, CalendarDays } from "lucide-react"

export const invoicingSubItems: NavigationSubItem[] = [
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

export const navigationItems: NavigationItem[] = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
        color: "text-slate-600",
        hasSubItems: false
    },
    //   {
    //     title: "Financing",
    //     url: "/dashboard/financing",
    //     icon: Zap,
    //     color: "text-emerald-600"
    //   },
    //   {
    //     title: "Collections",
    //     url: "/dashboard/collections",
    //     icon: TrendingUp,
    //     color: "text-blue-600"
    //   },
    //   {
    //     title: "Grow Your Business",
    //     url: "/dashboard/grow",
    //     icon: TrendingUp,
    //     color: "text-emerald-600"
    //   },
    {
        title: "Invoicing",
        url: "/dashboard/invoicing",
        icon: LayoutDashboard,
        color: "text-slate-600",
        hasSubItems: true,
        subItems: invoicingSubItems
    },
]

// Seperated
export const settingsItems: NavigationItem[] = [
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        color: "text-slate-600"
    },
]

