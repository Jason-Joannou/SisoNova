"use client";

import Link from "next/link";
import { Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/registration-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-slate-200 text-slate-900 flex flex-col">
      {/* TIGHT NAV */}
      <nav className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center max-w-[1400px]">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="h-7 w-7 bg-slate-900 rounded flex items-center justify-center">
                <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">SisoNova</span>
          </Link>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/login" className="hover:text-slate-900 transition-colors uppercase underline decoration-slate-200 underline-offset-4">Login</Link>
          </div>
        </div>
      </nav>

      {/* REGISTRATION CONTENT */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black tracking-[0.2em] uppercase mx-auto">
               <Sparkles className="h-2.5 w-2.5 text-emerald-400" /> Start Scaling
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
              Create <span className="text-slate-400 not-italic font-light">Account.</span>
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Onboard your business in under 2 minutes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <RegisterForm />
          </div>

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
            By creating an account, you agree to our <span className="text-slate-900 underline underline-offset-2">Terms of Service</span> and POPIA disclosure.
          </p>
        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto max-w-6xl text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          © 2026 SISONOVA PLATFORM • REGISTERED CREDIT PROVIDER
        </div>
      </footer>
    </div>
  );
}