"use client"

import Link from "next/link"
import { ArrowRight, Smartphone, Zap, Sparkles, MousePointer2, CheckCircle2, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-slate-200 overflow-x-hidden text-slate-900">
      
      {/* 1. TIGHT UTILITY NAV */}
      <nav className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center max-w-[1400px]">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-7 w-7 bg-slate-900 rounded flex items-center justify-center transition-all group-hover:bg-black">
                <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">SisoNova</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/login" className="hover:text-slate-900 transition-colors uppercase">Login</Link>
            <Link href="/register">
              <Button className="bg-slate-900 text-white rounded-md px-5 h-8 font-bold text-[9px] tracking-[0.2em] hover:bg-black shadow-lg transition-all active:scale-95 border-none">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. THE HERO STORY */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10 border-b border-slate-300/50 pb-16">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black tracking-[0.2em] uppercase">
                <Sparkles className="h-3 w-3 text-emerald-400" /> B2B Invoicing Standard
              </div>
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic leading-none">
                Revenue <br /><span className="not-italic text-slate-400 font-light">Cycle.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                High-performance billing for South African SMEs. Send professional invoices that get processed faster.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-slate-900 text-white rounded-xl h-16 px-10 font-black text-xs tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-black transition-all active:scale-95">
                START INVOICING
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICE */}
      <section className="px-6 mb-32">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            
            {/* The Main Feature Card */}
            <div className="md:col-span-7">
               <Card className="rounded-[2.5rem] border-none shadow-2xl p-12 bg-white space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Smart Invoicing</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Utility</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                       <Smartphone className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                        <div>
                          <span className="text-4xl font-black text-slate-900 tracking-tighter italic">10x</span>
                          <span className="text-xs font-bold text-slate-400 ml-2 uppercase">Faster Processing</span>
                        </div>
                        <Badge variant="outline" className="rounded-lg bg-slate-900 text-white border-none font-black px-3 py-1 text-[9px] tracking-widest uppercase">
                           LIVE
                        </Badge>
                     </div>
                     
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Transition from messy manual documents to a high-standard digital ledger. SisoNova creates invoices that align with corporate ERP requirements instantly.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">WhatsApp Delivery</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">CIPC Compliance</p>
                     </div>
                  </div>
               </Card>
            </div>

            {/* Contextual Information */}
            <div className="md:col-span-5 space-y-6">
               <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-slate-900 shadow-sm relative overflow-hidden">
                  <MousePointer2 className="absolute -bottom-4 -right-4 h-24 w-24 text-slate-100 rotate-12" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">The Platform</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     Standardized invoicing with <span className="text-slate-900 font-bold">Late Fee automation</span> and <span className="text-slate-900 font-bold">VAT-compliant</span> summaries. Professionalism by default.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-900 rounded-[2rem] shadow-xl text-white">
                     <Clock className="h-5 w-5 text-slate-500 mb-3" />
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Saved</p>
                     <p className="text-xl font-black italic">12h/mo</p>
                  </div>
                  <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-slate-900">
                     <ShieldCheck className="h-5 w-5 text-slate-300 mb-3" />
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                     <p className="text-xl font-black italic">100%</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TIGHT FOOTER */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="container mx-auto max-w-[1400px]">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-5xl font-black tracking-tighter italic mb-4 leading-none text-slate-900">
                  Join the <span className="text-slate-300 not-italic">Elite.</span>
                </h2>
                <p className="text-slate-500 font-medium tracking-tight">Enterprise-grade invoicing for businesses that value time and cashflow health.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-slate-900 text-white rounded-xl px-10 h-14 text-xs font-black tracking-widest hover:bg-black transition-all uppercase shadow-2xl shadow-slate-200 border-none">
                    Create Account
                  </Button>
                  <Button variant="outline" className="text-slate-900 border-slate-200 rounded-xl px-10 h-14 text-xs font-black tracking-widest uppercase hover:bg-slate-50 transition-all">
                    Talk to Sales
                  </Button>
              </div>
           </div>
           
           <div className="mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="h-5 w-5 bg-slate-900 rounded flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white fill-white" />
                 </div>
                 <span className="text-sm font-black tracking-tighter uppercase">SisoNova</span>
              </div>
              <div className="flex gap-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="hover:text-slate-900 cursor-pointer">Compliance</span>
                 <span className="hover:text-slate-900 cursor-pointer">Pricing</span>
                 <span className="hover:text-slate-900 cursor-pointer">Contact</span>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 SISONOVA. NCR REGISTERED.</p>
           </div>
        </div>
      </section>
    </div>
  )
}