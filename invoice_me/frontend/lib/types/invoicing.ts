import { PaymentTermsType, AcceptedPaymentMethods } from "../enums/invoicing";
import { PaymentMethodInfo } from "./payment-information";
import { CollectionSettings } from "./collections";
export interface Invoice {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'financed';
  service: 'financing' | 'collections' | 'invoicing';
  createdAt: string;
  proofOfWork?: string;
  dedicatedAccount?: string;
  reserveAmount?: number;
}

export interface InvoiceItem {
  id: string
  title: string
  description?: string
  category?: string
  sku?: string
  quantity: number
  unit: string
  unit_price: number
  discount_percentage: number
  tax_rate?: number
}

export interface BusinessProfile {
  company_name: string
  trading_name?: string
  address_line_1: string
  address_line_2?: string
  city: string
  province: string
  postal_code: string
  vat_number?: string
  company_registration?: string
  email: string
  phone: string
  website?: string
  logo_url?: string
  industry: string
}

export interface ClientDetails {
  company_name: string
  contact_person: string
  email: string
  phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  province?: string
  postal_code?: string
  vat_number?: string
  purchase_order_number?: string
  credit_limit_enabled: boolean
  credit_limit_amount?: number
}

export interface InvoicePaymentTerms {
  payment_terms_type: PaymentTermsType[]
  payment_description?: {
    payment_terms_type: PaymentTermsType
    description: string
  }[]
  late_fee_enabled: boolean
  late_fee_type: 'percentage' | 'fixed'
  late_fee_amount: number
  benefit_enabled: boolean
  benefit_type: 'percentage' | 'fixed'
  benefit_amount: number
}

export interface InvoiceAcceptedPaymentMethods {
  accepted_payment_methods: AcceptedPaymentMethods[]
  payments_method_information: {
    payment_method: AcceptedPaymentMethods
    payment_method_info?: PaymentMethodInfo
  }[]
}

export interface LatePaymentConfig {
  late_fee_enabled: boolean;
  late_fee_amount: number;
  late_fee_type: "percentage" | "fixed";
  grace_period_days: number;
  compound_interest: boolean;
  late_fee_description: string;
}

export interface DiscountTier {
  id: string;
  discount_percentage: number;
  discount_days: number;
  description: string;
}

export interface EarlyDiscountConfig {
  early_discount_enabled: boolean;
  discount_tiers: DiscountTier[];
}
export interface InvoiceConfigurationSettings {
  enable_collections_service: boolean
  collection_service_settings: CollectionSettings

  
}

export interface InvoiceConfiguration {
  invoice_number: string
  invoice_date: string
  due_date: string
  business_profile: BusinessProfile
  client_details: ClientDetails
  items: InvoiceItem[]
  include_vat: boolean
  vat_rate: number
  payment_terms?: InvoicePaymentTerms
  accepted_payment_methods?: InvoiceAcceptedPaymentMethods
  late_payment_terms?: LatePaymentConfig
  early_discount_terms?: EarlyDiscountConfig
  invoice_settings?: InvoiceConfigurationSettings
  currency: string
  notes?: string
}
