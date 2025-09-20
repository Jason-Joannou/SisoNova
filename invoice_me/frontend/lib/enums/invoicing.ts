export enum PaymentTermsType {
  NET_15 = 'net_15',
  NET_30 = 'net_30',
  NET_60 = 'net_60',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CASH_IN_ADVANCE = 'cash_in_advance',
  CASH_BEFORE_DELIVERY = 'cash_before_delivery',
  CASH_WITH_ORDER = 'cash_with_order',
  CUSTOM = 'custom'
}

export enum AcceptedPaymentMethods {
  INSTANT_EFT = 'instant_eft',
  EFT = 'eft',
  PAYSHAP = 'payshap',
  SNAPSCAN = 'snapscan',
  ZAPPER = 'zapper',
  MOBILE_MONEY = 'mobile_money',
  CARD_PAYMENTS = 'card_payments',
  CASH = 'cash'

}