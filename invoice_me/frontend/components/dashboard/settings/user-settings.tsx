"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ShieldCheck, 
  Save, 
  Mail,
  Smartphone
} from "lucide-react"
import { useAppUser } from "@/lib/use-app-user"
import { useAuth } from "@/lib/auth-context"

export default function UserProfileSettings() {
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
    setTimeout(() => setLoading(false), 800);
  };

  return (
    // Changed max-width to 5xl to provide a much wider, professional canvas
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* 1. EDITORIAL HEADER - Now spans the full width of the container */}
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
          className="bg-slate-900 text-white rounded-xl px-10 h-12 text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase"
        >
          <Save className="h-4 w-4 mr-2" /> {loading ? "Syncing..." : "Save All Changes"}
        </Button>
      </header>

      {/* 2. CONSOLIDATED SETTINGS CONTAINER - Removed Grid, now full width of container */}
      <div className="w-full">
        <Card className="rounded-[3rem] border-none shadow-2xl p-12 lg:p-16 bg-white space-y-12">
          
          {/* PERSONAL DETAILS GROUP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Legal Name</Label>
              <Input 
                value={formData.full_name} 
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">System Username</Label>
              <Input 
                value={formData.username} 
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="@username"
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Primary Email Address</Label>
              <div className="relative">
                <Input 
                  disabled 
                  value={formData.email} 
                  className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-14 text-base font-bold opacity-60 cursor-not-allowed" 
                />
                <Mail className="absolute left-5 top-4.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* SECURITY & ACCESS GROUP - Wider padding and larger inputs */}
          <div className="bg-slate-50/50 p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Contact Phone</Label>
                <div className="relative">
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="rounded-2xl border-slate-200 bg-white h-14 px-14 text-base font-bold focus:border-slate-900 transition-all" 
                  />
                  <Smartphone className="absolute left-5 top-4.5 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full rounded-2xl border-slate-200 bg-white text-slate-900 h-14 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  Change Account Password
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200/60">
               <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                 <ShieldCheck className="h-5 w-5 text-white" />
               </div>
               <div className="space-y-0.5">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Enterprise Trust Protocol</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Identity verified via encrypted Supabase Auth session token</p>
               </div>
            </div>
          </div>

        </Card>
      </div>
    </div>
  )
}