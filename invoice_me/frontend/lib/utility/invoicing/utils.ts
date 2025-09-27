import {
  InvoiceConfiguration,
  InvoicePaymentTerms,
  LatePaymentConfig,
  InvoiceConfigurationSettings,
  EarlyDiscountConfig
} from "@/lib/types/invoicing";
import { CollectionSettings } from "@/lib/types/collections";
import {
  PaymentTermsType,
  AcceptedPaymentMethods,
} from "@/lib/enums/invoicing";
import {
  CardPaymentInfo,
  PaymentMethodInfo,
  InstantEFTPaymentInfo,
  EFTPaymentInfo,
  ZapperPaymentInfo,
  SnapScanPaymentInfo,
  CashPaymentInfo,
  PayShapPaymentInfo,
  MobileMoneyPaymentInfo,
} from "@/lib/types/payment-information";

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

export function loadNotesConfig(config: InvoiceConfiguration): string {
  if (config?.notes) {
    return config.notes;
  }

  // Default configuration
  return "";
}

export function loadLatePaymentConfig(
  config: InvoiceConfiguration
): LatePaymentConfig {
  if (config?.late_payment_terms) {
    return config.late_payment_terms;
  }

  // Default configuration
  return {
    late_fee_enabled: false,
    late_fee_amount: 0,
    late_fee_type: "percentage",
    grace_period_days: 0,
    compound_interest: false,
    late_fee_description: "Late payment fee applied after due date",
  };
}

export function isEFTPayment(info: PaymentMethodInfo): info is EFTPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.EFT;
}

export function isInstantEFTPayment(
  info: PaymentMethodInfo
): info is InstantEFTPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.INSTANT_EFT;
}

export function isSnapScanPayment(
  info: PaymentMethodInfo
): info is SnapScanPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.SNAPSCAN;
}

export function isZapperPayment(
  info: PaymentMethodInfo
): info is ZapperPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.ZAPPER;
}

export function isPayShapPayment(
  info: PaymentMethodInfo
): info is PayShapPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.PAYSHAP;
}

export function isCardPayment(
  info: PaymentMethodInfo
): info is CardPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.CARD_PAYMENTS;
}

export function isMobileMoneyPayment(
  info: PaymentMethodInfo
): info is MobileMoneyPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.MOBILE_MONEY;
}

export function isCashPayment(
  info: PaymentMethodInfo
): info is CashPaymentInfo {
  return info.payment_method === AcceptedPaymentMethods.CASH;
}

export function loadInvoiceConfigurationSettings(
  config: InvoiceConfiguration
): InvoiceConfigurationSettings {
  const enable_collections_service =
    config?.invoice_settings?.enable_collections_service ?? false;
  const collection_service_settings =
    config?.invoice_settings?.collection_service_settings ??
    ({
      enabled: false,
      reminder_schedule: [-7, -3, 0, 3, 7, 14], // Days relative to due date
      whatsapp_enabled: true,
      email_enabled: false,
      sms_enabled: false,
      escalation_enabled: true,
      escalation_days: 30,
    } as CollectionSettings);
  return {
    enable_collections_service: enable_collections_service,
    collection_service_settings: collection_service_settings,
  } as InvoiceConfigurationSettings;
}

export function loadEarlyDiscountConfig(
  config: InvoiceConfiguration
): EarlyDiscountConfig {
  if (config?.early_discount_terms) {
    return config.early_discount_terms;
  }

  // Default configuration with one tier
  return {
    early_discount_enabled: false,
    discount_tiers: [
      {
        id: generateId(),
        discount_percentage: 2,
        discount_days: 10,
        description: "Early payment discount for payment within 10 days",
      },
    ],
  };
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}