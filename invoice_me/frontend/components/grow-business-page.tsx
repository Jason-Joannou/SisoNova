// components/dashboard/grow-business-page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  FileText, 
  Building, 
  CreditCard, 
  Target, 
  BookOpen, 
  Users, 
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Download,
  Send,
  AlertCircle,
  Lightbulb,
  Shield,
  Calculator,
  PieChart,
  Award
} from "lucide-react"

// Mock user data (would come from your auth/profile system)
const userData = {
  company_name: "PayFlow Solutions (Pty) Ltd",
  trading_name: "PayFlow",
  address_line_1: "123 Business Park Drive",
  address_line_2: "Suite 456",
  city: "Cape Town",
  province: "Western Cape",
  postal_code: "8001",
  company_registration: "2023/123456/07",
  vat_number: "4123456789",
  industry_type: "consulting",
  email: "jjoannou@bscglobal.com",
  phone_number: "+27 21 123 4567"
}

// Lender application forms
interface LenderForm {
  id: string
  name: string
  logo?: string
  description: string
  requirements: string[]
  typical_rates: string
  max_amount: string
  processing_time: string
  fields: FormField[]
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'radio'
  required: boolean
  options?: string[]
  prefilled?: boolean
  value?: string
}

const lenderForms: LenderForm[] = [
  {
    id: "fnb_debtor_finance",
    name: "FNB Debtor Finance",
    description: "Apply for debtor finance directly with FNB. We'll pre-fill your information to speed up the process.",
    requirements: [
      "Annual Financial Statements",
      "Management Accounts",
      "Debtor's book aging",
      "2+ years trading history"
    ],
    typical_rates: "Prime + 2-5%",
    max_amount: "R50 million",
    processing_time: "5-10 business days",
    fields: [
      { name: "first_name", label: "First Name", type: "text", required: true, prefilled: true, value: "Jason" },
      { name: "surname", label: "Surname", type: "text", required: true, prefilled: true, value: "Joannou" },
      { name: "business_name", label: "Business Name", type: "text", required: true, prefilled: true, value: userData.company_name },
      { name: "business_address", label: "Business Address", type: "textarea", required: true, prefilled: true, value: `${userData.address_line_1}, ${userData.address_line_2}, ${userData.city}, ${userData.province}, ${userData.postal_code}` },
      { name: "company_registration", label: "Company Registration Number", type: "text", required: true, prefilled: true, value: userData.company_registration },
      { name: "business_email", label: "Business Email Address", type: "email", required: true, prefilled: true, value: userData.email },
      { name: "contact_number", label: "Contact Number", type: "tel", required: true, prefilled: true, value: userData.phone_number },
      { name: "contact_person", label: "Contact Person", type: "text", required: true, prefilled: true, value: "Jason Joannou" },
      { name: "business_industry", label: "Business Industry", type: "select", required: true, prefilled: true, value: "consulting", options: ["Retail", "Legal", "Entertainment", "Construction", "Consulting", "Manufacturing", "Other"] },
      { name: "debtors_book_insurance", label: "Do you have debtor's book insurance?", type: "radio", required: true, options: ["Yes", "No"] },
      { name: "current_ageing_debtors", label: "Do you have a current ageing debtors book?", type: "radio", required: true, options: ["Yes", "No"] },
      { name: "nature_of_finance", label: "Nature of finance required", type: "select", required: true, options: ["Invoice Discounting", "Factoring", "Debtor Finance", "Trade Finance"] },
      { name: "monthly_turnover", label: "Monthly Turnover", type: "select", required: true, options: ["R0 - R500k", "R500k - R1m", "R1m - R5m", "R5m - R10m", "R10m+"] },
      { name: "amount_required", label: "Amount Required", type: "select", required: true, options: ["R100k - R500k", "R500k - R1m", "R1m - R5m", "R5m - R10m", "R10m+"] },
      { name: "trading_2_years", label: "Has your business been trading for 2 years or more?", type: "radio", required: true, options: ["Yes", "No"] },
      { name: "annual_financial_statements", label: "Do you have access to your Annual Financial Statements?", type: "radio", required: true, options: ["Yes", "No"] },
      { name: "management_accounts", label: "Do you have access to your latest Management Accounts?", type: "radio", required: true, options: ["Yes", "No"] },
      { name: "client_1", label: "Client name 1 (optional)", type: "text", required: false },
      { name: "client_2", label: "Client name 2 (optional)", type: "text", required: false },
      { name: "client_3", label: "Client name 3 (optional)", type: "text", required: false }
    ]
  },
  {
    id: "standard_bank_business_finance",
    name: "Standard Bank Business Finance",
    description: "Apply for various business finance options with Standard Bank.",
    requirements: [
      "3 months bank statements",
      "Financial statements",
      "Business plan",
      "Proof of residence"
    ],
    typical_rates: "Prime + 1-4%",
    max_amount: "R25 million",
    processing_time: "3-7 business days",
    fields: [
      { name: "business_name", label: "Business Name", type: "text", required: true, prefilled: true, value: userData.company_name },
      { name: "registration_number", label: "Registration Number", type: "text", required: true, prefilled: true, value: userData.company_registration },
      { name: "industry", label: "Industry", type: "select", required: true, prefilled: true, value: "consulting", options: ["Retail", "Legal", "Entertainment", "Construction", "Consulting", "Manufacturing", "Other"] },
      { name: "annual_turnover", label: "Annual Turnover", type: "select", required: true, options: ["R0 - R2m", "R2m - R10m", "R10m - R50m", "R50m+"] },
      { name: "finance_amount", label: "Finance Amount Required", type: "number", required: true },
      { name: "finance_purpose", label: "Purpose of Finance", type: "select", required: true, options: ["Working Capital", "Equipment Finance", "Property Finance", "Debtor Finance", "Other"] }
    ]
  }
]

// Business growth resources
const growthResources = [
  {
    category: "Financial Management",
    icon: Calculator,
    color: "emerald",
    resources: [
      { title: "Cash Flow Forecasting Template", type: "download", description: "Excel template to forecast your cash flow for the next 12 months" },
      { title: "Invoice Management Best Practices", type: "guide", description: "Learn how to reduce payment delays and improve cash flow" },
      { title: "Financial Ratios Calculator", type: "tool", description: "Calculate key financial ratios to understand your business health" }
    ]
  },
  {
    category: "Credit & Financing",
    icon: CreditCard,
    color: "blue",
    resources: [
      { title: "Credit Score Improvement Guide", type: "guide", description: "Steps to improve your business credit score" },
      { title: "Financing Options Comparison", type: "comparison", description: "Compare different financing options available to SMEs" },
      { title: "Lender Requirements Checklist", type: "checklist", description: "What documents and criteria lenders typically require" }
    ]
  },
  {
    category: "Business Growth",
    icon: TrendingUp,
    color: "purple",
    resources: [
      { title: "Market Expansion Strategy Template", type: "template", description: "Plan your expansion into new markets or customer segments" },
      { title: "Customer Retention Strategies", type: "guide", description: "Proven methods to keep your customers coming back" },
      { title: "Pricing Strategy Worksheet", type: "worksheet", description: "Optimize your pricing for maximum profitability" }
    ]
  },
  {
    category: "Compliance & Legal",
    icon: Shield,
    color: "slate",
    resources: [
      { title: "POPIA Compliance Checklist", type: "checklist", description: "Ensure your business complies with data protection laws" },
      { title: "Tax Planning Guide for SMEs", type: "guide", description: "Optimize your tax strategy and stay compliant" },
      { title: "Contract Templates", type: "templates", description: "Standard contract templates for various business needs" }
    ]
  }
]

export function GrowBusinessPage() {
  const [activeTab, setActiveTab] = useState("lenders")
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  // Submit form to lender
  const submitToLender = (lenderId: string) => {
    console.log(`Submitting form to ${lenderId}:`, formData)
    // Here you would integrate with the lender's API or send via email
    alert("Application submitted! The lender will contact you within 2-3 business days.")
  }

  // Get color classes for categories
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'slate': return 'bg-slate-100 text-slate-800 border-slate-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
                Grow Your Business
              </h1>
              <p className="text-slate-600">Tools and resources to help you access more funding and grow your business</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lenders">Lender Applications</TabsTrigger>
            <TabsTrigger value="resources">Growth Resources</TabsTrigger>
            <TabsTrigger value="insights">Business Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="lenders" className="space-y-6">
            {!selectedForm ? (
              <>
                {/* Lender Applications Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Building className="h-5 w-5 text-emerald-600" />
                      Apply to Additional Lenders
                    </CardTitle>
                    <CardDescription>
                      Expand your financing options by applying directly to major South African lenders. We'll pre-fill your information to save time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {lenderForms.map((lender) => (
                        <div key={lender.id} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Building className="h-6 w-6 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{lender.name}</h3>
                                <p className="text-sm text-slate-600">{lender.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                              Pre-filled
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-slate-500">Typical Rates</p>
                              <p className="font-medium text-slate-900">{lender.typical_rates}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Max Amount</p>
                              <p className="font-medium text-slate-900">{lender.max_amount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Processing Time</p>
                              <p className="font-medium text-slate-900">{lender.processing_time}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Requirements</p>
                              <p className="font-medium text-slate-900">{lender.requirements.length} items</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-slate-900 mb-2">You'll need:</p>
                            <div className="flex flex-wrap gap-2">
                              {lender.requirements.map((req, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button 
                              onClick={() => setSelectedForm(lender.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              Start Application
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Selected Form View
              <>
                {(() => {
                  const lender = lenderForms.find(l => l.id === selectedForm)
                  if (!lender) return null

                  return (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-slate-900">
                              <Building className="h-5 w-5 text-emerald-600" />
                              {lender.name} Application
                            </CardTitle>
                            <CardDescription>
                              Complete this form to apply directly with {lender.name}. Pre-filled fields are marked with a green checkmark.
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedForm(null)}
                          >
                            Back to Lenders
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); submitToLender(lender.id); }}>
                          <div className="space-y-6">
                            {lender.fields.map((field) => (
                              <div key={field.name} className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  {field.label}
                                  {field.required && <span className="text-red-500">*</span>}
                                  {field.prefilled && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                </Label>
                                
                                {field.type === 'select' ? (
                                  <Select 
                                    value={formData[field.name] || field.value || ''} 
                                    onValueChange={(value) => handleFieldChange(field.name, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options?.map((option) => (
                                        <SelectItem key={option} value={option.toLowerCase()}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : field.type === 'textarea' ? (
                                  <Textarea
                                    value={formData[field.name] || field.value || ''}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    required={field.required}
                                    rows={3}
                                  />
                                ) : field.type === 'radio' ? (
                                  <div className="flex gap-4">
                                    {field.options?.map((option) => (
                                      <label key={option} className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name={field.name}
                                          value={option.toLowerCase()}
                                          checked={formData[field.name] === option.toLowerCase()}
                                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                          required={field.required}
                                        />
                                        {option}
                                      </label>
                                    ))}
                                  </div>
                                ) : (
                                  <Input
                                    type={field.type}
                                    value={formData[field.name] || field.value || ''}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    required={field.required}
                                    className={field.prefilled ? 'bg-emerald-50 border-emerald-200' : ''}
                                  />
                                )}
                              </div>
                            ))}

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-blue-900">Data Privacy Notice</h4>
                                  <p className="text-sm text-blue-800 mt-1">
                                    By submitting this form, you acknowledge that your information will be shared with {lender.name} 
                                    for the purpose of processing your finance application. Your data will be handled according to 
                                    their privacy policy and applicable data protection laws.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3">
                              <Button type="button" variant="outline" onClick={() => setSelectedForm(null)}>
                                Cancel
                              </Button>
                              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                <Send className="h-4 w-4 mr-2" />
                                Submit Application
                              </Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )
                })()}
              </>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Growth Resources */}
            <div className="grid gap-6">
              {growthResources.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {category.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <div>
                            <h4 className="font-medium text-slate-900">{resource.title}</h4>
                            <p className="text-sm text-slate-600">{resource.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getColorClasses(category.color)}>
                              {resource.type}
                            </Badge>
                            <Button size="sm" variant="outline">
                              {resource.type === 'download' ? <Download className="h-3 w-3 mr-1" /> : <ExternalLink className="h-3 w-3 mr-1" />}
                              {resource.type === 'download' ? 'Download' : 'View'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Business Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Your Business Health Score
                </CardTitle>
                <CardDescription>
                  Based on your PayFlow activity and industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">85</div>
                    <p className="text-sm text-slate-600">Overall Score</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">18</div>
                    <p className="text-sm text-slate-600">Avg Collection Days</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
                    <p className="text-sm text-slate-600">Payment Success Rate</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">Strong Payment History</p>
                        <p className="text-sm text-emerald-700">Your buyers consistently pay on time</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Excellent</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">Diversify Your Client Base</p>
                        <p className="text-sm text-yellow-700">60% of revenue comes from top 3 clients</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Opportunity</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Industry Leader</p>
                        <p className="text-sm text-blue-700">Your metrics are above industry average</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Strong</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Actions to improve your financing eligibility and business growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Apply for Trade Credit Insurance</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          Protect against buyer default and improve your financing terms by up to 20%
                        </p>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Get Quote
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Optimize Payment Terms</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          Consider offering 2/10 net 30 terms to improve cash flow and reduce financing needs
                        </p>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Expand to Government Contracts</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          Government contracts offer stable payment terms and can improve your credit profile
                        </p>
                        <Button size="sm" variant="outline">
                          View Opportunities
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}