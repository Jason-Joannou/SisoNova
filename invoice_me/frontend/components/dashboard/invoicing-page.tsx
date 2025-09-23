// components/dashboard/invoicing-page.tsx
"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditableInputField } from "../ui/editable-field";
import { Switch } from "@/components/ui/switch";
import {
  BusinessProfile,
  ClientDetails,
  InvoiceItem,
  CreditTerms,
  PaymentConfiguration,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";
import {
  Plus,
  Trash2,
  Eye,
  Download,
  FileText,
  Calculator,
  Building,
  User,
  CreditCard,
  Clock,
  AlertTriangle,
  Percent,
  Phone,
  Mail,
  MessageSquare,
  Zap,
} from "lucide-react";
import { ExpandedBusinessDetailsBlock } from "../invoice-form/expanded-business-details-block";
import { PaymentTermsBlock } from "../invoice-form/payment-terms-block";
import { AcceptedPaymentsBlock } from "../invoice-form/accepted-payments-block";
import { LatePaymentsBlock } from "../invoice-form/late-payments-block";
import { DiscountedPaymentsBlock } from "../invoice-form/discounted-payments-block";
import { NotesBlock } from "../invoice-form/notes-block";
import { InvoiceTemplate } from "../invoice-form/invoice-template";
import { InvoicePreviewModal } from "../modals/invoice-form/invoice-preview-modal";

// Enhanced dummy data (same as before)
const defaultBusinessProfile: BusinessProfile = {
  company_name: "SisoNova Solutions (Pty) Ltd",
  trading_name: "SisoNova",
  address_line_1: "123 Business Park Drive",
  address_line_2: "Suite 456",
  city: "Cape Town",
  province: "Western Cape",
  postal_code: "8001",
  vat_number: "4123456789",
  company_registration: "2023/123456/07",
  email: "billing@SisoNova.co.za",
  phone: "+27 21 123 4567",
  website: "www.SisoNova.co.za",
  industry: "consulting",
};

const defaultClientDetails: ClientDetails = {
  company_name: "Ridgeway Butchery",
  contact_person: "John Smith",
  email: "accounts@ridgewaybutchery.co.za",
  phone: "+27 11 987 6543",
  address_line_1: "789 Main Street",
  city: "Johannesburg",
  province: "Gauteng",
  postal_code: "2000",
  vat_number: "4987654321",
  purchase_order_number: "PO123",
  credit_limit_enabled: false,
};

export function InvoicingPage() {
  const generateInvoiceNumber = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `INV-${year}${month}${day}-001`;
  };

  const [config, setConfig] = useState<InvoiceConfiguration>({
    invoice_number: generateInvoiceNumber(),
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    business_profile: defaultBusinessProfile,
    client_details: defaultClientDetails,
    items: [
      {
        id: "1",
        title: "Professional Services",
        description: "Consulting and advisory services",
        category: "Consulting",
        sku: "CONS-001",
        quantity: 10,
        unit: "hours",
        unit_price: 1500,
        discount_percentage: 0,
      },
    ],
    include_vat: true,
    vat_rate: 0.15,
    currency: "ZAR",
  });

  // Component visibility states
  const [showComponents, setShowComponents] = useState({
    paymentTerms: false,
    paymentMethods: false,
    notes: false,
    lateFees: false,
    earlyDiscount: false,
    clientAddress: false,
    businessDetails: false,
    vatSettings: true, // VAT is common enough to show by default
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate totals (same as before)
  const calculateTotals = () => {
    const subtotal = config.items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unit_price;
      const discountAmount = lineTotal * (item.discount_percentage / 100);
      return sum + (lineTotal - discountAmount);
    }, 0);

    const taxableAmount = subtotal;
    const vatAmount = config.include_vat ? taxableAmount * config.vat_rate : 0;
    const total = taxableAmount + vatAmount;

    return { subtotal, vatAmount, total };
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  // Toggle component visibility
  const toggleComponent = (component: keyof typeof showComponents) => {
    setShowComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  const updateInvoiceConfig = useCallback(
    (section: string, field: string, value: any, index?: string) => {
      switch (section) {
        case "business_profile":
          setConfig((prev: InvoiceConfiguration) => ({
            ...prev,
            business_profile: {
              ...prev.business_profile,
              [field]: value,
            },
          }));
          break;

        case "client_details":
          setConfig((prev: InvoiceConfiguration) => ({
            ...prev,
            client_details: {
              ...prev.client_details,
              [field]: value,
            },
          }));
          break;

        case "invoice_items":
          setConfig((prev: InvoiceConfiguration) => ({
            ...prev,
            items: prev.items.map((item) => {
              if (item.id === index) {
                return {
                  ...item,
                  [field]: value,
                };
              }
              return item;
            }),
          }));

        default:
          setConfig((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      title: "New Item",
      description: "",
      quantity: 1,
      unit: "each",
      unit_price: 0,
      discount_percentage: 0,
    };
    setConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Generate PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      console.log("Generating PDF with config:", config);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Component add buttons
  const AddComponentButtons = () => (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
      <p className="w-full text-sm text-slate-600 mb-2">
        Add optional components to your invoice:
      </p>

      {!showComponents.paymentTerms && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("paymentTerms")}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Clock className="h-4 w-4 mr-2" />
          Payment Terms
        </Button>
      )}

      {!showComponents.paymentMethods && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("paymentMethods")}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Methods
        </Button>
      )}

      {!showComponents.notes && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("notes")}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Notes
        </Button>
      )}

      {!showComponents.lateFees && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toggleComponent("lateFees");
          }}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Late Fees
        </Button>
      )}

      {!showComponents.earlyDiscount && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toggleComponent("earlyDiscount");
          }}
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        >
          <Percent className="h-4 w-4 mr-2" />
          Early Discount
        </Button>
      )}

      {!showComponents.clientAddress && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("clientAddress")}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <Building className="h-4 w-4 mr-2" />
          Client Address
        </Button>
      )}

      {!showComponents.businessDetails && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleComponent("businessDetails")}
          className="text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Business Details
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="h-8 w-8 text-purple-600" />
                Smart Invoice Builder
              </h1>
              <p className="text-slate-600">
                Start with the basics, add what you need
              </p>
            </div>
            <div className="flex gap-2">
              <InvoicePreviewModal config={config} onGeneratePDF={generatePDF}>
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </InvoicePreviewModal>

              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Invoice */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
                <div>
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    INVOICE
                  </h1>
                  <EditableInputField
                    value={config.business_profile.company_name}
                    placeholder="Your Company Name"
                    className="text-lg font-semibold"
                    onEdit={(value) => {
                      updateInvoiceConfig(
                        "business_profile",
                        "company_name",
                        value
                      );
                    }}
                  />
                </div>
                <div className="text-right">
                  <div className="bg-slate-50 p-4 rounded border-l-4 border-blue-600">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Invoice #:</span>
                        <EditableInputField
                          value={config.invoice_number}
                          placeholder="INV-001"
                          className="font-mono"
                          onEdit={(value) => {
                            updateInvoiceConfig("", "invoice_number", value);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Date:</span>
                        <EditableInputField
                          value={config.invoice_date}
                          type="date"
                          onEdit={(value) => {
                            updateInvoiceConfig("", "invoice_date", value);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Due:</span>
                        <EditableInputField
                          value={config.due_date}
                          type="date"
                          onEdit={(value) => {
                            updateInvoiceConfig("", "due_date", value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-8">
                {/* Bill From - Essential */}
                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    BILL FROM
                  </h3>
                  <div className="space-y-2">
                    <EditableInputField
                      value={config.business_profile.company_name}
                      placeholder="Your Company Name"
                      className="font-bold text-base"
                      onEdit={(value) => {
                        updateInvoiceConfig(
                          "business_profile",
                          "company_name",
                          value
                        );
                      }}
                    />
                    {/* Essential Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.business_profile.email}
                          type="email"
                          placeholder="your@email.com"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "business_profile",
                              "email",
                              value
                            );
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.business_profile.phone}
                          placeholder="+27 11 123 4567"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "business_profile",
                              "phone",
                              value
                            );
                          }}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Extended Business Details */}
                    {showComponents.businessDetails && (
                      <ExpandedBusinessDetailsBlock
                        toggleComponent={toggleComponent}
                        businessType="buyer"
                        config={config}
                        updateInvoiceConfig={updateInvoiceConfig}
                      />
                    )}
                  </div>
                </div>

                {/* Bill To - Essential */}
                <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    BILL TO
                  </h3>
                  <div className="space-y-2">
                    <EditableInputField
                      value={config.client_details.company_name}
                      placeholder="Client Company Name"
                      onEdit={(value) => {
                        updateInvoiceConfig(
                          "client_details",
                          "company_name",
                          value
                        );
                      }}
                      className="font-bold text-base"
                    />

                    {/* Essential Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.client_details.email}
                          placeholder="client@email.com"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "client_details",
                              "email",
                              value
                            );
                          }}
                          className="text-sm"
                          type="email"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-slate-500" />
                        <EditableInputField
                          value={config.client_details.phone}
                          placeholder="+27 11 123 4567"
                          className="text-sm"
                          onEdit={(value) => {
                            updateInvoiceConfig(
                              "client_details",
                              "phone",
                              value
                            );
                          }}
                        />
                      </div>
                    </div>

                    {/* Extended Client Details */}
                    {showComponents.clientAddress && (
                      <ExpandedBusinessDetailsBlock
                        toggleComponent={toggleComponent}
                        businessType="seller"
                        config={config}
                        updateInvoiceConfig={updateInvoiceConfig}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table - Essential */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Invoice Items
                  </h3>
                  <Button
                    onClick={addItem}
                    size="sm"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-center p-3 font-medium w-20">Qty</th>
                      <th className="text-center p-3 font-medium w-20">Unit</th>
                      <th className="text-right p-3 font-medium w-32">Rate</th>
                      <th className="text-right p-3 font-medium w-32">
                        Amount
                      </th>
                      <th className="w-12"></th>
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
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-3">
                            <div className="space-y-1">
                              <EditableInputField
                              value={item.title}
                              className="font-medium block w-full"
                              placeholder="Item title"
                              onEdit={(value) => {
                                updateInvoiceConfig(
                                  "invoice_items",
                                  "title",
                                  value,
                                  item.id
                                );
                              }}
                              />
                              <EditableInputField
                              value={item.description}
                              className="text-sm text-slate-600 block w-full"
                              placeholder="Description (optional)"
                              multiline
                              onEdit={(value) => {
                                updateInvoiceConfig(
                                  "invoice_items",
                                  "description",
                                  value,
                                  item.id
                                );
                              }}
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <EditableInputField
                            value={item.quantity}
                            type="number"
                            className="w-16 text-center"
                            onEdit={(value) => {
                              updateInvoiceConfig(
                                "invoice_items",
                                "quantity",
                                value,
                                item.id
                              );
                            }}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <EditableInputField
                            value={item.unit}
                            selectOptions={[
                              "each",
                              "hours",
                              "days",
                              "kg",
                              "m",
                              "m2",]}
                              className="w-16 text-center"
                              onEdit={(value) => {
                                updateInvoiceConfig(
                                  "invoice_items",
                                  "unit",
                                  value,
                                  item.id
                                );
                              }}
                              />
                          </td>
                          <td className="p-3 text-right">
                            R
                            <EditableInputField
                            value={item.unit_price}
                            type="number"
                            className="w-24 text-right"
                            onEdit={(value) => {
                              updateInvoiceConfig(
                                "invoice_items",
                                "unit_price",
                                value,
                                item.id
                              );
                            }}
                            />
                          </td>
                          <td className="p-3 text-right font-medium">
                            R
                            {lineTotal.toLocaleString("en-ZA", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="p-3">
                            {config.items.length > 1 && (
                              <Button
                                onClick={() => removeItem(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals - Essential */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-medium">
                      R
                      {subtotal.toLocaleString("en-ZA", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* VAT Toggle - Common enough to show by default */}
                  {showComponents.vatSettings && (
                    <div className="flex justify-between items-center py-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.include_vat}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              include_vat: checked,
                            }))
                          }
                        />
                        <span className="font-medium">
                          VAT ({(config.vat_rate * 100).toFixed(0)}%):
                        </span>
                      </div>
                      <span className="font-medium">
                        {config.include_vat
                          ? `R${vatAmount.toLocaleString("en-ZA", {
                              minimumFractionDigits: 2,
                            })}`
                          : "R0.00"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded font-bold text-lg">
                    <span>TOTAL:</span>
                    <span>
                      R
                      {total.toLocaleString("en-ZA", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Terms - Optional */}
              {showComponents.paymentTerms && (
                <PaymentTermsBlock
                  config={config}
                  toggleComponent={toggleComponent}
                  updateInvoiceConfig={updateInvoiceConfig}
                />
              )}

              {/* Late Fees - Optional */}
              {showComponents.lateFees && (
                <LatePaymentsBlock
                  config={config}
                  toggleComponent={toggleComponent}
                  updateInvoiceConfig={updateInvoiceConfig}
                />
              )}

              {/* Early Discount - Optional */}
              {showComponents.earlyDiscount && (
                <DiscountedPaymentsBlock
                  config={config}
                  toggleComponent={toggleComponent}
                  updateInvoiceConfig={updateInvoiceConfig}
                />
              )}

              {/* Notes - Optional */}
              {showComponents.notes && (
                <NotesBlock
                  config={config}
                  toggleComponent={toggleComponent}
                  updateInvoiceConfig={updateInvoiceConfig}
                />
              )}

              {/* Payment Methods - Optional */}
              {showComponents.paymentMethods && (
                <AcceptedPaymentsBlock
                  toggleComponent={toggleComponent}
                  updateInvoiceConfig={updateInvoiceConfig}
                  config={config}
                />
              )}

              {/* Add Components Section */}
              <AddComponentButtons />

              {/* Footer */}
              <div className="bg-slate-800 text-white p-4 rounded text-center">
                <p className="text-sm">
                  <strong>{config.business_profile.company_name}</strong> |{" "}
                  {config.business_profile.email} |{" "}
                  {config.business_profile.phone}
                </p>
                <p className="text-xs mt-1">
                  This invoice was generated electronically and is valid without
                  signature.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
