// components/modals/pricing-modal.tsx
import { useState } from "react";
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
import {
  Info,
  Shield,
  Zap,
  Database,
  CreditCard,
  Check,
  Clock,
  BarChart3,
  Download,
  Cloud,
} from "lucide-react";

interface PricingModalProps {
  children: React.ReactNode;
  invoiceTotal: number;
  currency: string;
}

export function PricingModal({
  children,
  invoiceTotal,
  currency,
}: PricingModalProps) {
  // PayStack pricing calculation (2.9% + R1 for local transactions, 3.1% + R1 for international transactions)
  const paystackLocalFee = invoiceTotal * 0.029 + 1;
  const paystackIntlFee = invoiceTotal * 0.031 + 1;
  const amountAfterLocalFee = invoiceTotal - paystackLocalFee;
  const amountAfterIntlFee = invoiceTotal - paystackIntlFee;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-blue-600" />
            Transparent Pricing
          </DialogTitle>
          <DialogDescription>
            We believe in keeping more money in your pocket
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Our Philosophy */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Our Promise
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              <strong>
                SisoNova does not take any money from your invoice payments.
              </strong>
              <br />
              We believe SMEs should receive the full amount their customers
              pay. However, to provide fast, secure digital payments, we use
              Paystack as our payment gateway, and Paystack charges standard
              processing fees.
            </p>
          </div>

          {/* Payment Gateway Costs */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Processing Costs
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-semibold text-gray-700">
                  PayStack Processing Fees
                </span>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      Local Transactions
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      2.9% + R1
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Invoice Total:</span>
                      <span className="font-medium">
                        {currency}{" "}
                        {invoiceTotal.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PayStack Fee:</span>
                      <span className="text-red-600 font-medium">
                        -{currency}{" "}
                        {paystackLocalFee.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span>You Receive:</span>
                      <span className="text-green-600 font-semibold">
                        {currency}{" "}
                        {amountAfterLocalFee.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      International Transactions
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      3.1% + R1
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Invoice Total:</span>
                      <span className="font-medium">
                        {currency}{" "}
                        {invoiceTotal.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PayStack Fee:</span>
                      <span className="text-red-600 font-medium">
                        -{currency}{" "}
                        {paystackIntlFee.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span>You Receive:</span>
                      <span className="text-green-600 font-semibold">
                        {currency}{" "}
                        {amountAfterIntlFee.toLocaleString("en-ZA", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <p className="text-sm text-emerald-800">
                    <strong>Free Option:</strong> EFT and bank transfer payments
                    have no processing fees - you receive 100% of the invoice
                    amount.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SisoNova Pricing Model Explanation */}
          {/* SisoNova Pricing Model Explanation */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="h-4 w-4" />
              How SisoNova Makes Money
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Always Free Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Always Free</h4>
                </div>
                <p className="text-sm text-green-700">
                  Invoice creation, all payment methods, and sending to clients
                  at no cost.
                </p>
              </div>

              {/* Storage Only Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Database className="h-4 w-4 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Storage Only</h4>
                </div>
                <p className="text-sm text-blue-700">
                  We only charge for storing invoice history and advanced
                  business insights.
                </p>
              </div>

              {/* Start Free Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Zap className="h-4 w-4 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-800">Start Free</h4>
                </div>
                <p className="text-sm text-purple-700">
                  50 free invoices to start, upgrade only when you need more
                  features.
                </p>
              </div>
            </div>
          </div>

          {/* Storage-Based Pricing */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Storage & History Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Tier */}
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-green-800">Free</h4>
                    <p className="text-sm text-green-600">50 invoices</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800">R0</div>
                    <div className="text-xs text-green-600">per month</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-green-600" />
                    <span>30-day history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-green-600" />
                    <span>Basic search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-3 w-3 text-green-600" />
                    <span>PDF export</span>
                  </li>
                </ul>
              </div>

              {/* Starter Tier */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-blue-800">Starter</h4>
                    <p className="text-sm text-blue-600">500 invoices</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-800">R29</div>
                    <div className="text-xs text-blue-600">per month</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span>1-year history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 text-blue-600" />
                    <span>Advanced search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-3 w-3 text-blue-600" />
                    <span>CSV/Excel export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-blue-600" />
                    <span>Client payment history</span>
                  </li>
                </ul>
              </div>

              {/* Business Tier */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-purple-800">Business</h4>
                    <p className="text-sm text-purple-600">2,000 invoices</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-800">
                      R79
                    </div>
                    <div className="text-xs text-purple-600">per month</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-purple-600" />
                    <span>3-year history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 text-purple-600" />
                    <span>Business dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-purple-600" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Cloud className="h-3 w-3 text-purple-600" />
                    <span>Auto backup</span>
                  </li>
                </ul>
              </div>

              {/* Pro Tier */}
              <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-orange-800">Pro</h4>
                    <p className="text-sm text-orange-600">Unlimited</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-800">
                      R149
                    </div>
                    <div className="text-xs text-orange-600">per month</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-orange-600" />
                    <span>Lifetime history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-orange-600" />
                    <span>White-label</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-orange-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 text-orange-600" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span>
                  <strong>Storage grows with your business:</strong> Start free,
                  upgrade only when you need more history and advanced features.
                </span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Continue Creating Invoice
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
