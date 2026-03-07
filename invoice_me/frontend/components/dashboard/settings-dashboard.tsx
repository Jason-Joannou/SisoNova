"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Building2, 
  Bell, 
  ShieldCheck, 
  Save, 
  CreditCard,
  Mail,
  Smartphone,
  Sparkles,
  Clock
} from "lucide-react"
import { useAppUser } from "@/lib/use-app-user"

export function SettingsDashboard() {
  const { appUser } = useAppUser();

  return (
    <div className="max-w-[1400px] mx-auto space-y-12">
      
      {/* 1. EDITORIAL HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
            System <span className="text-slate-400 not-italic font-light">Preferences.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">
            Configuration Hub • v1.2
          </p>
        </div>
        <Button className="bg-slate-900 text-white rounded-xl px-8 h-11 text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
          <Save className="h-3.5 w-3.5 mr-2" /> SAVE ALL CHANGES
        </Button>
      </header>

      <div className="grid md:grid-cols-12 gap-10">
        
        {/* 2. MAIN SETTINGS STACK (LEFT - 70%) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* BUSINESS IDENTITY CARD */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Merchant Identity</h2>
            <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-white space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Company Name</Label>
                  <Input 
                    placeholder="Legal Entity Name" 
                    defaultValue={appUser?.preferred_business_profile || ""}
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Industry Classification</Label>
                  <Input 
                    placeholder="e.g. Logistics, Retail" 
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Email</Label>
                  <Input 
                    placeholder="billing@company.co.za" 
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 focus:border-slate-900 focus:ring-0 transition-all font-bold" 
                  />
                </div>
              </div>
            </Card>
          </section>

          {/* NOTIFICATION PREFERENCES */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Automated Triggers</h2>
            <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-white space-y-6">
              {[
                { title: "Invoice Read Receipts", desc: "Notify when a buyer opens a digital invoice.", icon: Mail },
                { title: "WhatsApp Reminders", desc: "Send automated follow-ups via WhatsApp API.", icon: Smartphone },
                { title: "Late Fee Application", desc: "Automatically recalculate totals on overdue drafts.", icon: Clock },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-slate-900" />
                </div>
              ))}
            </Card>
          </section>
        </div>

        {/* 3. SYSTEM METADATA (RIGHT - 30%) */}
        <div className="md:col-span-4 space-y-8">
          
          {/* SUBSCRIPTION STATUS */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 p-10 text-white relative overflow-hidden">
            <Sparkles className="absolute -right-6 -top-6 h-32 w-32 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Account Tier</p>
                <h3 className="text-3xl font-black tracking-tighter italic">Standard <span className="not-italic text-slate-500 font-light">Merchant.</span></h3>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Billing</span>
                  <span className="text-xs font-black">01 APR 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usage Limit</span>
                  <span className="text-xs font-black italic">85% Capacity</span>
                </div>
              </div>
              <Button className="w-full bg-white text-slate-900 rounded-xl h-11 text-[10px] font-black tracking-widest hover:bg-slate-100 uppercase mt-4">
                Upgrade Plan
              </Button>
            </div>
          </Card>

          {/* SECURITY STATUS */}
          <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                   <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Security Protocol</p>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
               Two-factor authentication is <span className="text-emerald-600 font-black italic underline decoration-emerald-100 underline-offset-4">Enabled</span>. Your account identity is verified via Supabase Auth.
             </p>
             <Button variant="outline" className="w-full rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest h-10 hover:bg-slate-50">
               Update Security
             </Button>
          </div>
        </div>

      </div>
    </div>
  )
}