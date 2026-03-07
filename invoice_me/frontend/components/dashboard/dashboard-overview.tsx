"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ComingSoon } from "../ui/coming-soon";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Zap,
  CreditCard,
  Smartphone,
  ArrowRight,
  Sparkles,
  Lock,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { BusinessProfileModal } from "../modals/ui/business-profile";
import { BusinessProfile } from "@/lib/types/invoicing";
import { API_ROUTES } from "@/lib/utility/api/routes";
import { apiClient } from "@/lib/api-client";
import { useAppUser } from "@/lib/use-app-user";

type Trend = "up" | "down" | "neutral";

type ServiceSummaryItem = {
  label: string;
  value: string | number;
  trend?: Trend;
};

type FinancialService = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  comingSoon: boolean;
  summary: ServiceSummaryItem[];
  route: string;
};

export function DashboardOverview() {
  const router = useRouter();
  const { appUser, refreshAppUser } = useAppUser();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (appUser?.preferred_business_profile === null) {
      setShowProfileModal(true);
    }
  }, [appUser?.preferred_business_profile]);

  const handleBusinessProfileSubmit = async (data: BusinessProfile) => {
    try {
      await apiClient(API_ROUTES.addBusinessProfile(appUser.id), {
        method: "POST",
        body: JSON.stringify(data),
      });
      await refreshAppUser();
      setShowProfileModal(false);
    } catch (error) {
      console.error("Error saving business profile:", error);
    }
  };

  const getTrendIcon = (trend?: Trend) => {
    if (!trend) return null;
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-emerald-500" />;
    if (trend === "down") return <TrendingUp className="h-3 w-3 text-rose-500 rotate-180" />;
    return null;
  };

  const financialServices: FinancialService[] = [
    {
      id: "invoicing",
      name: "Invoicing",
      description: "Professional billing workflow.",
      icon: Smartphone,
      isActive: true,
      comingSoon: false,
      summary: [
        { label: "Drafts Sent", value: 12, trend: "up" },
        { label: "Active Revenue", value: "R45k" },
      ],
      route: "/dashboard/invoicing",
    },
    {
      id: "financing",
      name: "Financing",
      description: "Same-day invoice liquidity.",
      icon: Zap,
      isActive: false,
      comingSoon: true,
      summary: [{ label: "Status", value: "Locked" }],
      route: "/dashboard/financing",
    },
    {
      id: "collections",
      name: "Collections",
      description: "Automated payment recovery.",
      icon: CreditCard,
      isActive: false,
      comingSoon: true,
      summary: [{ label: "Status", value: "Locked" }],
      route: "/dashboard/collections",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-slate-200 text-slate-900 p-4 lg:p-10">
      <BusinessProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onSubmit={handleBusinessProfileSubmit}
        allowClose={false}
      />

      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* 1. REFINED INTEGRATED HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
              Control <span className="text-slate-400 not-italic font-light">Center.</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
               <Badge className="bg-slate-900 text-white border-none font-black px-3 py-1 text-[8px] tracking-[0.2em] uppercase">
                 <Sparkles className="h-2 w-2 mr-1.5 text-emerald-400" /> Standard
               </Badge>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">Verified Merchant</span>
            </div>
          </div>

          {/* NEW MERCHANT IDENTITY TRIGGER (TIGHT & ACCESSIBLE) */}
          <div 
            onClick={() => {/* Trigger Profile Settings */}}
            className="group flex items-center bg-white border border-slate-200 p-1.5 pr-6 rounded-2xl shadow-sm hover:border-slate-400 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200 group-hover:scale-95 transition-transform">
               {appUser?.preferred_business_profile?.[0] || "U"}
            </div>
            <div className="ml-4 mr-8 space-y-0.5">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Merchant Identity</p>
               <p className="text-sm font-black text-slate-900 leading-none">
                 {appUser?.preferred_business_profile || "Complete Setup"}
               </p>
            </div>
            <Settings2 className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
          </div>
        </header>

        {/* 2. OPERATIONAL MODULES (FULL WIDTH FOCUS) */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
              Operational Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {financialServices.map((service) => (
              <div key={service.id} className="relative group">
                <Card
                  onClick={() => !service.comingSoon && router.push(service.route)}
                  className={`rounded-[2.5rem] border-none shadow-xl transition-all duration-500 p-10 flex flex-col h-full
                    ${
                      service.comingSoon
                        ? "bg-slate-50/50 opacity-60 grayscale cursor-not-allowed border-slate-100"
                        : "bg-white hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                    }`}
                >
                  <div className="flex justify-between items-start mb-12">
                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all
                      ${
                        service.comingSoon
                          ? "bg-slate-200 text-slate-400"
                          : "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      }`}
                    >
                      <service.icon className="h-7 w-7" />
                    </div>
                    {!service.comingSoon ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-none font-black px-3 py-1 text-[9px] tracking-widest uppercase">
                        Live
                      </Badge>
                    ) : (
                      <Lock className="h-4 w-4 text-slate-200" />
                    )}
                  </div>

                  <div className="space-y-2 mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {service.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-50 space-y-4">
                    {service.summary.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900 italic">
                            {item.value}
                          </span>
                          {getTrendIcon(item.trend)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!service.comingSoon && (
                    <Button
                      variant="ghost"
                      className="w-full mt-10 text-[10px] font-black tracking-widest text-slate-900 hover:bg-slate-50 rounded-xl uppercase transition-colors group"
                    >
                      Access Utility 
                      <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </Card>

                {service.comingSoon && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/80 backdrop-blur-sm px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-slate-200 shadow-sm text-slate-400">
                      In Development
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. TIGHT SYSTEM STATUS FOOTER */}
        <footer className="pt-20 text-center">
           <div className="inline-flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              <span>SisoNova Core v1.2</span>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <span>All Systems Operational</span>
           </div>
        </footer>

      </div>
    </div>
  );
}