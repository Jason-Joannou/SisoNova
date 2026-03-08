"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { InvoiceTemplate } from "@/components/invoice-form/invoice-template";
import { Download, Eye, Zap } from "lucide-react";

interface InvoicePreviewModalProps {
  children: React.ReactNode; 
  config: InvoiceConfiguration;
  onGeneratePDF?: () => void;
}

export function InvoicePreviewModal({
  children,
  config,
  onGeneratePDF
}: InvoicePreviewModalProps) {
  const [open, setOpen] = useState(false);

  const handleGeneratePDF = () => {
    setOpen(false);
    if (onGeneratePDF) {
      onGeneratePDF();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 overflow-hidden rounded-[2rem] border-none bg-white shadow-2xl">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 fill-slate-900" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Review</span>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter italic">
            Invoice <span className="text-slate-400 not-italic font-light">Preview.</span>
          </DialogTitle>
        </div>
        
        {/* SCROLLABLE BODY - Matches your 70vh logic */}
        <div className="overflow-y-auto max-h-[65vh] p-8 bg-slate-50/50">
          <InvoiceTemplate 
            config={config} 
            className="shadow-xl border border-slate-200 rounded-sm" 
          />
        </div>
        
        {/* FOOTER - Explicitly defined as a standard div for visibility */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end items-center gap-3">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              type="button" 
              className="rounded-xl h-10 px-6 text-[10px] font-black tracking-widest uppercase border-slate-200 text-slate-400 hover:text-slate-900"
            >
              Close
            </Button>
          </DialogClose>
          
          {onGeneratePDF && (
            <Button 
              onClick={handleGeneratePDF}
              className="bg-slate-900 hover:bg-black text-white rounded-xl h-10 px-8 text-[10px] font-black tracking-widest shadow-lg uppercase flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              Generate PDF
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}