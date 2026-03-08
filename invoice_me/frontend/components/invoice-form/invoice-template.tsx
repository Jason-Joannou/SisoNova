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
      className={`bg-white p-12 max-w-4xl mx-auto font-sans text-slate-900 ${className}`}
      id="invoice-template"
    >
      {/* 1. HEADER SECTION */}
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-10">
        <div>
          <h1 className="text-6xl font-black tracking-tighter italic text-slate-900 mb-4 uppercase">INVOICE</h1>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            {config.business_profile.company_name}
          </h2>
          {config.business_profile.trading_name && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Trading as: {config.business_profile.trading_name}
            </p>
          )}
        </div>
        <div className="text-right space-y-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[240px]">
            <div className="space-y-2 text-right">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Invoice #</span>
                <span className="font-mono text-sm font-bold text-slate-900">{config.invoice_number}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Issued</span>
                <span className="text-xs font-bold text-slate-900">{new Date(config.invoice_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-slate-200 pt-2 mt-2">
                <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em]">Due Date</span>
                <span className="text-xs font-black text-rose-500">{new Date(config.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADDRESSES */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        {/* Bill From */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">BILL FROM</h3>
          <div className="text-xs leading-relaxed font-medium text-slate-600 space-y-1">
            <p className="font-black text-slate-900 uppercase text-sm mb-1">
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
            <div className="pt-3 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Email: <span className="text-slate-900">{config.business_profile.contact_email}</span></p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Phone: <span className="text-slate-900">{config.business_profile?.contact_phone || ""}</span></p>
                {config.business_profile.vat_number && (
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight mt-1">VAT #: {config.business_profile.vat_number}</p>
                )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">BILL TO</h3>
          <div className="text-xs leading-relaxed font-medium text-slate-600 space-y-1">
            <p className="font-black text-slate-900 uppercase text-sm mb-1">
              {config.client_details.company_name}
            </p>
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
            <div className="pt-3 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Email: <span className="text-slate-900">{config.client_details.contact_email}</span></p>
                {config.client_details.contact_phone && (
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Phone: <span className="text-slate-900">{config.client_details.contact_phone}</span></p>
                )}
                {config.client_details.vat_number && (
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight mt-1">VAT #: {config.client_details.vat_number}</p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ITEMS TABLE */}
      <div className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Description</th>
              <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">Qty</th>
              <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">Unit</th>
              <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-32">Rate</th>
              <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {config.items.map((item, index) => {
              const lineTotal =
                item.quantity *
                item.unit_price *
                (1 - item.discount_percentage / 100);
              return (
                <tr key={item.id} className="group">
                  <td className="py-6 pr-4">
                    <p className="font-black text-sm uppercase tracking-tight text-slate-900">{item.title}</p>
                    {item.description && (
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {item.sku && (
                      <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">
                        SKU: {item.sku}
                      </p>
                    )}
                  </td>
                  <td className="py-6 text-center text-xs font-bold text-slate-500">
                    {item.quantity}
                  </td>
                  <td className="py-6 text-center text-[10px] font-black uppercase text-slate-400">
                    {item.unit}
                  </td>
                  <td className="py-6 text-right text-xs font-bold text-slate-500">
                    {config.currency}{" "}
                    {item.unit_price.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-6 text-right font-black text-sm text-slate-900">
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

      {/* 4. TOTALS */}
      <div className="flex justify-end mb-12">
        <div className="w-72 space-y-3 pt-6 border-t-2 border-slate-900 px-1">
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
            <span className="font-black text-slate-900">
              {config.currency} {subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {config.include_vat && (
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-slate-400 uppercase tracking-widest">
                VAT ({(config.vat_rate * 100).toFixed(0)}%)
              </span>
              <span className="font-black text-slate-900">
                {config.currency} {vatAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* TOTAL DUE - CLEAN & ALIGNED */}
          <div className="flex justify-between pt-3 border-t border-slate-100 text-[13px]">
            <span className="font-black uppercase tracking-widest text-slate-900">Total Due</span>
            <span className="font-black italic text-slate-900">
              {config.currency} {total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 5. PROFESSIONAL TERMS & CONDITIONS SECTION */}
      <div className="border-t border-slate-100 pt-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Terms */}
          {config.payment_terms && config.payment_terms.payment_description && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">
                Maturity Schedule
              </h3>
              <div className="space-y-3">
                {config.payment_terms.payment_description.map((term, index) => (
                  <div key={index} className="text-[10px] font-bold text-slate-600 leading-relaxed flex gap-2">
                    <span className="text-slate-400 uppercase tracking-tighter shrink-0">
                      {term.payment_terms_type.replace("_", " ")}:
                    </span>
                    <span>{term.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Early Payment Discounts */}
          {config.early_discount_terms?.early_discount_enabled && (
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-4">
                Settlement Incentives
              </h3>
              <div className="space-y-3">
                {config.early_discount_terms.discount_tiers.map(
                  (tier) => (
                    <div key={tier.id} className="text-[10px] font-bold text-emerald-700 flex gap-2">
                      <span className="uppercase tracking-tighter shrink-0">
                        {tier.discount_percentage}% DISCOUNT:
                      </span>
                      <span>Payment within {tier.discount_days} days</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Late Payment Terms */}
          {config.late_payment_terms?.late_fee_enabled && (
            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
              <h3 className="text-[10px] font-black text-rose-800 uppercase tracking-[0.2em] mb-4">
                Arrears Policy
              </h3>
              <div className="space-y-2 text-[10px] font-bold text-rose-700">
                <div className="flex justify-between">
                  <span className="uppercase opacity-60">Late Penalty:</span>
                  <span>
                    {config.late_payment_terms.late_fee_amount}%{" "}
                    {config.late_payment_terms.late_fee_type}
                  </span>
                </div>
                {config.late_payment_terms.grace_period_days > 0 && (
                  <div className="flex justify-between">
                    <span className="uppercase opacity-60">Grace Period:</span>
                    <span>
                      {config.late_payment_terms.grace_period_days} Days
                    </span>
                  </div>
                )}
                <p className="text-[9px] italic mt-3 opacity-60 border-t border-rose-200/50 pt-2 leading-relaxed">
                  {config.late_payment_terms.late_fee_description}
                </p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {config.notes && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Operational Notes
              </h3>
              <div className="text-[10px] font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                {config.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. PAYMENT METHODS SECTION */}
      {config.accepted_payment_methods &&
        config.accepted_payment_methods.accepted_payment_methods.length > 0 && (
          <div className="border-t border-slate-100 pt-10 mb-10">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8">
              Accepted Settlement Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.accepted_payment_methods.payments_method_information
                .filter((info) => info.payment_method_info?.information_present)
                .map((info, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-[1.5rem] border border-slate-100 bg-white shadow-sm"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 bg-slate-900 rounded-full mr-3"></div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        {info.payment_method_info?.display_name}
                      </h4>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-4 leading-none">
                      {info.payment_method_info?.description}
                    </p>

                    {/* EFT Details */}
                    {info.payment_method_info &&
                      isEFTPayment(info.payment_method_info) && (
                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-bold text-slate-600 space-y-2 border border-slate-100">
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase tracking-tighter">Bank</span>
                            <span className="text-slate-900 uppercase">
                              {info.payment_method_info.bank_name}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase tracking-tighter">Branch</span>
                            <span className="text-slate-900 font-mono uppercase">
                              {info.payment_method_info.branch_code}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase tracking-tighter">Account</span>
                            <span className="font-mono text-slate-900">
                              {info.payment_method_info.account_number}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 uppercase tracking-tighter">Holder</span>
                            <span className="text-slate-900 uppercase">
                              {info.payment_method_info.account_holder}
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Instant EFT Details */}
                    {info.payment_method_info &&
                      isInstantEFTPayment(info.payment_method_info) && (
                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-bold text-slate-600 space-y-2 border border-slate-100">
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase tracking-tighter">Bank</span>
                            <span className="text-slate-900 uppercase">
                              {info.payment_method_info.bank_name}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase tracking-tighter">Account</span>
                            <span className="font-mono text-slate-900">
                              {info.payment_method_info.account_number}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 uppercase tracking-tighter">Holder</span>
                            <span className="text-slate-900 uppercase">
                              {info.payment_method_info.account_holder}
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Card Payment Details */}
                    {info.payment_method_info &&
                      isCardPayment(info.payment_method_info) && (
                        <div className="bg-slate-900 p-4 rounded-xl text-[10px] font-bold text-slate-400">
                          <span className="uppercase tracking-widest text-slate-500">Gateway ID:</span>
                          <div className="font-mono text-white mt-1">
                            {info.payment_method_info.merchant_id}
                          </div>
                          <p className="text-slate-500 mt-2 text-[9px] font-black uppercase tracking-widest">
                            VISA • MASTERCARD • AMEX • PAYSTACK
                          </p>
                        </div>
                      )}

                    {/* SnapScan Details */}
                    {info.payment_method_info &&
                      isSnapScanPayment(info.payment_method_info) && (
                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-bold text-slate-600 space-y-2">
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase">Merchant</span>
                            <span className="font-mono text-slate-900">{info.payment_method_info.merchant_id}</span>
                          </div>
                          <p className="text-slate-400 text-[9px] font-black uppercase mt-2">
                            Secure Settlement via SnapScan Protocol
                          </p>
                        </div>
                      )}

                    {/* Zapper Details */}
                    {info.payment_method_info &&
                      isZapperPayment(info.payment_method_info) && (
                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-bold text-slate-600 space-y-2">
                          <div className="flex justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-slate-400 uppercase">Merchant</span>
                            <span className="font-mono text-slate-900">{info.payment_method_info.merchant_id}</span>
                          </div>
                          <p className="text-slate-400 text-[9px] font-black uppercase mt-2">
                            Scan QR with Zapper for Instant Clearing
                          </p>
                        </div>
                      )}

                    {/* PayShap Details */}
                    {info.payment_method_info &&
                      isPayShapPayment(info.payment_method_info) && (
                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-bold text-slate-600">
                          <span className="text-slate-400 uppercase">PayShap Identifier:</span>
                          <div className="font-mono text-slate-900 mt-1 text-xs">
                            {info.payment_method_info.payshap_id}
                          </div>
                        </div>
                      )}

                    {/* Mobile Money Details */}
                    {info.payment_method_info &&
                      isMobileMoneyPayment(info.payment_method_info) && (
                        <div className="bg-slate-50 p-4 rounded-xl text-[10px] font-bold text-slate-600 space-y-1">
                          <span className="text-slate-400 uppercase">{info.payment_method_info.provider} Code:</span>
                          <div className="font-mono text-slate-900 text-xs">
                            {info.payment_method_info.merchant_code}
                          </div>
                        </div>
                      )}

                    {/* Cash Payment Details */}
                    {info.payment_method_info &&
                      isCashPayment(info.payment_method_info) && (
                        <div className="p-2 flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-slate-900 uppercase">Physical In-Person Clearing Only</span>
                        </div>
                      )}
                  </div>
                ))}
            </div>

            {/* Payment Instructions */}
            <div className="mt-8 p-6 bg-slate-900 rounded-[1.5rem] border border-slate-800 shadow-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Please use reference <span className="text-white font-mono mx-2 underline decoration-white/20 underline-offset-4">{config.invoice_number}</span> for all transfers.
              </p>
            </div>
          </div>
        )}

      {/* 7. FOOTER */}
      <footer className="pt-12 border-t border-slate-100 opacity-40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] font-black uppercase text-slate-900 tracking-tighter">{config.business_profile.company_name}</p>
          <p className="text-[10px] font-black uppercase text-slate-900 tracking-tighter">{config.business_profile.contact_email}</p>
          <p className="text-[10px] font-black uppercase text-slate-900 tracking-tighter">{config.business_profile?.contact_phone || ""}</p>
        </div>
        <div className="border-t border-slate-100 mt-8 pt-8 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">
            Authenticated Document • Generated by SisoNova Platform
          </p>
        </div>
      </footer>
    </div>
  );
};