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
  Building2,
  Globe,
  Fingerprint
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
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* 1. EDITORIAL HEADER */}
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
          className="bg-slate-900 text-white rounded-xl px-10 h-12 text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase"
        >
          <Save className="h-4 w-4 mr-2" /> {loading ? "Syncing..." : "Save All Changes"}
        </Button>
      </header>

      {/* 2. CONSOLIDATED SETTINGS CONTAINER */}
      <div className="w-full">
        <Card className="rounded-[3rem] border-none shadow-2xl p-12 lg:p-16 bg-white space-y-12">
          
          {/* BRANDING GROUP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Registered Entity Name</Label>
              <Input 
                value={formData.company_name} 
                onChange={(e) => handleInputChange("company_name", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Trading Name (DBA)</Label>
              <Input 
                value={formData.trading_name} 
                onChange={(e) => handleInputChange("trading_name", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Industry Classification</Label>
              <Select value={formData.industry_type} onValueChange={(v) => handleInputChange("industry_type", v)}>
                <SelectTrigger className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all uppercase tracking-wider">
                  <SelectValue placeholder="Categorize Merchant" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  {INDUSTRY_TYPES.map((i) => (
                    <SelectItem key={i.value} value={i.value} className="text-sm font-bold uppercase py-3">{i.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* CONTACT & NEXUS GROUP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Official Billing Email</Label>
              <Input 
                type="email" 
                value={formData.contact_email} 
                onChange={(e) => handleInputChange("contact_email", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Contact Phone</Label>
              <Input 
                type="tel" 
                value={formData.contact_phone} 
                onChange={(e) => handleInputChange("contact_phone", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Street Address Line 1</Label>
              <Input 
                value={formData.address_line_1} 
                onChange={(e) => handleInputChange("address_line_1", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Suite / Unit (Line 2)</Label>
              <Input 
                value={formData.address_line_2} 
                onChange={(e) => handleInputChange("address_line_2", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">City</Label>
              <Input 
                value={formData.city} 
                onChange={(e) => handleInputChange("city", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Province / State</Label>
              <RegionDropdown 
                country={formData.country || "South Africa"} 
                value={formData.province || ""} 
                onChange={(v) => handleInputChange("province", v)} 
                className="flex h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-2 text-sm font-bold uppercase tracking-tight focus:outline-none focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Postal Code</Label>
              <Input 
                value={formData.postal_code} 
                onChange={(e) => handleInputChange("postal_code", e.target.value)} 
                className="rounded-2xl border-slate-100 bg-slate-50/50 h-14 px-6 text-base font-bold focus:border-slate-900 focus:bg-white transition-all" 
              />
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* COMPLIANCE GROUP */}
          <div className="bg-slate-50/50 p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Company Reg (CIPC)</Label>
                <Input 
                  value={formData.company_registration} 
                  onChange={(e) => handleInputChange("company_registration", e.target.value)} 
                  className="rounded-2xl border-slate-200 bg-white h-14 px-6 text-base font-bold focus:border-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Tax Reference (SARS)</Label>
                <Input 
                  value={formData.tax_registration} 
                  onChange={(e) => handleInputChange("tax_registration", e.target.value)} 
                  className="rounded-2xl border-slate-200 bg-white h-14 px-6 text-base font-bold focus:border-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">VAT Identification Number</Label>
                <Input 
                  value={formData.vat_number} 
                  onChange={(e) => handleInputChange("vat_number", e.target.value)} 
                  className="rounded-2xl border-slate-200 bg-white h-14 px-6 text-base font-bold focus:border-slate-900 transition-all" 
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-slate-200/60">
               <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                 <ShieldCheck className="h-5 w-5 text-white" />
               </div>
               <div className="space-y-0.5">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Identity Vault</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Merchant legal credentials secured for automated compliance</p>
               </div>
            </div>
          </div>

        </Card>
      </div>
    </div>
  )
}