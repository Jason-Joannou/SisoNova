import { PaymentTermsType, AcceptedPaymentMethods } from "../enums/invoicing";
import { PaymentMethodInfo } from "./payment-information";
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

export interface CreditTerms {
  payment_terms_type: 'net_15' | 'net_30' | 'net_60' | 'due_on_receipt' | 'custom'
  custom_payment_terms?: string
  payment_due_days?: number
  late_fee_enabled: boolean
  late_fee_type: 'percentage' | 'fixed'
  late_fee_amount: number
  late_fee_frequency: 'daily' | 'monthly' | 'once'
  early_discount_enabled: boolean
  early_discount_days?: number
  early_discount_percentage?: number
  credit_limit_enabled: boolean
  credit_limit_amount?: number
  dispute_period_days: number
  dispute_contact_email?: string
  dispute_contact_number?: string
  retention_enabled: boolean
  retention_percentage?: number
  retention_period_days?: number
}

export interface PaymentConfiguration {
  bank_name: string
  account_holder: string
  account_number: string
  branch_code: string
  swift_code?: string
  enable_instant_eft: boolean
  enable_payshap: boolean
  enable_snapscan: boolean
  enable_zapper: boolean
  enable_mobile_money: boolean
  enable_bank_transfer: boolean
  enable_card_payments: boolean
  reference_prefix: string
  include_company_code: boolean
  include_date: boolean
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

export interface InvoiceConfiguration {
  invoice_number: string
  invoice_date: string
  due_date: string
  business_profile: BusinessProfile
  client_details: ClientDetails
  items: InvoiceItem[]
  include_vat: boolean
  vat_rate: number
  global_discount_enabled: boolean
  global_discount_percentage: number
  global_discount_amount?: number
  credit_terms: CreditTerms
  payment_config: PaymentConfiguration
  payment_terms?: InvoicePaymentTerms
  accepted_payment_methods?: InvoiceAcceptedPaymentMethods
  currency: string
  notes?: string
  internal_notes?: string
}
