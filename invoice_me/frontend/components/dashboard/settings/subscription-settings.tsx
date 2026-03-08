"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  Zap, 
  History, 
  ArrowUpRight,
  Landmark,
  CheckCircle2
} from "lucide-react"

export default function SubscriptionSettings() {
  const [loading, setLoading] = useState(false);

  const mockInvoices = [
    { id: "INV-902", date: "01 MAR 2026", amount: "R 450.00", status: "Paid" },
    { id: "INV-841", date: "01 FEB 2026", amount: "R 450.00", status: "Paid" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* 1. EDITORIAL HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Plan <span className="text-slate-400 not-italic font-light">& Billing.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">
            Subscription Lifecycle & Financial Ledger
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-6 h-11 text-[10px] font-black tracking-widest border-slate-200 uppercase hover:bg-white">
            View Pricing
          </Button>
          <Button className="bg-slate-900 text-white rounded-xl px-8 h-11 text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase">
            Upgrade Plan
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-12 gap-10">
        
        {/* 2. MAIN BILLING STACK (LEFT - 70%) */}
        <div className="md:col-span-8 space-y-12">
          
          {/* ACTIVE PLAN SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Sparkles className="h-4 w-4 text-slate-900" />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Active Subscription</h2>
            </div>
            <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase tracking-[0.2em] px-3 h-5">Active Now</Badge>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Standard Merchant Plan</h3>
                  <p className="text-xs text-slate-400 font-medium">Billed monthly at R 450.00 / month</p>
                </div>
                <div className="text-left md:text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Settlement</p>
                   <p className="text-lg font-black text-slate-900 leading-none mt-1">01 APR 2026</p>
                </div>
              </div>

              {/* Usage Quotas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-slate-50">
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Invoice Capacity</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">42 / 50</p>
                   </div>
                   <Progress value={84} className="h-1.5 bg-slate-100" />
                   <p className="text-[9px] font-bold text-slate-400 uppercase">84% of monthly volume reached</p>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Financing Limit</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">R 12k / R 50k</p>
                   </div>
                   <Progress value={24} className="h-1.5 bg-slate-100" />
                   <p className="text-[9px] font-bold text-slate-400 uppercase">Low utilization on facility</p>
                </div>
              </div>
            </Card>
          </section>

          {/* PAYMENT METHODS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <CreditCard className="h-4 w-4 text-slate-900" />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Payment Instrument</h2>
            </div>
            <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Visa Ending in 4242</p>
                    <p className="text-xs text-slate-400 font-medium">Expires 12/28 • Default Method</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50">
                  Update
                </Button>
              </div>
            </Card>
          </section>

          {/* BILLING HISTORY */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <History className="h-4 w-4 text-slate-900" />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Settlement History</h2>
            </div>
            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Document</th>
                      <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-10 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 text-xs font-black text-slate-900 uppercase">{inv.id}</td>
                        <td className="px-10 py-6 text-xs font-bold text-slate-400 uppercase">{inv.date}</td>
                        <td className="px-10 py-6 text-xs font-black text-slate-900">{inv.amount}</td>
                        <td className="px-10 py-6 text-right">
                          <button className="h-8 w-8 rounded-lg border border-slate-200 inline-flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </div>

        {/* 3. SYSTEM METADATA (RIGHT - 30%) */}
        <div className="md:col-span-4 space-y-8 h-fit sticky top-20">
          
          {/* FINANCING VAULT CARD */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 p-10 text-white relative overflow-hidden">
            <Zap className="absolute -right-6 -top-6 h-32 w-32 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Liquidity Status</p>
                <h3 className="text-3xl font-black tracking-tighter italic uppercase leading-none">Vault <span className="not-italic text-slate-500 font-light">Verified.</span></h3>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <p>Your business profile is eligible for early invoice financing facilities.</p>
              </div>
              <Button className="w-full bg-emerald-500 text-white rounded-xl h-11 text-[10px] font-black tracking-widest hover:bg-emerald-600 uppercase mt-4">Access Capital</Button>
            </div>
          </Card>

          {/* TRUST BADGE */}
          <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                   <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">PCI Compliance</p>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase">
               Billing data is processed via AES-256 encrypted gateways. No card data is stored on SisoNova servers.
             </p>
          </div>
        </div>

      </div>
    </div>
  )
}