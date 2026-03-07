"use client"

import Link from "next/link"
import { Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-slate-200 text-slate-900 flex flex-col">
      {/* TIGHT NAV */}
      <nav className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center max-w-[1400px]">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="h-7 w-7 bg-slate-900 rounded flex items-center justify-center transition-all group-hover:bg-black">
                <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">SisoNova</span>
          </Link>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/register" className="hover:text-slate-900 transition-colors uppercase underline decoration-slate-200 underline-offset-4">Register</Link>
          </div>
        </div>
      </nav>

      {/* LOGIN CONTENT */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Welcome <span className="text-slate-400 not-italic font-light">back.</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Access Portal</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <LoginForm />
          </div>
          
          <div className="flex items-center justify-center gap-2 opacity-50">
            <ShieldCheck className="h-3 w-3" />
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              AES-256 Encrypted Session
            </p>
          </div>
        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto max-w-6xl flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          <p>© 2026 SISONOVA PLATFORM</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Support</span>
            <span className="hover:text-slate-900 cursor-pointer">Security</span>
          </div>
        </div>
      </footer>
    </div>
  )
}