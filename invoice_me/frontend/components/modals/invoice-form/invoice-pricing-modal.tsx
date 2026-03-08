"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Zap,
  Database,
  CreditCard,
  Check,
  Clock,
  BarChart3,
  Download,
  Cloud,
  ArrowRight,
  Info,
  Badge
} from "lucide-react";

interface PricingModalProps {
  children: React.ReactNode;
  invoiceTotal: number;
  currency: string;
}

export function PricingModal({
  children,
  invoiceTotal,
  currency,
}: PricingModalProps) {
  // PayStack pricing calculation (2.9% + R1 for local transactions, 3.1% + R1 for international transactions)
  const paystackLocalFee = invoiceTotal * 0.029 + 1;
  const paystackIntlFee = invoiceTotal * 0.031 + 1;
  const amountAfterLocalFee = invoiceTotal - paystackLocalFee;
  const amountAfterIntlFee = invoiceTotal - paystackIntlFee;

  const tiers = [
    { name: "Free", limit: "50 Invoices", price: "R0", history: "30-day history", bg: "bg-slate-50", border: "border-slate-200" },
    { name: "Starter", limit: "500 Invoices", price: "R29", history: "1-year history", bg: "bg-white", border: "border-slate-100" },
    { name: "Business", limit: "2,000 Invoices", price: "R79", history: "3-year history", bg: "bg-white", border: "border-slate-100" },
    { name: "Pro", limit: "Unlimited", price: "R149", history: "Lifetime history", bg: "bg-slate-900 text-white", border: "border-slate-900" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
        <div className="flex flex-col max-h-[90vh]">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white">
                  <ShieldCheck className="h-3.5 w-3.5 fill-white" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Financial Transparency</span>
              </div>
              <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">
                Pricing <span className="text-slate-400 not-italic font-light">Structure.</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500 mt-2">
                Pure transparency. We never take a cut of your hard-earned revenue.
              </DialogDescription>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
            
            {/* PROMISE SECTION */}
            <section className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                <Zap className="absolute -right-4 -top-4 h-24 w-24 text-white/5 rotate-12" />
                <div className="relative z-10 flex items-start gap-4">
                    <Check className="h-5 w-5 text-emerald-400 mt-1 shrink-0" />
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2 italic">The SisoNova Promise</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            <span className="text-white font-black underline decoration-white/20 underline-offset-4">SisoNova takes 0% commission</span> from your invoice payments. SMEs receive the full amount customers pay. We only charge for high-performance storage and business intelligence modules.
                        </p>
                    </div>
                </div>
            </section>

            {/* GATEWAY CALCULATOR */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Payment Processing Costs (Paystack)</h3>
                    <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] tracking-widest uppercase">Third-Party Gateway</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { title: "Local (South Africa)", rate: "2.9% + R1", fee: paystackLocalFee, receive: amountAfterLocalFee },
                        { title: "International", rate: "3.1% + R1", fee: paystackIntlFee, receive: amountAfterIntlFee }
                    ].map((calc, i) => (
                        <div key={i} className="p-6 rounded-[1.5rem] border border-slate-100 bg-white shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">{calc.title}</span>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded tracking-widest">{calc.rate}</span>
                            </div>
                            <div className="space-y-2 border-t border-slate-50 pt-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                    <span>Total:</span>
                                    <span>{currency} {invoiceTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-rose-500">
                                    <span>Gateway Fee:</span>
                                    <span>-{currency} {calc.fee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-black uppercase text-slate-900 pt-1 border-t border-slate-50">
                                    <span className="italic">Net Revenue:</span>
                                    <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-4">{currency} {calc.receive.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <Info className="h-4 w-4 text-emerald-600" />
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tight">EFT and Manual Bank Transfers are always 100% Free.</p>
                </div>
            </section>

            {/* STORAGE TIERS */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Storage & Intelligence Modules</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {tiers.map((tier, i) => (
                        <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:shadow-xl ${tier.bg} ${tier.border}`}>
                            <div className="space-y-1 mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{tier.name}</h4>
                                <p className="text-2xl font-black italic tracking-tighter">{tier.price}</p>
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Per Month</span>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-current/5">
                                <div className="flex items-center gap-2">
                                    <Database className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-tight">{tier.limit}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-tight">{tier.history}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>

          {/* FOOTER */}
          <DialogFooter className="p-8 bg-slate-50/30 border-t border-slate-50 shrink-0">
            <DialogClose asChild>
              <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-12 text-[10px] font-black tracking-widest transition-all shadow-xl shadow-slate-200 uppercase">
                Continue Workflow <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}