import {
  InvoiceConfiguration,
  InvoicePaymentTerms,
} from "@/lib/types/invoicing";
import { PaymentTermsType } from "@/lib/enums/invoicing";
export function generateInvoiceNumber(businessName: string): string {
  const bID = businessName.slice(0, 3).toUpperCase();
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const hour = today.getHours().toString().padStart(2, "0");
  const minute = today.getMinutes().toString().padStart(2, "0");
  return `${bID}-${year}${month}${day}-${hour}${minute}`;
}

export function calculateTotals(config: InvoiceConfiguration): {
  subtotal: number;
  vatAmount: number;
  total: number;
} {
  const subtotal = config.items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unit_price;
    const discountAmount = lineTotal * (item.discount_percentage / 100);
    return sum + (lineTotal - discountAmount);
  }, 0);

  const taxableAmount = subtotal;
  const vatAmount = config.include_vat ? taxableAmount * config.vat_rate : 0;
  const total = taxableAmount + vatAmount;
  return { subtotal, vatAmount, total };
}

export function getDefaultDescription(term: PaymentTermsType): string {
  const descriptions = {
    [PaymentTermsType.NET_15]: "Payment due within 15 days of invoice date",
    [PaymentTermsType.NET_30]: "Payment due within 30 days of invoice date",
    [PaymentTermsType.NET_60]: "Payment due within 60 days of invoice date",
    [PaymentTermsType.CASH_ON_DELIVERY]:
      "Payment required upon delivery of goods/services",
    [PaymentTermsType.CASH_IN_ADVANCE]:
      "Full payment required before work begins",
    [PaymentTermsType.CASH_BEFORE_DELIVERY]: "Payment required before delivery",
    [PaymentTermsType.CASH_WITH_ORDER]: "Payment required when order is placed",
    [PaymentTermsType.CUSTOM]: "Your custom payment terms here",
  };
  return descriptions[term] || `Payment terms: ${term}`;
}

export function loadPaymentTerms(
  config: InvoiceConfiguration
): InvoicePaymentTerms {
  if (config?.payment_terms) {
    return config.payment_terms;
  }
  // No payment terms present, create defaults
  const defaultPaymentTerms: InvoicePaymentTerms = {
    payment_terms_type: [PaymentTermsType.NET_30],
    payment_description: [
      {
        payment_terms_type: PaymentTermsType.NET_30,
        description: getDefaultDescription(PaymentTermsType.NET_30),
      },
    ],
    late_fee_enabled: false,
    late_fee_type: "percentage",
    late_fee_amount: 0,
    benefit_enabled: false,
    benefit_type: "percentage",
    benefit_amount: 0,
  };

  return defaultPaymentTerms;
}

export function formatPaymentMethod(method: string): string {
  return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
