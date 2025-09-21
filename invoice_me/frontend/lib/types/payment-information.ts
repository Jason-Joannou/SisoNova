import { AcceptedPaymentMethods } from "../enums/invoicing";

export interface BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods;
  enabled: boolean;
  information_present: boolean;
  display_name?: string;
  description?: string;
}

// Specific payment method interfaces
export interface EFTPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.EFT;
  bank_name: string;
  account_holder: string;
  account_number: string;
  branch_code: string;
  swift_code?: string;
}

export interface InstantEFTPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.INSTANT_EFT;
  bank_name: string;
  account_holder: string;
  account_number: string;
  branch_code: string;
}

export interface SnapScanPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.SNAPSCAN;
  merchant_id: string;
  store_id?: string;
  qr_code_url?: string;
}

export interface PayShapPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.PAYSHAP;
  payshap_id: string;
  reference_prefix?: string;
}

export interface ZapperPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.ZAPPER;
  merchant_id: string;
  store_id?: string;
  qr_code_url?: string;
}

export interface CardPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.CARD_PAYMENTS;
  merchant_id: string;
}

export interface MobileMoneyPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.MOBILE_MONEY;
  provider: string;
  merchant_code: string;
}

export interface CashPaymentInfo extends BasePaymentMethodInfo {
  payment_method: AcceptedPaymentMethods.CASH;
  // No additional fields needed for cash
}

// Union type for all payment methods
export type PaymentMethodInfo = 
  | EFTPaymentInfo 
  | InstantEFTPaymentInfo 
  | SnapScanPaymentInfo 
  | PayShapPaymentInfo 
  | ZapperPaymentInfo 
  | CardPaymentInfo 
  | MobileMoneyPaymentInfo 
  | CashPaymentInfo;
