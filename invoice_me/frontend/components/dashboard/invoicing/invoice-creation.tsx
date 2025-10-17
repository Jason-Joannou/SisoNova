"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Users,
  FileText,
  Clock,
  Search,
  Save,
  Copy,
  Trash2,
  Edit,
  Building2,
  Mail,
  Phone,
  MapPin,
  Zap,
  History,
  UserPlus,
  Download,
  Eye,
  Info,
} from "lucide-react";
import { InvoiceBuilder } from "./invoice-builder";
import {
  BusinessProfile,
  ClientDetails,
  InvoiceConfiguration,
} from "@/lib/types/invoicing";

// Mock data for saved buyers
const mockSavedBuyers: ClientDetails[] = [
  {
    company_name: "Ridgeway Butchery",
    contact_person: "John Smith",
    email: "accounts@ridgewaybutchery.co.za",
    phone: "+27 11 987 6543",
    address_line_1: "789 Main Street",
    city: "Johannesburg",
    province: "Gauteng",
    postal_code: "2000",
    vat_number: "4987654321",
    credit_limit_enabled: false,
  },
  {
    company_name: "Tech Solutions Ltd",
    contact_person: "Sarah Johnson",
    email: "billing@techsolutions.co.za",
    phone: "+27 21 555 1234",
    address_line_1: "45 Innovation Drive",
    city: "Cape Town",
    province: "Western Cape",
    postal_code: "8001",
    vat_number: "4123456789",
    credit_limit_enabled: true,
    credit_limit_amount: 50000,
  },
  {
    company_name: "Green Energy Co",
    contact_person: "Michael Brown",
    email: "finance@greenenergy.co.za",
    phone: "+27 31 444 5678",
    address_line_1: "12 Solar Street",
    city: "Durban",
    province: "KwaZulu-Natal",
    postal_code: "4001",
    vat_number: "4567891234",
    credit_limit_enabled: false,
  },
];

// Mock data for recent invoices
const mockRecentInvoices = [
  {
    id: "1",
    invoice_number: "INV-2024-001",
    client_name: "Ridgeway Butchery",
    amount: 15750.00,
    date: "2024-10-15",
    status: "paid",
  },
  {
    id: "2",
    invoice_number: "INV-2024-002",
    client_name: "Tech Solutions Ltd",
    amount: 28500.00,
    date: "2024-10-18",
    status: "pending",
  },
  {
    id: "3",
    invoice_number: "INV-2024-003",
    client_name: "Green Energy Co",
    amount: 12300.00,
    date: "2024-10-20",
    status: "overdue",
  },
];

// Mock invoice templates
const mockTemplates = [
  {
    id: "1",
    name: "Consulting Services",
    description: "Standard consulting invoice template",
    items: [
      {
        id: "1",
        title: "Consulting Services",
        description: "Professional consulting and advisory",
        quantity: 1,
        unit: "hours",
        unit_price: 1500,
        discount_percentage: 0,
      },
    ],
  },
  {
    id: "2",
    name: "Monthly Retainer",
    description: "Monthly retainer agreement",
    items: [
      {
        id: "1",
        title: "Monthly Retainer Fee",
        description: "Ongoing support and services",
        quantity: 1,
        unit: "months",
        unit_price: 25000,
        discount_percentage: 0,
      },
    ],
  },
  {
    id: "3",
    name: "Product Sale",
    description: "Standard product invoice",
    items: [
      {
        id: "1",
        title: "Product Item",
        description: "Product description",
        quantity: 1,
        unit: "each",
        unit_price: 0,
        discount_percentage: 0,
      },
    ],
  },
];

export function InvoicingPage() {
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<ClientDetails | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [savedBuyers, setSavedBuyers] = useState(mockSavedBuyers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBuyerOpen, setIsAddBuyerOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState<Partial<ClientDetails>>({
    credit_limit_enabled: false,
  });

  // Filter buyers based on search
  const filteredBuyers = savedBuyers.filter(
    (buyer) =>
      buyer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle buyer selection
  const handleSelectBuyer = (buyer: ClientDetails) => {
    setSelectedBuyer(buyer);
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string | null) => {
    setSelectedTemplate(templateId);
  };

  // Start creating invoice
  const handleStartInvoice = () => {
    if (!selectedBuyer) {
      alert("Please select a buyer first");
      return;
    }
    setShowInvoiceBuilder(true);
  };

  // Add new buyer
  const handleAddBuyer = () => {
    if (!newBuyer.company_name || !newBuyer.email) {
      alert("Please fill in required fields");
      return;
    }
    
    const buyer: ClientDetails = {
      company_name: newBuyer.company_name,
      contact_person: newBuyer.contact_person || "",
      email: newBuyer.email,
      phone: newBuyer.phone,
      address_line_1: newBuyer.address_line_1,
      city: newBuyer.city,
      province: newBuyer.province,
      postal_code: newBuyer.postal_code,
      vat_number: newBuyer.vat_number,
      credit_limit_enabled: newBuyer.credit_limit_enabled || false,
      credit_limit_amount: newBuyer.credit_limit_amount,
    };

    setSavedBuyers([...savedBuyers, buyer]);
    setNewBuyer({ credit_limit_enabled: false });
    setIsAddBuyerOpen(false);
    setSelectedBuyer(buyer);
  };

  // Load invoice from history
  const handleLoadInvoice = (invoiceId: string) => {
    console.log("Loading invoice:", invoiceId);
    // Implement load invoice logic
  };

  // Duplicate invoice
  const handleDuplicateInvoice = (invoiceId: string) => {
    console.log("Duplicating invoice:", invoiceId);
    // Implement duplicate logic
  };

  if (showInvoiceBuilder) {
    return (
      <div>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowInvoiceBuilder(false)}
            className="mb-4"
          >
            ← Back to Setup
          </Button>
        </div>
        <InvoiceBuilder
          initialBuyer={selectedBuyer}
          initialTemplate={selectedTemplate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Zap className="h-8 w-8 text-purple-600" />
              Create New Invoice
            </h1>
            <p className="text-slate-600">
              Select a buyer and template to get started
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${selectedBuyer ? 'text-green-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedBuyer ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {selectedBuyer ? '✓' : '1'}
                  </div>
                  <span className="font-medium">Select Buyer</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200" />
                <div className={`flex items-center gap-2 ${selectedTemplate ? 'text-green-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTemplate ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {selectedTemplate ? '✓' : '2'}
                  </div>
                  <span className="font-medium">Choose Template (Optional)</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200" />
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    3
                  </div>
                  <span className="font-medium">Build Invoice</span>
                </div>
              </div>
              <Button
                onClick={handleStartInvoice}
                disabled={!selectedBuyer}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Start Building →
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Buyer Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buyer Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Select Buyer
                    </CardTitle>
                    <CardDescription>
                      Choose from saved buyers or add a new one
                    </CardDescription>
                  </div>
                  <Dialog open={isAddBuyerOpen} onOpenChange={setIsAddBuyerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New Buyer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Buyer</DialogTitle>
                        <DialogDescription>
                          Enter the buyer's details to save them for future invoices
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="col-span-2">
                          <Label htmlFor="company_name">Company Name *</Label>
                          <Input
                            id="company_name"
                            value={newBuyer.company_name || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, company_name: e.target.value })
                            }
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact_person">Contact Person</Label>
                          <Input
                            id="contact_person"
                            value={newBuyer.contact_person || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, contact_person: e.target.value })
                            }
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newBuyer.email || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, email: e.target.value })
                            }
                            placeholder="email@company.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newBuyer.phone || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, phone: e.target.value })
                            }
                            placeholder="+27 11 123 4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="vat_number">VAT Number</Label>
                          <Input
                            id="vat_number"
                            value={newBuyer.vat_number || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, vat_number: e.target.value })
                            }
                            placeholder="4123456789"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={newBuyer.address_line_1 || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, address_line_1: e.target.value })
                            }
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={newBuyer.city || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, city: e.target.value })
                            }
                            placeholder="Johannesburg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="province">Province</Label>
                          <Input
                            id="province"
                            value={newBuyer.province || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, province: e.target.value })
                            }
                            placeholder="Gauteng"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postal_code">Postal Code</Label>
                          <Input
                            id="postal_code"
                            value={newBuyer.postal_code || ""}
                            onChange={(e) =>
                              setNewBuyer({ ...newBuyer, postal_code: e.target.value })
                            }
                            placeholder="2000"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddBuyerOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddBuyer} className="bg-purple-600">
                          Add Buyer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search buyers by name, email, or contact..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Buyers List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredBuyers.map((buyer) => (
                    <div
                      key={buyer.email}
                      onClick={() => handleSelectBuyer(buyer)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedBuyer?.email === buyer.email
                          ? "border-purple-500 bg-purple-50"
                          : "border-slate-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-slate-500" />
                            <h3 className="font-semibold text-slate-900">
                              {buyer.company_name}
                            </h3>
                            {selectedBuyer?.email === buyer.email && (
                              <Badge className="bg-purple-600">Selected</Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>{buyer.contact_person}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span>{buyer.email}</span>
                            </div>
                            {buyer.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                <span>{buyer.phone}</span>
                              </div>
                            )}
                            {buyer.city && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{buyer.city}, {buyer.province}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {buyer.credit_limit_enabled && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Credit: R{buyer.credit_limit_amount?.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Choose Template (Optional)
                </CardTitle>
                <CardDescription>
                  Start with a pre-configured template or build from scratch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Blank Template */}
                  <div
                    onClick={() => handleSelectTemplate(null)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === null
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <Plus className="h-8 w-8 text-slate-400" />
                      <h3 className="font-semibold">Blank Invoice</h3>
                      <p className="text-xs text-slate-600">
                        Start from scratch
                      </p>
                      {selectedTemplate === null && (
                        <Badge className="bg-green-600">Selected</Badge>
                      )}
                    </div>
                  </div>

                  {/* Saved Templates */}
                  {mockTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <FileText className="h-5 w-5 text-green-600" />
                          {selectedTemplate === template.id && (
                            <Badge className="bg-green-600">Selected</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-xs text-slate-600">
                          {template.description}
                        </p>
                        <p className="text-xs text-slate-500">
                          {template.items.length} item(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Invoices & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleStartInvoice}
                  disabled={!selectedBuyer}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsAddBuyerOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Buyer
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5 text-orange-600" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>
                  Load or duplicate previous invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm font-semibold">
                            {invoice.invoice_number}
                          </p>
                          <p className="text-sm text-slate-600">
                            {invoice.client_name}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : invoice.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-semibold">
                            R{invoice.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">{invoice.date}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadInvoice(invoice.id)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateInvoice(invoice.id)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Save buyers for quick invoice creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Use templates for recurring invoices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Duplicate past invoices to save time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Set credit limits for buyer management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}