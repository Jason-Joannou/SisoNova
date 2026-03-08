"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, 
  ShieldCheck, 
  Save, 
  Mail,
  Sparkles,
  Zap,
  Fingerprint
} from "lucide-react"
import { useAppUser } from "@/lib/use-app-user"
import { useAuth } from "@/lib/auth-context"

export default function UserProfilePage() {
  const { user } = useAuth();
  const { appUser } = useAppUser();
  const [loading, setLoading] = useState(false);

  // Unified state for user identity
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    username: user?.user_metadata?.username || "",
    phone: user?.user_metadata?.phone || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    console.log("Saving User Identity:", formData);
    // Simulate API sync
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* 1. EDITORIAL HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            User <span className="text-slate-400 not-italic font-light">Identity.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">
            Account Credentials & Personal Preferences
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-900 text-white rounded-xl px-8 h-11 text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase"
        >
          <Save className="h-3.5 w-3.5 mr-2" /> {loading ? "Syncing..." : "Save All Changes"}
        </Button>
      </header>

      <div className="grid md:grid-cols-12 gap-10">
        
        {/* 2. MAIN SETTINGS STACK (LEFT - 70%) */}
        <div className="md:col-span-8 space-y-12">
          
          {/* PERSONAL PROFILE SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <User className="h-4 w-4 text-slate-900" />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Personal Profile</h2>
            </div>
            <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-white space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Full Legal Name</Label>
                  <Input 
                    value={formData.full_name} 
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">System Username</Label>
                  <Input 
                    value={formData.username} 
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="@username"
                    className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Email Address</Label>
                  <div className="relative">
                    <Input 
                      disabled 
                      value={formData.email} 
                      className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold opacity-60 pl-10" 
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ACCESS SECURITY SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Fingerprint className="h-4 w-4 text-slate-900" />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Security Vault</h2>
            </div>
            <Card className="rounded-[2.5rem] border-none shadow-2xl p-10 bg-slate-900 text-white space-y-8 relative overflow-hidden">
              <ShieldCheck className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 -rotate-12" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Contact Phone</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="rounded-xl border-white/5 bg-white/10 h-11 font-bold focus:ring-0 border-none text-white" 
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full rounded-xl border-white/10 bg-white/5 text-white h-11 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900">
                    Change Password
                  </Button>
                </div>
              </div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                Identity verified and protected via encrypted Supabase Auth protocol
              </p>
            </Card>
          </section>
        </div>

        {/* 3. SYSTEM METADATA (RIGHT - 30%) */}
        <div className="md:col-span-4 space-y-8 h-fit sticky top-20">
          
          {/* SUBSCRIPTION STATUS */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 p-10 text-white relative overflow-hidden">
            <Sparkles className="absolute -right-6 -top-6 h-32 w-32 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Account Tier</p>
                <h3 className="text-3xl font-black tracking-tighter italic">Standard <span className="not-italic text-slate-500 font-light text-2xl">Merchant.</span></h3>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Status</span><span className="text-emerald-400 font-black">Verified</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Member Since</span><span className="text-white">NOV 2024</span>
                </div>
              </div>
              <Button className="w-full bg-white text-slate-900 rounded-xl h-11 text-[10px] font-black tracking-widest hover:bg-slate-100 uppercase mt-4">Support Hub</Button>
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
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase">Session identity is <span className="text-emerald-600 font-black">Active</span>. Authenticated via OAuth 2.0.</p>
          </div>
        </div>

      </div>
    </div>
  )
}