// components/invoice/InvoiceTemplate.tsx
import React from 'react';
import { InvoiceConfiguration } from '@/lib/types/invoicing';

interface InvoiceTemplateProps {
  config: InvoiceConfiguration;
  className?: string;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ config, className = "" }) => {
  // Calculate totals
  const calculateTotals = () => {
    const subtotal = config.items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unit_price;
      const discountAmount = lineTotal * (item.discount_percentage / 100);
      return sum + (lineTotal - discountAmount);
    }, 0);

    const vatAmount = config.include_vat ? subtotal * config.vat_rate : 0;
    const total = subtotal + vatAmount;

    return { subtotal, vatAmount, total };
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} id="invoice-template">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h1>
          <h2 className="text-xl font-semibold text-gray-800">
            {config.business_profile.company_name}
          </h2>
          {config.business_profile.trading_name && (
            <p className="text-gray-600">Trading as: {config.business_profile.trading_name}</p>
          )}
        </div>
        <div className="text-right bg-gray-50 p-4 rounded border-l-4 border-blue-600">
          <div className="space-y-2">
            <div><strong>Invoice #:</strong> {config.invoice_number}</div>
            <div><strong>Date:</strong> {new Date(config.invoice_date).toLocaleDateString()}</div>
            <div><strong>Due Date:</strong> {new Date(config.due_date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bill From */}
        <div>
          <h3 className="font-bold text-blue-600 mb-3 text-lg">BILL FROM</h3>
          <div className="space-y-1">
            <p className="font-semibold">{config.business_profile.company_name}</p>
            <p>{config.business_profile.address_line_1}</p>
            {config.business_profile.address_line_2 && (
              <p>{config.business_profile.address_line_2}</p>
            )}
            <p>{config.business_profile.city}, {config.business_profile.province} {config.business_profile.postal_code}</p>
            <p className="mt-2">
              <strong>Email:</strong> {config.business_profile.email}
            </p>
            <p><strong>Phone:</strong> {config.business_profile.phone}</p>
            {config.business_profile.vat_number && (
              <p><strong>VAT #:</strong> {config.business_profile.vat_number}</p>
            )}
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h3 className="font-bold text-blue-600 mb-3 text-lg">BILL TO</h3>
          <div className="space-y-1">
            <p className="font-semibold">{config.client_details.company_name}</p>
            <p>{config.client_details.contact_person}</p>
            {config.client_details.address_line_1 && (
              <>
                <p>{config.client_details.address_line_1}</p>
                {config.client_details.address_line_2 && (
                  <p>{config.client_details.address_line_2}</p>
                )}
                <p>{config.client_details.city}, {config.client_details.province} {config.client_details.postal_code}</p>
              </>
            )}
            <p className="mt-2">
              <strong>Email:</strong> {config.client_details.email}
            </p>
            {config.client_details.phone && (
              <p><strong>Phone:</strong> {config.client_details.phone}</p>
            )}
            {config.client_details.vat_number && (
              <p><strong>VAT #:</strong> {config.client_details.vat_number}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-center">Unit</th>
              <th className="border border-gray-300 p-3 text-right">Rate</th>
              <th className="border border-gray-300 p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {config.items.map((item, index) => {
              const lineTotal = item.quantity * item.unit_price * (1 - item.discount_percentage / 100);
              return (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-3">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600">{item.description}</div>
                    )}
                    {item.sku && (
                      <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.unit}</td>
                  <td className="border border-gray-300 p-3 text-right">
                    {config.currency} {item.unit_price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="border border-gray-300 p-3 text-right font-medium">
                    {config.currency} {lineTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
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
              <span>{config.currency} {subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            
            {config.include_vat && (
              <div className="flex justify-between py-2">
                <span className="font-medium">VAT ({(config.vat_rate * 100).toFixed(0)}%):</span>
                <span>{config.currency} {vatAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            
            <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded font-bold text-lg">
              <span>TOTAL:</span>
              <span>{config.currency} {total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      {config.payment_terms && config.payment_terms.payment_description && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Payment Terms</h3>
          <div className="space-y-2">
            {config.payment_terms.payment_description.map((term, index) => (
              <p key={index} className="text-sm text-gray-700">
                <strong>{term.payment_terms_type.replace('_', ' ').toUpperCase()}:</strong> {term.description}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {config.accepted_payment_methods && config.accepted_payment_methods.accepted_payment_methods.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.accepted_payment_methods.payments_method_information
              .filter(info => info.payment_method_info?.information_present)
              .map((info, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded border">
                  <h4 className="font-medium text-gray-800">{info.payment_method_info?.display_name}</h4>
                  <p className="text-sm text-gray-600">{info.payment_method_info?.description}</p>
                  
                  {/* EFT Details */}
                  {info.payment_method === 'eft' && info.payment_method_info && 'bank_name' in info.payment_method_info && (
                    <div className="mt-2 text-xs space-y-1">
                      <p><strong>Bank:</strong> {info.payment_method_info.bank_name}</p>
                      <p><strong>Account:</strong> {info.payment_method_info.account_number}</p>
                      <p><strong>Branch:</strong> {info.payment_method_info.branch_code}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Early Discount Terms */}
      {config.early_discount_terms?.early_discount_enabled && (
        <div className="mb-6">
          <h3 className="font-bold text-emerald-600 mb-3">Early Payment Discounts</h3>
          <div className="space-y-2">
            {config.early_discount_terms.discount_tiers.map((tier, index) => (
              <p key={tier.id} className="text-sm text-gray-700">
                Pay within {tier.discount_days} days and receive {tier.discount_percentage}% discount
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Late Payment Terms */}
      {config.late_payment_terms?.late_fee_enabled && (
        <div className="mb-6">
          <h3 className="font-bold text-red-600 mb-3">Late Payment Terms</h3>
          <p className="text-sm text-gray-700">
            {config.late_payment_terms.late_fee_description}
          </p>
          <p className="text-sm text-gray-700">
            Late fee: {config.late_payment_terms.late_fee_amount}% 
            {config.late_payment_terms.grace_period_days > 0 && 
              ` (applied ${config.late_payment_terms.grace_period_days} days after due date)`
            }
          </p>
        </div>
      )}

      {/* Notes */}
      {config.notes && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Additional Notes</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{config.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-800 text-white p-4 rounded text-center mt-8">
        <p className="text-sm">
          <strong>{config.business_profile.company_name}</strong> | {config.business_profile.email} | {config.business_profile.phone}
        </p>
        <p className="text-xs mt-1">
          This invoice was generated electronically and is valid without signature.
        </p>
      </div>
    </div>
  );
};