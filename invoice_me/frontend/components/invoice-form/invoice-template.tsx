// components/invoice/InvoiceTemplate.tsx
import React from "react";
import { InvoiceConfiguration } from "@/lib/types/invoicing";
import { AcceptedPaymentMethods } from "@/lib/enums/invoicing";
import {
  PaymentMethodInfo,
  EFTPaymentInfo,
  InstantEFTPaymentInfo,
  SnapScanPaymentInfo,
  ZapperPaymentInfo,
  PayShapPaymentInfo,
  CardPaymentInfo,
  MobileMoneyPaymentInfo,
  CashPaymentInfo,
} from "@/lib/types/payment-information";
import {
  calculateTotals,
  isZapperPayment,
  isSnapScanPayment,
  isPayShapPayment,
  isMobileMoneyPayment,
  isInstantEFTPayment,
  isEFTPayment,
  isCashPayment,
  isCardPayment,
} from "@/lib/utility/invoicing/utils";

interface InvoiceTemplateProps {
  config: InvoiceConfiguration;
  className?: string;
}
export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  config,
  className = "",
}) => {
  // Calculate totals
  const { subtotal, vatAmount, total } = calculateTotals(config);

  return (
    <div
      className={`bg-white p-8 max-w-4xl mx-auto ${className}`}
      id="invoice-template"
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h1>
          <h2 className="text-xl font-semibold text-gray-800">
            {config.business_profile.company_name}
          </h2>
          {config.business_profile.trading_name && (
            <p className="text-gray-600">
              Trading as: {config.business_profile.trading_name}
            </p>
          )}
        </div>
        <div className="text-right bg-gray-50 p-4 rounded border-l-4 border-blue-600">
          <div className="space-y-2">
            <div>
              <strong>Invoice #:</strong> {config.invoice_number}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(config.invoice_date).toLocaleDateString()}
            </div>
            <div>
              <strong>Due Date:</strong>{" "}
              {new Date(config.due_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bill From */}
        <div>
          <h3 className="font-bold text-blue-600 mb-3 text-lg">BILL FROM</h3>
          <div className="space-y-1">
            <p className="font-semibold">
              {config.business_profile.company_name}
            </p>
            <p>{config.business_profile.address_line_1}</p>
            {config.business_profile.address_line_2 && (
              <p>{config.business_profile.address_line_2}</p>
            )}
            <p>
              {config.business_profile.city}, {config.business_profile.province}{" "}
              {config.business_profile.postal_code}
            </p>
            <p className="mt-2">
              <strong>Email:</strong> {config.business_profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {config.business_profile.phone}
            </p>
            {config.business_profile.vat_number && (
              <p>
                <strong>VAT #:</strong> {config.business_profile.vat_number}
              </p>
            )}
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h3 className="font-bold text-blue-600 mb-3 text-lg">BILL TO</h3>
          <div className="space-y-1">
            <p className="font-semibold">
              {config.client_details.company_name}
            </p>
            <p>{config.client_details.contact_person}</p>
            {config.client_details.address_line_1 && (
              <>
                <p>{config.client_details.address_line_1}</p>
                {config.client_details.address_line_2 && (
                  <p>{config.client_details.address_line_2}</p>
                )}
                <p>
                  {config.client_details.city}, {config.client_details.province}{" "}
                  {config.client_details.postal_code}
                </p>
              </>
            )}
            <p className="mt-2">
              <strong>Email:</strong> {config.client_details.email}
            </p>
            {config.client_details.phone && (
              <p>
                <strong>Phone:</strong> {config.client_details.phone}
              </p>
            )}
            {config.client_details.vat_number && (
              <p>
                <strong>VAT #:</strong> {config.client_details.vat_number}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 p-3 text-left">
                Description
              </th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-center">Unit</th>
              <th className="border border-gray-300 p-3 text-right">Rate</th>
              <th className="border border-gray-300 p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {config.items.map((item, index) => {
              const lineTotal =
                item.quantity *
                item.unit_price *
                (1 - item.discount_percentage / 100);
              return (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 p-3">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600">
                        {item.description}
                      </div>
                    )}
                    {item.sku && (
                      <div className="text-xs text-gray-500">
                        SKU: {item.sku}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {item.unit}
                  </td>
                  <td className="border border-gray-300 p-3 text-right">
                    {config.currency}{" "}
                    {item.unit_price.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 p-3 text-right font-medium">
                    {config.currency}{" "}
                    {lineTotal.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>
                {config.currency}{" "}
                {subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {config.include_vat && (
              <div className="flex justify-between py-2">
                <span className="font-medium">
                  VAT ({(config.vat_rate * 100).toFixed(0)}%):
                </span>
                <span>
                  {config.currency}{" "}
                  {vatAmount.toLocaleString("en-ZA", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded font-bold text-lg">
              <span>TOTAL:</span>
              <span>
                {config.currency}{" "}
                {total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Terms & Conditions Section */}
      <div className="border-t-2 border-gray-200 pt-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Terms */}
          {config.payment_terms && config.payment_terms.payment_description && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r">
              <h3 className="font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide">
                Payment Terms
              </h3>
              <div className="space-y-2">
                {config.payment_terms.payment_description.map((term, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-semibold text-blue-700">
                      {term.payment_terms_type.replace("_", " ").toUpperCase()}:
                    </span>
                    <span className="text-gray-700 ml-2">
                      {term.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Early Payment Discounts */}
          {config.early_discount_terms?.early_discount_enabled && (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r">
              <h3 className="font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wide">
                Early Payment Incentives
              </h3>
              <div className="space-y-2">
                {config.early_discount_terms.discount_tiers.map(
                  (tier, index) => (
                    <div key={tier.id} className="text-sm">
                      <span className="font-semibold text-emerald-700">
                        {tier.discount_percentage}% Discount:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Payment within {tier.discount_days} days
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Late Payment Terms */}
          {config.late_payment_terms?.late_fee_enabled && (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r">
              <h3 className="font-bold text-red-800 mb-3 text-sm uppercase tracking-wide">
                Late Payment Policy
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-red-700">Late Fee:</span>
                  <span className="text-gray-700 ml-2">
                    {config.late_payment_terms.late_fee_amount}%{" "}
                    {config.late_payment_terms.late_fee_type}
                  </span>
                </div>
                {config.late_payment_terms.grace_period_days > 0 && (
                  <div>
                    <span className="font-semibold text-red-700">
                      Grace Period:
                    </span>
                    <span className="text-gray-700 ml-2">
                      {config.late_payment_terms.grace_period_days} days after
                      due date
                    </span>
                  </div>
                )}
                <p className="text-gray-600 text-xs italic mt-2">
                  {config.late_payment_terms.late_fee_description}
                </p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {config.notes && (
            <div className="bg-gray-50 border-l-4 border-gray-600 p-4 rounded-r">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                Additional Notes
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {config.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods Section */}
      {config.accepted_payment_methods &&
        config.accepted_payment_methods.accepted_payment_methods.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              Payment Methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.accepted_payment_methods.payments_method_information
                .filter((info) => info.payment_method_info?.information_present)
                .map((info, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {info.payment_method_info?.display_name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {info.payment_method_info?.description}
                    </p>

                    {/* EFT Details */}
                    {info.payment_method_info &&
                      isEFTPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium text-gray-600">
                                Bank:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.bank_name}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">
                                Branch:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.branch_code}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Account:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.account_number}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Account Holder:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.account_holder}
                            </div>
                          </div>
                          {info.payment_method_info.swift_code && (
                            <div>
                              <span className="font-medium text-gray-600">
                                SWIFT:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.swift_code}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Instant EFT Details */}
                    {info.payment_method_info &&
                      isInstantEFTPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium text-gray-600">
                                Bank:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.bank_name}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">
                                Branch:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.branch_code}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Account:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.account_number}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Account Holder:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.account_holder}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Card Payment Details */}
                    {info.payment_method_info &&
                      isCardPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs">
                          <span className="font-medium text-gray-600">
                            Merchant ID:
                          </span>
                          <div className="font-mono text-gray-800">
                            {info.payment_method_info.merchant_id}
                          </div>
                          <p className="text-gray-500 mt-1">
                            Visa, Mastercard, American Express accepted
                          </p>
                        </div>
                      )}

                    {/* SnapScan Details */}
                    {info.payment_method_info &&
                      isSnapScanPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Merchant ID:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.merchant_id}
                            </div>
                          </div>
                          {info.payment_method_info.store_id && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Store ID:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.store_id}
                              </div>
                            </div>
                          )}
                          {info.payment_method_info.qr_code_url && (
                            <div>
                              <span className="font-medium text-gray-600">
                                QR Code:
                              </span>
                              <div className="text-blue-600 text-xs break-all">
                                {info.payment_method_info.qr_code_url}
                              </div>
                            </div>
                          )}
                          <p className="text-gray-500 mt-1">
                            Scan QR code with SnapScan app
                          </p>
                        </div>
                      )}

                    {/* Zapper Details */}
                    {info.payment_method_info &&
                      isZapperPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Merchant ID:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.merchant_id}
                            </div>
                          </div>
                          {info.payment_method_info.store_id && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Store ID:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.store_id}
                              </div>
                            </div>
                          )}
                          {info.payment_method_info.qr_code_url && (
                            <div>
                              <span className="font-medium text-gray-600">
                                QR Code:
                              </span>
                              <div className="text-blue-600 text-xs break-all">
                                {info.payment_method_info.qr_code_url}
                              </div>
                            </div>
                          )}
                          <p className="text-gray-500 mt-1">
                            Scan QR code with Zapper app
                          </p>
                        </div>
                      )}

                    {/* PayShap Details */}
                    {info.payment_method_info &&
                      isPayShapPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              PayShap ID:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.payshap_id}
                            </div>
                          </div>
                          {info.payment_method_info.reference_prefix && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Reference Prefix:
                              </span>
                              <div className="font-mono text-gray-800">
                                {info.payment_method_info.reference_prefix}
                              </div>
                            </div>
                          )}
                          <p className="text-gray-500 mt-1">
                            Use PayShap ID for instant mobile payments
                          </p>
                        </div>
                      )}

                    {/* Mobile Money Details */}
                    {info.payment_method_info &&
                      isMobileMoneyPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Provider:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.provider}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Merchant Code:
                            </span>
                            <div className="font-mono text-gray-800">
                              {info.payment_method_info.merchant_code}
                            </div>
                          </div>
                          <p className="text-gray-500 mt-1">
                            Mobile money transfer via{" "}
                            {info.payment_method_info.provider}
                          </p>
                        </div>
                      )}

                    {/* Cash Payment Details */}
                    {info.payment_method_info &&
                      isCashPayment(info.payment_method_info) && (
                        <div className="bg-gray-50 p-3 rounded text-xs">
                          <div className="flex items-center text-gray-600">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>Payment accepted in person</span>
                          </div>
                          <p className="text-gray-500 mt-1">
                            Cash payments must be made at our business location
                          </p>
                        </div>
                      )}
                  </div>
                ))}
            </div>

            {/* Payment Instructions */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                Please use invoice number{" "}
                <span className="font-mono">{config.invoice_number}</span> as
                your payment reference.
              </p>
            </div>
          </div>
        )}

      {/* Footer */}
      <div className="border-t-2 border-gray-800 bg-gray-800 text-white p-6 rounded-b text-center mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm">
            <strong>{config.business_profile.company_name}</strong>
          </div>
          <div className="text-sm">
            <span>{config.business_profile.email}</span>
          </div>
          <div className="text-sm">
            <span>{config.business_profile.phone}</span>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-4 pt-4">
          <p className="text-xs text-gray-300">
            This invoice was generated electronically and is valid without
            signature.
          </p>
        </div>
      </div>
    </div>
  );
};
