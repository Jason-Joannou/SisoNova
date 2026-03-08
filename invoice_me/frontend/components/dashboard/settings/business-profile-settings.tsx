"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'
import { 
  ShieldCheck, 
  Save, 
  Sparkles,
  Zap
} from "lucide-react"
import { useAppUser } from "@/lib/use-app-user"
import { BusinessProfile } from "@/lib/types/invoicing"
import { Separator } from "@/components/ui/separator"

const INDUSTRY_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "legal", label: "Legal" },
  { value: "technology", label: "Technology" },
  { value: "butchery", label: "Butchery" },
  { value: "energy", label: "Energy" },
  { value: "consulting", label: "Consulting" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction" },
  { value: "other", label: "Other" },
];

export default function BusinessProfileSettings() {
  const { appUser } = useAppUser();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    company_name: appUser?.business_profile?.company_name || "",
    trading_name: appUser?.business_profile?.trading_name || "",
    industry_type: appUser?.business_profile?.industry_type || "",
    contact_email: appUser?.business_profile?.contact_email || "",
    contact_phone: appUser?.business_profile?.contact_phone || "",
    address_line_1: appUser?.business_profile?.address_line_1 || "",
    address_line_2: appUser?.business_profile?.address_line_2 || "",
    city: appUser?.business_profile?.city || "",
    province: appUser?.business_profile?.province || "",
    postal_code: appUser?.business_profile?.postal_code || "",
    country: appUser?.business_profile?.country || "South Africa",
    company_registration: appUser?.business_profile?.company_registration || "",
    tax_registration: appUser?.business_profile?.tax_registration || "",
    vat_number: appUser?.business_profile?.vat_number || "",
  });

  const handleInputChange = (field: keyof BusinessProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    console.log("Saving Merchant Identity:", formData);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Merchant <span className="text-slate-400 not-italic font-light">Identity.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">
            Legal & Operational Configuration
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-900 text-white rounded-xl px-8 h-11 text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase"
        >
          <Save className="h-3.5 w-3.5 mr-2" /> {loading ? "Syncing..." : "Commit Profile Changes"}
        </Button>
      </header>

      <div className="grid md:grid-cols-12 gap-10">
        
        <div className="md:col-span-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-white space-y-10">
            
            {/* BRANDING GROUP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Entity Name</Label>
                <Input value={formData.company_name} onChange={(e) => handleInputChange("company_name", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Trading Name (DBA)</Label>
                <Input value={formData.trading_name} onChange={(e) => handleInputChange("trading_name", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Industry Classification</Label>
                <Select value={formData.industry_type} onValueChange={(v) => handleInputChange("industry_type", v)}>
                  <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold text-[10px] uppercase">
                    <SelectValue placeholder="Categorize Merchant" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {INDUSTRY_TYPES.map((i) => (
                      <SelectItem key={i.value} value={i.value} className="text-[10px] font-bold uppercase">{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-slate-50" />

            {/* CONTACT & NEXUS GROUP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Billing Email</Label>
                <Input type="email" value={formData.contact_email} onChange={(e) => handleInputChange("contact_email", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Phone</Label>
                <Input type="tel" value={formData.contact_phone} onChange={(e) => handleInputChange("contact_phone", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Address Line 1</Label>
                <Input value={formData.address_line_1} onChange={(e) => handleInputChange("address_line_1", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Suite / Unit (Line 2)</Label>
                <Input value={formData.address_line_2} onChange={(e) => handleInputChange("address_line_2", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">City</Label>
                <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Province</Label>
                <RegionDropdown country={formData.country || "South Africa"} value={formData.province || ""} onChange={(v) => handleInputChange("province", v)} className="flex h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-slate-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Postal Code</Label>
                <Input value={formData.postal_code} onChange={(e) => handleInputChange("postal_code", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold" />
              </div>
            </div>

            <Separator className="bg-slate-50" />

            {/* COMPLIANCE GROUP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Company Reg (CIPC)</Label>
                <Input value={formData.company_registration} onChange={(e) => handleInputChange("company_registration", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Tax Reference (SARS)</Label>
                <Input value={formData.tax_registration} onChange={(e) => handleInputChange("tax_registration", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">VAT Identification Number</Label>
                <Input value={formData.vat_number} onChange={(e) => handleInputChange("vat_number", e.target.value)} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 font-bold focus:border-slate-900" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
               <ShieldCheck className="h-4 w-4 text-slate-900" />
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Merchant Identity Vault</p>
            </div>
          </Card>
        </div>

        {/* 3. PERSISTENT STATUS (RIGHT) */}
        <aside className="md:col-span-4 space-y-8 h-fit sticky top-20">
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 p-10 text-white relative overflow-hidden">
            <Sparkles className="absolute -right-6 -top-6 h-32 w-32 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Account Tier</p>
                <h3 className="text-3xl font-black tracking-tighter italic">Standard <span className="not-italic text-slate-500 font-light text-2xl">Merchant.</span></h3>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Next Billing</span><span className="text-white">01 APR 2026</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Limit Usage</span><span className="text-white italic">85% Capacity</span>
                </div>
              </div>
              <Button className="w-full bg-white text-slate-900 rounded-xl h-11 text-[10px] font-black tracking-widest hover:bg-slate-100 uppercase mt-4">Upgrade Plan</Button>
            </div>
          </Card>

          <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                   <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Security Protocol</p>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase">Two-factor identity is <span className="text-emerald-600 font-black">Active</span>. Verified via Supabase Auth Protocol.</p>
          </div>
        </aside>

      </div>
    </div>
  )
}