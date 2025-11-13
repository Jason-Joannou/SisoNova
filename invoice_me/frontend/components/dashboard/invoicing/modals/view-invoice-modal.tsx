import { InvoiceConfiguration } from "@/lib/types/invoicing";
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
import { useState } from "react";
import { Eye } from "lucide-react";
import { InvoiceTemplate } from "@/components/invoice-form/invoice-template";
import { Button } from "@/components/ui/button";

interface InvoicePreviewModalProps {
  invoiceNumber: string;
  companyName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewInvoiceModal(props: InvoicePreviewModalProps) {
  // Ideally, we would fetch the invoice using the invoiceNumber and company name
  // For now, we just use a dummy configuration
  const [open, setOpen] = useState(false);
  const config: InvoiceConfiguration = {
    invoice_number: props.invoiceNumber,
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 7 days from now
    currency: "ZAR",
    include_vat: true,
    vat_rate: 15,
    business_profile: {
      company_name: props.companyName,
      address_line_1: "123 Business St, City, Country",
      email: "billing@SisoNova.co.za",
      city: "Johannesburg",
      province: "Gauteng",
      postal_code: "2000",
      phone: "+27 21 123 4567",
      industry: "Technology",
    },
    client_details: {
      company_name: "Client Company",
      contact_person: "John Doe",
      email: "billing@SisoNova.co.za",
      phone: "+27 21 123 4567",
      credit_limit_enabled: false,
    },
    items: [
      {
        id: "item-1",
        title: "Service A",
        description: "Description for Service A",
        quantity: 1,
        unit_price: 100,
        discount_percentage: 10,
        unit: "hours",
      },
      {
        id: "item-2",
        title: "Service B",
        description: "Description for Service B",
        quantity: 1,
        unit_price: 100,
        discount_percentage: 10,
        unit: "hours",
      },
    ],
  };
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
