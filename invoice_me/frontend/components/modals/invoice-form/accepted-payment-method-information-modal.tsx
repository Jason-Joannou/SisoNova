import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcceptedPaymentMethods } from "@/lib/enums/invoicing";
import { PaymentMethodInfo } from "@/lib/types/payment-information";
import { InvoiceAcceptedPaymentMethods } from "@/lib/types/invoicing";

interface AcceptedPaymentMethodInformationModalProps {
  children: React.ReactNode; // The trigger element (payment method card)
  paymentMethod: AcceptedPaymentMethods;
  initialData: PaymentMethodInfo;
  componentConfig: InvoiceAcceptedPaymentMethods;
  updateComponentConfig: (updatedConfig: InvoiceAcceptedPaymentMethods) => void;
}

const getFieldsForPaymentMethod = (method: AcceptedPaymentMethods) => {
  switch (method) {
    case AcceptedPaymentMethods.EFT:
      return [
        {
          name: "bank_name",
          label: "Bank Name",
          type: "text",
          required: true,
          placeholder: "e.g., First National Bank",
        },
        {
          name: "account_holder",
          label: "Account Holder Name",
          type: "text",
          required: true,
          placeholder: "e.g., Your Company Name",
        },
        {
          name: "account_number",
          label: "Account Number",
          type: "text",
          required: true,
          placeholder: "e.g., 1234567890",
        },
        {
          name: "branch_code",
          label: "Branch Code",
          type: "text",
          required: true,
          placeholder: "e.g., 250655",
        },
        {
          name: "swift_code",
          label: "SWIFT Code (Optional)",
          type: "text",
          required: false,
          placeholder: "e.g., FIRNZAJJ",
        },
      ];
    case AcceptedPaymentMethods.INSTANT_EFT:
      return [
        {
          name: "bank_name",
          label: "Bank Name",
          type: "text",
          required: true,
          placeholder: "e.g., First National Bank",
        },
        {
          name: "account_holder",
          label: "Account Holder Name",
          type: "text",
          required: true,
          placeholder: "e.g., Your Company Name",
        },
        {
          name: "account_number",
          label: "Account Number",
          type: "text",
          required: true,
          placeholder: "e.g., 1234567890",
        },
        {
          name: "branch_code",
          label: "Branch Code",
          type: "text",
          required: true,
          placeholder: "e.g., 250655",
        },
      ];
    case AcceptedPaymentMethods.SNAPSCAN:
      return [
        {
          name: "merchant_id",
          label: "Merchant ID",
          type: "text",
          required: true,
          placeholder: "Your SnapScan merchant ID",
        },
        {
          name: "store_id",
          label: "Store ID (Optional)",
          type: "text",
          required: false,
          placeholder: "Your store identifier",
        },
        {
          name: "qr_code_url",
          label: "QR Code URL (Optional)",
          type: "text",
          required: false,
          placeholder: "https://...",
        },
      ];
    case AcceptedPaymentMethods.ZAPPER:
      return [
        {
          name: "merchant_id",
          label: "Merchant ID",
          type: "text",
          required: true,
          placeholder: "Your Zapper merchant ID",
        },
        {
          name: "store_id",
          label: "Store ID (Optional)",
          type: "text",
          required: false,
          placeholder: "Your store identifier",
        },
        {
          name: "qr_code_url",
          label: "QR Code URL (Optional)",
          type: "text",
          required: false,
          placeholder: "https://...",
        },
      ];
    case AcceptedPaymentMethods.PAYSHAP:
      return [
        {
          name: "payshap_id",
          label: "PayShap ID",
          type: "text",
          required: true,
          placeholder: "Your PayShap ID",
        },
        {
          name: "reference_prefix",
          label: "Reference Prefix (Optional)",
          type: "text",
          required: false,
          placeholder: "e.g., INV",
        },
      ];
    case AcceptedPaymentMethods.CARD_PAYMENTS:
      return [
        {
          name: "merchant_id",
          label: "Merchant ID",
          type: "text",
          required: true,
          placeholder: "Your card payment merchant ID",
        },
      ];
    case AcceptedPaymentMethods.MOBILE_MONEY:
      return [
        {
          name: "provider",
          label: "Provider",
          type: "select",
          required: true,
          options: [
            "MTN Mobile Money",
            "Vodacom M-Pesa",
            "Airtel Money",
            "Other",
          ],
        },
        {
          name: "merchant_code",
          label: "Merchant Code",
          type: "text",
          required: true,
          placeholder: "Your merchant code",
        },
      ];
    case AcceptedPaymentMethods.CASH:
      return []; // No fields needed for cash
    default:
      return [];
  }
};

const getPaymentMethodTitle = (method: AcceptedPaymentMethods) => {
  const titles = {
    [AcceptedPaymentMethods.EFT]: "Configure EFT Payment",
    [AcceptedPaymentMethods.INSTANT_EFT]: "Configure Instant EFT Payment",
    [AcceptedPaymentMethods.SNAPSCAN]: "Configure SnapScan Payment",
    [AcceptedPaymentMethods.ZAPPER]: "Configure Zapper Payment",
    [AcceptedPaymentMethods.PAYSHAP]: "Configure PayShap Payment",
    [AcceptedPaymentMethods.CARD_PAYMENTS]: "Configure Card Payments",
    [AcceptedPaymentMethods.MOBILE_MONEY]: "Configure Mobile Money",
    [AcceptedPaymentMethods.CASH]: "Cash Payment Configuration",
  };
  return titles[method] || "Configure Payment Method";
};

const getPaymentMethodDescription = (method: AcceptedPaymentMethods) => {
  const descriptions = {
    [AcceptedPaymentMethods.EFT]:
      "Enter your bank account details for Electronic Funds Transfer payments.",
    [AcceptedPaymentMethods.INSTANT_EFT]:
      "Enter your bank account details for Instant EFT payments.",
    [AcceptedPaymentMethods.SNAPSCAN]:
      "Enter your SnapScan merchant details for QR code payments.",
    [AcceptedPaymentMethods.ZAPPER]:
      "Enter your Zapper merchant details for QR code payments.",
    [AcceptedPaymentMethods.PAYSHAP]:
      "Enter your PayShap details for mobile payments.",
    [AcceptedPaymentMethods.CARD_PAYMENTS]:
      "Enter your merchant details for credit/debit card payments.",
    [AcceptedPaymentMethods.MOBILE_MONEY]:
      "Enter your mobile money provider details.",
    [AcceptedPaymentMethods.CASH]:
      "Cash payments require no additional configuration.",
  };
  return descriptions[method] || "Configure your payment method details.";
};

export function AcceptedPaymentMethodInformationModal({
  children,
  paymentMethod,
  initialData,
  componentConfig,
  updateComponentConfig
}: AcceptedPaymentMethodInformationModalProps) {
  const [formData, setFormData] = useState<PaymentMethodInfo>(initialData);
  const [open, setOpen] = useState(false);

  const fields = getFieldsForPaymentMethod(paymentMethod);
  const title = getPaymentMethodTitle(paymentMethod);
  const description = getPaymentMethodDescription(paymentMethod);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, open]);

  const onSave = (data: PaymentMethodInfo) => {
    console.log('Saved data:', data);
    const updatedPaymentInfo = {
    ...data,
    information_present: true,
    enabled: true // Also ensure it's enabled when configured
  };
  const updatedConfig = {
    ...componentConfig,
    payments_method_information: componentConfig.payments_method_information.map(info =>
      info.payment_method === data.payment_method
        ? { ...info, payment_method_info: updatedPaymentInfo }
        : info
    )
  };
  updateComponentConfig(updatedConfig);
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const requiredFields = fields.filter(field => field.required);
    const isValid = requiredFields.every(field => {
      const value = (formData as any)[field.name];
      return value && value.toString().trim() !== '';
    });

    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Mark as configured and save
    const updatedData = {
      ...formData,
      enabled: true,
      information_present: true
    };

    onSave(updatedData);
    setOpen(false);
  };

  const renderField = (field: any) => {
    const value = (formData as any)[field.name] || '';

    if (field.type === 'select') {
      return (
        <div key={field.name} className="grid gap-3">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select
            value={value}
            onValueChange={(newValue) => handleFieldChange(field.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={field.name} className="grid gap-3">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={field.name}
          type={field.type}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  This payment method requires no additional configuration.
                </p>
              </div>
            ) : (
              fields.map(renderField)
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Configuration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
