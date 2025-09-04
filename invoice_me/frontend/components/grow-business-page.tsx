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
import { Progress } from "@/components/ui/progress"
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
  Award,
  PlayCircle,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  TrendingDown,
  DollarSign,
  Calendar,
  Brain,
  Zap,
  Star,
  Edit3,
  Copy,
  Mail,
  Phone,
  MapPin,
  Clock,
  Banknote
} from "lucide-react"

// Mock user data
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
  phone_number: "+27 21 123 4567",
  contact_person: "Jason Joannou"
}

// Form Templates for Different Financial Services
interface FormTemplate {
  id: string
  title: string
  description: string
  category: string
  icon: any
  color: string
  lastUpdated: string
  completionStatus: 'complete' | 'incomplete' | 'needs_update'
  applicableLenders: string[]
  fields: FormField[]
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'radio' | 'date'
  required: boolean
  options?: string[]
  value?: string
  category: 'business_info' | 'financial_info' | 'specific_requirements'
}

const formTemplates: FormTemplate[] = [
  {
    id: "debtor_finance",
    title: "Debtor Finance Application",
    description: "Standard form for invoice discounting, factoring, and debtor finance applications",
    category: "Asset-Based Finance",
    icon: FileText,
    color: "emerald",
    lastUpdated: "2024-01-15",
    completionStatus: "complete",
    applicableLenders: ["FNB", "Standard Bank", "Absa", "Nedbank", "Investec", "RMB"],
    fields: [
      // Business Information
      { name: "business_name", label: "Business Name", type: "text", required: true, value: userData.company_name, category: "business_info" },
      { name: "trading_name", label: "Trading Name", type: "text", required: true, value: userData.trading_name, category: "business_info" },
      { name: "company_registration", label: "Company Registration Number", type: "text", required: true, value: userData.company_registration, category: "business_info" },
      { name: "vat_number", label: "VAT Number", type: "text", required: true, value: userData.vat_number, category: "business_info" },
      { name: "business_address", label: "Business Address", type: "textarea", required: true, value: `${userData.address_line_1}, ${userData.address_line_2}, ${userData.city}, ${userData.province}, ${userData.postal_code}`, category: "business_info" },
      { name: "business_email", label: "Business Email", type: "email", required: true, value: userData.email, category: "business_info" },
      { name: "contact_number", label: "Contact Number", type: "tel", required: true, value: userData.phone_number, category: "business_info" },
      { name: "contact_person", label: "Contact Person", type: "text", required: true, value: userData.contact_person, category: "business_info" },
      { name: "business_industry", label: "Business Industry", type: "select", required: true, value: userData.industry_type, options: ["Retail", "Legal", "Entertainment", "Construction", "Consulting", "Manufacturing", "Healthcare", "Technology", "Other"], category: "business_info" },
      
      // Financial Information
      { name: "years_trading", label: "Years Trading", type: "select", required: true, options: ["Less than 1 year", "1-2 years", "2-5 years", "5-10 years", "10+ years"], category: "financial_info" },
      { name: "monthly_turnover", label: "Monthly Turnover", type: "select", required: true, options: ["R0 - R100k", "R100k - R500k", "R500k - R1m", "R1m - R5m", "R5m - R10m", "R10m+"], category: "financial_info" },
      { name: "amount_required", label: "Finance Amount Required", type: "select", required: true, options: ["R50k - R250k", "R250k - R500k", "R500k - R1m", "R1m - R5m", "R5m - R10m", "R10m+"], category: "financial_info" },
      
      // Specific Requirements
      { name: "finance_purpose", label: "Purpose of Finance", type: "select", required: true, options: ["Working Capital", "Invoice Discounting", "Factoring", "Equipment Purchase", "Business Expansion", "Other"], category: "specific_requirements" },
      { name: "debtors_book_insurance", label: "Do you have debtor's book insurance?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "current_ageing_debtors", label: "Do you have a current ageing debtors book?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "annual_financial_statements", label: "Do you have access to your Annual Financial Statements?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "management_accounts", label: "Do you have access to your latest Management Accounts?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "bank_statements", label: "Can you provide 3 months of bank statements?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "major_client_1", label: "Major Client 1 (optional)", type: "text", required: false, category: "specific_requirements" },
      { name: "major_client_2", label: "Major Client 2 (optional)", type: "text", required: false, category: "specific_requirements" },
      { name: "major_client_3", label: "Major Client 3 (optional)", type: "text", required: false, category: "specific_requirements" }
    ]
  },
  {
    id: "term_loan",
    title: "Term Loan Application",
    description: "Standard form for business term loans and installment finance",
    category: "Term Finance",
    icon: Banknote,
    color: "blue",
    lastUpdated: "2024-01-10",
    completionStatus: "complete",
    applicableLenders: ["FNB", "Standard Bank", "Absa", "Nedbank", "Capitec Business", "African Bank"],
    fields: [
      // Business Information (same as above)
      { name: "business_name", label: "Business Name", type: "text", required: true, value: userData.company_name, category: "business_info" },
      { name: "trading_name", label: "Trading Name", type: "text", required: true, value: userData.trading_name, category: "business_info" },
      { name: "company_registration", label: "Company Registration Number", type: "text", required: true, value: userData.company_registration, category: "business_info" },
      { name: "vat_number", label: "VAT Number", type: "text", required: true, value: userData.vat_number, category: "business_info" },
      { name: "business_address", label: "Business Address", type: "textarea", required: true, value: `${userData.address_line_1}, ${userData.address_line_2}, ${userData.city}, ${userData.province}, ${userData.postal_code}`, category: "business_info" },
      { name: "business_email", label: "Business Email", type: "email", required: true, value: userData.email, category: "business_info" },
      { name: "contact_number", label: "Contact Number", type: "tel", required: true, value: userData.phone_number, category: "business_info" },
      { name: "contact_person", label: "Contact Person", type: "text", required: true, value: userData.contact_person, category: "business_info" },
      { name: "business_industry", label: "Business Industry", type: "select", required: true, value: userData.industry_type, options: ["Retail", "Legal", "Entertainment", "Construction", "Consulting", "Manufacturing", "Healthcare", "Technology", "Other"], category: "business_info" },
      
      // Financial Information
      { name: "years_trading", label: "Years Trading", type: "select", required: true, options: ["Less than 1 year", "1-2 years", "2-5 years", "5-10 years", "10+ years"], category: "financial_info" },
      { name: "annual_turnover", label: "Annual Turnover", type: "select", required: true, options: ["R0 - R1m", "R1m - R5m", "R5m - R20m", "R20m - R50m", "R50m+"], category: "financial_info" },
      { name: "loan_amount", label: "Loan Amount Required", type: "select", required: true, options: ["R50k - R250k", "R250k - R500k", "R500k - R1m", "R1m - R5m", "R5m+"], category: "financial_info" },
      { name: "loan_term", label: "Preferred Loan Term", type: "select", required: true, options: ["6 months", "12 months", "24 months", "36 months", "48 months", "60 months"], category: "financial_info" },
      
      // Specific Requirements
      { name: "loan_purpose", label: "Purpose of Loan", type: "select", required: true, options: ["Working Capital", "Equipment Purchase", "Property Purchase", "Business Expansion", "Debt Consolidation", "Other"], category: "specific_requirements" },
      { name: "collateral_available", label: "Do you have collateral available?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "existing_debt", label: "Do you have existing business debt?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "financial_statements_available", label: "Do you have audited financial statements?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" }
    ]
  },
  {
    id: "overdraft_facility",
    title: "Overdraft Facility Application",
    description: "Standard form for business overdraft and revolving credit facilities",
    category: "Revolving Credit",
    icon: CreditCard,
    color: "purple",
    lastUpdated: "2024-01-12",
    completionStatus: "needs_update",
    applicableLenders: ["FNB", "Standard Bank", "Absa", "Nedbank"],
    fields: [
      // Business Information (same as above)
      { name: "business_name", label: "Business Name", type: "text", required: true, value: userData.company_name, category: "business_info" },
      { name: "trading_name", label: "Trading Name", type: "text", required: true, value: userData.trading_name, category: "business_info" },
      { name: "company_registration", label: "Company Registration Number", type: "text", required: true, value: userData.company_registration, category: "business_info" },
      { name: "business_address", label: "Business Address", type: "textarea", required: true, value: `${userData.address_line_1}, ${userData.address_line_2}, ${userData.city}, ${userData.province}, ${userData.postal_code}`, category: "business_info" },
      { name: "business_email", label: "Business Email", type: "email", required: true, value: userData.email, category: "business_info" },
      { name: "contact_number", label: "Contact Number", type: "tel", required: true, value: userData.phone_number, category: "business_info" },
      
      // Financial Information
      { name: "monthly_turnover", label: "Average Monthly Turnover", type: "select", required: true, options: ["R0 - R100k", "R100k - R500k", "R500k - R1m", "R1m - R5m", "R5m+"], category: "financial_info" },
      { name: "overdraft_limit", label: "Overdraft Limit Required", type: "select", required: true, options: ["R10k - R50k", "R50k - R100k", "R100k - R500k", "R500k - R1m", "R1m+"], category: "financial_info" },
      
      // Specific Requirements
      { name: "existing_banking", label: "Do you bank with us currently?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "cash_flow_seasonal", label: "Is your cash flow seasonal?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" },
      { name: "overdraft_usage", label: "How often would you use the overdraft?", type: "select", required: true, options: ["Daily", "Weekly", "Monthly", "Occasionally", "Emergency only"], category: "specific_requirements" }
    ]
  },
  {
    id: "equipment_finance",
    title: "Equipment Finance Application",
    description: "Standard form for equipment finance and asset-based lending",
    category: "Asset Finance",
    icon: Building,
    color: "orange",
    lastUpdated: "2024-01-08",
    completionStatus: "incomplete",
    applicableLenders: ["FNB", "Standard Bank", "Absa", "Nedbank", "WesBank", "MFC"],
    fields: [
      // Business Information
      { name: "business_name", label: "Business Name", type: "text", required: true, value: userData.company_name, category: "business_info" },
      { name: "trading_name", label: "Trading Name", type: "text", required: true, value: userData.trading_name, category: "business_info" },
      { name: "company_registration", label: "Company Registration Number", type: "text", required: true, value: userData.company_registration, category: "business_info" },
      { name: "business_address", label: "Business Address", type: "textarea", required: true, value: `${userData.address_line_1}, ${userData.address_line_2}, ${userData.city}, ${userData.province}, ${userData.postal_code}`, category: "business_info" },
      { name: "contact_person", label: "Contact Person", type: "text", required: true, value: userData.contact_person, category: "business_info" },
      
      // Financial Information
      { name: "equipment_cost", label: "Equipment Cost", type: "select", required: true, options: ["R50k - R250k", "R250k - R500k", "R500k - R1m", "R1m - R5m", "R5m+"], category: "financial_info" },
      { name: "deposit_available", label: "Deposit Available", type: "select", required: true, options: ["0%", "10%", "20%", "30%", "40%+"], category: "financial_info" },
      
      // Specific Requirements
      { name: "equipment_type", label: "Type of Equipment", type: "select", required: true, options: ["Vehicles", "Machinery", "IT Equipment", "Medical Equipment", "Construction Equipment", "Other"], category: "specific_requirements" },
      { name: "equipment_new_used", label: "New or Used Equipment?", type: "radio", required: true, options: ["New", "Used"], category: "specific_requirements" },
      { name: "supplier_identified", label: "Have you identified a supplier?", type: "radio", required: true, options: ["Yes", "No"], category: "specific_requirements" }
    ]
  }
]

// Financial Literacy Content (keeping existing)
const financialLiteracyModules = [
  {
    id: "cash_flow_basics",
    title: "Cash Flow Management Fundamentals",
    description: "Master the art of managing your business cash flow",
    duration: "15 minutes",
    difficulty: "Beginner",
    icon: DollarSign,
    color: "emerald",
    topics: [
      "Understanding cash flow vs profit",
      "Creating cash flow forecasts",
      "Managing seasonal fluctuations",
      "Emergency cash planning"
    ],
    hasVideo: true,
    hasCalculator: true,
    completed: false
  },
  {
    id: "financial_statements",
    title: "Reading Financial Statements",
    description: "Decode your P&L, balance sheet, and cash flow statements",
    duration: "20 minutes",
    difficulty: "Intermediate",
    icon: BarChart3,
    color: "blue",
    topics: [
      "Profit & Loss statement basics",
      "Balance sheet fundamentals",
      "Key financial ratios",
      "Spotting red flags"
    ],
    hasVideo: true,
    hasCalculator: true,
    completed: true
  },
  {
    id: "credit_management",
    title: "Business Credit & Financing",
    description: "Build credit and access better financing options",
    duration: "18 minutes",
    difficulty: "Intermediate",
    icon: CreditCard,
    color: "purple",
    topics: [
      "Building business credit score",
      "Types of business financing",
      "Preparing for lender applications",
      "Negotiating better terms"
    ],
    hasVideo: true,
    hasCalculator: false,
    completed: false
  }
]

// Digital Literacy Content (keeping existing)
const digitalLiteracyModules = [
  {
    id: "digital_presence",
    title: "Building Your Digital Presence",
    description: "Establish a professional online presence for your business",
    duration: "20 minutes",
    difficulty: "Beginner",
    icon: Globe,
    color: "blue",
    topics: [
      "Professional website essentials",
      "Google My Business optimization",
      "Social media for business",
      "Online reputation management"
    ],
    hasVideo: true,
    hasTools: true,
    completed: false
  },
  {
    id: "digital_payments",
    title: "Digital Payment Solutions",
    description: "Optimize your payment processes and reduce friction",
    duration: "15 minutes",
    difficulty: "Beginner",
    icon: Smartphone,
    color: "emerald",
    topics: [
      "Payment gateway options",
      "Mobile payment solutions",
      "Recurring billing setup",
      "Payment security basics"
    ],
    hasVideo: true,
    hasTools: true,
    completed: true
  }
]

export function GrowBusinessPage() {
  const [activeTab, setActiveTab] = useState("forms")
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [editingForm, setEditingForm] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [selectedLenders, setSelectedLenders] = useState<string[]>([])

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  // Get color classes for different statuses and colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'incomplete': return 'bg-red-100 text-red-800 border-red-200'
      case 'needs_update': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'red': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  // Submit form to selected lenders
  const submitFormToLenders = (formId: string) => {
    console.log(`Submitting ${formId} to ${selectedLenders.length} lenders:`, formData)
    alert(`Application submitted to ${selectedLenders.length} lenders! They will contact you within 2-3 business days.`)
    setSelectedForm(null)
    setSelectedLenders([])
  }

  // Save form updates
  const saveFormUpdates = (formId: string) => {
    console.log(`Saving updates to ${formId}:`, formData)
    alert("Form updated successfully!")
    setEditingForm(null)
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
              <p className="text-slate-600">Manage your financing forms, learn essential skills, and grow your business with confidence</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forms">Financing Forms</TabsTrigger>
            <TabsTrigger value="financial-literacy">Financial Skills</TabsTrigger>
            <TabsTrigger value="digital-literacy">Digital Skills</TabsTrigger>
            <TabsTrigger value="insights">Business Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-6">
            {!selectedForm && !editingForm ? (
              <>
                {/* Forms Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      Your Financing Forms
                    </CardTitle>
                    <CardDescription>
                      Manage standardized forms for different financial services. Update once and use across multiple lenders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {formTemplates.map((form) => (
                        <div key={form.id} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(form.color)}`}>
                                <form.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-slate-900">{form.title}</h3>
                                  <Badge className={getStatusColor(form.completionStatus)}>
                                    {form.completionStatus === 'complete' ? 'Complete' : 
                                     form.completionStatus === 'incomplete' ? 'Incomplete' : 'Needs Update'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{form.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    {form.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Updated {form.lastUpdated}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {form.applicableLenders.length} lenders
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-slate-900 mb-2">Applicable Lenders:</p>
                            <div className="flex flex-wrap gap-2">
                              {form.applicableLenders.map((lender, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {lender}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingForm(form.id)}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit Form
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => setSelectedForm(form.id)}
                              disabled={form.completionStatus === 'incomplete'}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Apply to Lenders
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : editingForm ? (
              // Form Editing View
              <>
                {(() => {
                  const form = formTemplates.find(f => f.id === editingForm)
                  if (!form) return null

                  return (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-slate-900">
                              <Edit3 className="h-5 w-5 text-blue-600" />
                              Edit {form.title}
                            </CardTitle>
                            <CardDescription>
                              Update your form information. Changes will apply to all future applications.
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingForm(null)}
                          >
                            Back to Forms
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); saveFormUpdates(form.id); }}>
                          <div className="space-y-8">
                            {/* Business Information Section */}
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Building className="h-5 w-5 text-slate-600" />
                                Business Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {form.fields.filter(field => field.category === 'business_info').map((field) => (
                                  <div key={field.name} className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                      {field.label}
                                      {field.required && <span className="text-red-500">*</span>}
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
                                    ) : (
                                      <Input
                                        type={field.type}
                                        value={formData[field.name] || field.value || ''}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        required={field.required}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Financial Information Section */}
                            {form.fields.some(field => field.category === 'financial_info') && (
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                  <BarChart3 className="h-5 w-5 text-slate-600" />
                                  Financial Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {form.fields.filter(field => field.category === 'financial_info').map((field) => (
                                    <div key={field.name} className="space-y-2">
                                      <Label className="flex items-center gap-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500">*</span>}
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
                                      ) : (
                                        <Input
                                          type={field.type}
                                          value={formData[field.name] || field.value || ''}
                                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                          required={field.required}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Specific Requirements Section */}
                            {form.fields.some(field => field.category === 'specific_requirements') && (
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                  <Target className="h-5 w-5 text-slate-600" />
                                  Specific Requirements
                                </h3>
                                <div className="space-y-4">
                                  {form.fields.filter(field => field.category === 'specific_requirements').map((field) => (
                                    <div key={field.name} className="space-y-2">
                                      <Label className="flex items-center gap-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500">*</span>}
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
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-3">
                              <Button type="button" variant="outline" onClick={() => setEditingForm(null)}>
                                Cancel
                              </Button>
                              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )
                })()}
              </>
            ) : (
              // Lender Selection and Application View
              <>
                {(() => {
                  const form = formTemplates.find(f => f.id === selectedForm)
                  if (!form) return null

                  return (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-slate-900">
                              <Send className="h-5 w-5 text-emerald-600" />
                              Apply with {form.title}
                            </CardTitle>
                            <CardDescription>
                              Select which lenders you'd like to apply to with your {form.title.toLowerCase()}.
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedForm(null)}
                          >
                            Back to Forms
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Lenders</h3>
                            <div className="grid gap-3">
                              {form.applicableLenders.map((lender) => (
                                <div 
                                  key={lender}
                                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedLenders.includes(lender) 
                                      ? 'border-emerald-500 bg-emerald-50' 
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                  onClick={() => {
                                    setSelectedLenders(prev => 
                                      prev.includes(lender) 
                                        ? prev.filter(l => l !== lender)
                                        : [...prev, lender]
                                    )
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Building className="h-5 w-5 text-slate-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-slate-900">{lender}</h4>
                                        <p className="text-sm text-slate-600">Business Finance Division</p>
                                      </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      selectedLenders.includes(lender)
                                        ? 'border-emerald-500 bg-emerald-500'
                                        : 'border-slate-300'
                                    }`}>
                                      {selectedLenders.includes(lender) && (
                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-blue-900">Data Privacy Notice</h4>
                                <p className="text-sm text-blue-800 mt-1">
                                  By submitting this form, you acknowledge that your information will be shared with the selected lenders 
                                  for the purpose of processing your finance application. Your data will be handled according to 
                                  their privacy policies and applicable data protection laws.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-slate-600">
                              {selectedLenders.length} lender{selectedLenders.length !== 1 ? 's' : ''} selected
                            </p>
                            <Button 
                              onClick={() => submitFormToLenders(form.id)}
                              disabled={selectedLenders.length === 0}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Submit to {selectedLenders.length} Lender{selectedLenders.length !== 1 ? 's' : ''}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })()}
              </>
            )}
          </TabsContent>

          <TabsContent value="financial-literacy" className="space-y-6">
            {/* Financial Literacy Content - keeping existing structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  Your Financial Learning Journey
                </CardTitle>
                <CardDescription>
                  Build essential financial skills to grow your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>33% Complete</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">1/3</div>
                    <div className="text-xs text-slate-600">Modules Complete</div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {financialLiteracyModules.map((module) => (
                    <div key={module.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(module.color)}`}>
                            <module.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{module.title}</h3>
                              {module.completed && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{module.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{module.duration}</span>
                              <span>{module.difficulty}</span>
                              {module.hasVideo && <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" />Video</span>}
                              {module.hasCalculator && <span className="flex items-center gap-1"><Calculator className="h-3 w-3" />Calculator</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className={module.completed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}>
                            {module.completed ? "Review" : "Start Learning"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="digital-literacy" className="space-y-6">
            {/* Digital Literacy Content - keeping existing structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  Your Digital Maturity Score
                </CardTitle>
                <CardDescription>
                  See how digitally advanced your business is and get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">68</div>
                    <p className="text-xs text-slate-600">Overall Score</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">85</div>
                    <p className="text-xs text-slate-600">Payments</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600 mb-1">45</div>
                    <p className="text-xs text-slate-600">Online Presence</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">72</div>
                    <p className="text-xs text-slate-600">Automation</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {digitalLiteracyModules.map((module) => (
                    <div key={module.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(module.color)}`}>
                            <module.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{module.title}</h3>
                              {module.completed && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{module.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{module.duration}</span>
                              <span>{module.difficulty}</span>
                              {module.hasVideo && <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" />Video</span>}
                              {module.hasTools && <span className="flex items-center gap-1"><Zap className="h-3 w-3" />Tools</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className={module.completed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}>
                            {module.completed ? "Review" : "Start Learning"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Business Insights - keeping existing content */}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}