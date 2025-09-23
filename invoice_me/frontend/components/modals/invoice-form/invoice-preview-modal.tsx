// components/modals/InvoicePreviewModal.tsx
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
import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { InvoiceTemplate } from "@/components/invoice-form/invoice-template";
import { Download, Eye } from "lucide-react";

interface InvoicePreviewModalProps {
  children: React.ReactNode; // The trigger element (Preview button)
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Invoice Preview
          </DialogTitle>
          <DialogDescription>
            Review your invoice before generating the PDF
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[70vh] p-1">
          <InvoiceTemplate 
            config={config} 
            className="scale-75 origin-top transform" // Scale down for modal view
          />
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>
          {onGeneratePDF && (
            <Button 
              onClick={handleGeneratePDF}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}