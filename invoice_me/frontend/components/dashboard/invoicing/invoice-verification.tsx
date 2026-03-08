"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, 
  Send, 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  History,
  CheckCircle2
} from "lucide-react";
import { InvoiceTemplate } from "@/components/invoice-form/invoice-template";
import { InvoiceConfiguration } from "@/lib/types/invoicing";

interface InvoiceVerificationProps {
  config: InvoiceConfiguration;
  onBackToBuild: () => void;
  onFinalize: (method: 'download' | 'email' | 'whatsapp') => void;
}

export function InvoiceVerification({ config, onBackToBuild, onFinalize }: InvoiceVerificationProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-10">
      
      {/* 1. DISPATCH CONTROLS - Floating "Action Center" */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Document Verified</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready for secure dispatch</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onBackToBuild}
            className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Revise Draft
          </Button>
          
          <Button 
            onClick={() => onFinalize('download')}
            className="bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <Download className="h-3.5 w-3.5 mr-2" /> Download PDF
          </Button>

          <Button 
            onClick={() => onFinalize('email')}
            className="bg-slate-900 text-white hover:bg-black rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-300"
          >
            <Send className="h-3.5 w-3.5 mr-2" /> Dispatch via Email
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* 2. THE FINAL DOCUMENT PREVIEW */}
        <main className="col-span-12 lg:col-span-8">
           <div className="bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden transform scale-[0.98] hover:scale-100 transition-transform duration-500">
              <InvoiceTemplate config={config} />
           </div>
        </main>

        {/* 3. DISPATCH METADATA & QUICK ACTIONS */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Receiver Context</h3>
            
            <div className="space-y-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Primary Recipient</p>
                  <p className="text-sm font-bold truncate">{config.client_details.company_name}</p>
                  <p className="text-[10px] text-slate-400">{config.client_details.email}</p>
               </div>

               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Maturity Date</p>
                  <p className="text-sm font-bold">{new Date(config.due_date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-rose-400 font-black uppercase">Net {Math.ceil((new Date(config.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days</p>
               </div>
            </div>

            <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border border-white/10">
              <Copy className="h-3.5 w-3.5 mr-2" /> Copy Secure Share Link
            </Button>
          </div>

          <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-emerald-600" />
              <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Audit Trail</h3>
            </div>
            <p className="text-[10px] font-bold text-emerald-700/60 uppercase leading-relaxed">
              Finalizing this document will automatically log it into your company ledger and trigger the automated reminder schedule.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}