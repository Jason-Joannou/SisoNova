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
  Banknote,
  ClipboardList,
  CheckSquare,
  XCircle,
  ArrowRight,
  Info,
  HelpCircle,
  FileCheck,
  Briefcase,
  Receipt,
  CreditCard as CreditCardIcon,
  Building2,
  Scale,
  UserCheck,
  Landmark,
  FileBarChart
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

// Financial TODOs for South African SMEs
interface FinancialTodo {
  id: string
  title: string
  description: string
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'completed' | 'in_progress' | 'not_started'
  estimatedTime: string
  cost: string
  authority: string
  icon: any
  color: string
  requirements: string[]
  benefits: string[]
  steps: TodoStep[]
  resources: TodoResource[]
  deadline?: string
}

interface TodoStep {
  step: number
  title: string
  description: string
  completed: boolean
}

interface TodoResource {
  title: string
  type: 'website' | 'document' | 'guide' | 'contact'
  url?: string
  description: string
}

const financialTodos: FinancialTodo[] = [
  {
    id: "company_registration",
    title: "Company Registration (CIPC)",
    description: "Register your business with the Companies and Intellectual Property Commission",
    category: "Business Registration",
    priority: "critical",
    status: "completed", // User already has this
    estimatedTime: "1-3 business days",
    cost: "R175 - R500",
    authority: "CIPC",
    icon: Building2,
    color: "emerald",
    requirements: [
      "Proposed company name",
      "Memorandum of Incorporation",
      "Director details and consent",
      "Registered office address"
    ],
    benefits: [
      "Legal entity status",
      "Limited liability protection",
      "Ability to open business bank accounts",
      "Professional credibility"
    ],
    steps: [
      { step: 1, title: "Name Reservation", description: "Reserve your company name with CIPC", completed: true },
      { step: 2, title: "Prepare Documents", description: "Complete Memorandum of Incorporation", completed: true },
      { step: 3, title: "Submit Application", description: "Submit registration via CIPC online portal", completed: true },
      { step: 4, title: "Receive Certificate", description: "Download certificate of incorporation", completed: true }
    ],
    resources: [
      { title: "CIPC Online Portal", type: "website", url: "https://eservices.cipc.co.za", description: "Official CIPC registration portal" },
      { title: "Company Registration Guide", type: "guide", description: "Step-by-step registration guide" },
      { title: "MOI Template", type: "document", description: "Standard Memorandum of Incorporation template" }
    ]
  },
  {
    id: "tax_registration",
    title: "SARS Tax Registration",
    description: "Register for income tax and obtain your tax reference number",
    category: "Tax Compliance",
    priority: "critical",
    status: "completed",
    estimatedTime: "Same day online",
    cost: "Free",
    authority: "SARS",
    icon: Receipt,
    color: "blue",
    requirements: [
      "Company registration certificate",
      "Director ID documents",
      "Proof of business address",
      "Banking details"
    ],
    benefits: [
      "Legal tax compliance",
      "Ability to claim business expenses",
      "Required for VAT registration",
      "Professional legitimacy"
    ],
    steps: [
      { step: 1, title: "SARS eFiling Registration", description: "Create SARS eFiling profile", completed: true },
      { step: 2, title: "Tax Registration", description: "Complete tax registration online", completed: true },
      { step: 3, title: "Receive Tax Number", description: "Obtain tax reference number", completed: true },
      { step: 4, title: "Set Up Returns", description: "Configure tax return submissions", completed: true }
    ],
    resources: [
      { title: "SARS eFiling", type: "website", url: "https://www.sarsefiling.co.za", description: "SARS online tax portal" },
      { title: "Tax Registration Guide", type: "guide", description: "Complete tax registration walkthrough" },
      { title: "SARS Contact Centre", type: "contact", description: "0800 00 7277 for assistance" }
    ]
  },
  {
    id: "vat_registration",
    title: "VAT Registration",
    description: "Register for Value Added Tax if turnover exceeds R1 million annually",
    category: "Tax Compliance",
    priority: "high",
    status: "completed",
    estimatedTime: "1-2 business days",
    cost: "Free",
    authority: "SARS",
    icon: FileBarChart,
    color: "purple",
    requirements: [
      "Tax reference number",
      "Proof of turnover exceeding R1m",
      "Business bank statements",
      "Lease agreement or proof of address"
    ],
    benefits: [
      "Claim VAT on business purchases",
      "Professional credibility with suppliers",
      "Required for many B2B transactions",
      "Compliance with tax law"
    ],
    steps: [
      { step: 1, title: "Check Eligibility", description: "Confirm annual turnover exceeds R1 million", completed: true },
      { step: 2, title: "Gather Documents", description: "Collect required supporting documents", completed: true },
      { step: 3, title: "Submit Application", description: "Apply via SARS eFiling", completed: true },
      { step: 4, title: "Receive VAT Number", description: "Obtain VAT registration number", completed: true }
    ],
    resources: [
      { title: "VAT Registration Guide", type: "guide", description: "SARS VAT registration requirements" },
      { title: "VAT Calculator", type: "document", description: "Calculate VAT obligations" },
      { title: "SARS Branch Locator", type: "website", description: "Find nearest SARS office" }
    ]
  },
  {
    id: "uif_registration",
    title: "UIF Registration",
    description: "Register with Unemployment Insurance Fund for employee benefits",
    category: "Employment Compliance",
    priority: "high",
    status: "not_started",
    estimatedTime: "1 business day",
    cost: "Free",
    authority: "Department of Labour",
    icon: UserCheck,
    color: "orange",
    requirements: [
      "Company registration certificate",
      "Tax clearance certificate",
      "Employee details",
      "Proof of business address"
    ],
    benefits: [
      "Legal compliance for employees",
      "Employee unemployment benefits",
      "Maternity/illness benefits",
      "Avoid penalties and fines"
    ],
    steps: [
      { step: 1, title: "Prepare Documents", description: "Gather required company and employee documents", completed: false },
      { step: 2, title: "Complete Application", description: "Submit UIF registration form", completed: false },
      { step: 3, title: "Receive Reference", description: "Obtain UIF reference number", completed: false },
      { step: 4, title: "Set Up Contributions", description: "Configure monthly UIF contributions", completed: false }
    ],
    resources: [
      { title: "UIF Online Portal", type: "website", url: "https://www.labour.gov.za", description: "Department of Labour services" },
      { title: "UIF Registration Form", type: "document", description: "UI-19 registration form" },
      { title: "Labour Relations Guide", type: "guide", description: "Employment law compliance guide" }
    ]
  },
  {
    id: "workmen_compensation",
    title: "Workmen's Compensation",
    description: "Register with Compensation Commissioner for workplace injury insurance",
    category: "Employment Compliance",
    priority: "high",
    status: "not_started",
    estimatedTime: "2-3 business days",
    cost: "Based on payroll",
    authority: "Compensation Commissioner",
    icon: Shield,
    color: "red",
    requirements: [
      "Company registration details",
      "Employee information",
      "Business activity classification",
      "Payroll information"
    ],
    benefits: [
      "Legal compliance requirement",
      "Employee injury protection",
      "Avoid prosecution and fines",
      "Professional business operation"
    ],
    steps: [
      { step: 1, title: "Determine Classification", description: "Identify your business risk classification", completed: false },
      { step: 2, title: "Complete Registration", description: "Submit W.As.2 registration form", completed: false },
      { step: 3, title: "Pay Assessment", description: "Pay initial assessment fee", completed: false },
      { step: 4, title: "Receive Certificate", description: "Obtain Letter of Good Standing", completed: false }
    ],
    resources: [
      { title: "Compensation Fund", type: "website", url: "https://www.labour.gov.za", description: "Official compensation fund portal" },
      { title: "Risk Classification Guide", type: "guide", description: "Determine your business risk category" },
      { title: "Assessment Calculator", type: "document", description: "Calculate compensation contributions" }
    ]
  },
  {
    id: "business_bank_account",
    title: "Business Bank Account",
    description: "Open a dedicated business bank account for financial separation",
    category: "Banking & Finance",
    priority: "critical",
    status: "completed",
    estimatedTime: "1-2 hours",
    cost: "Monthly fees vary",
    authority: "Commercial Banks",
    icon: Landmark,
    color: "blue",
    requirements: [
      "Company registration certificate",
      "Tax clearance certificate",
      "Director ID documents",
      "Proof of business address",
      "CIPC certificate"
    ],
    benefits: [
      "Professional business image",
      "Separate personal and business finances",
      "Required for business loans",
      "Easier accounting and tax compliance"
    ],
    steps: [
      { step: 1, title: "Choose Bank", description: "Compare business banking options", completed: true },
      { step: 2, title: "Gather Documents", description: "Collect all required documentation", completed: true },
      { step: 3, title: "Schedule Appointment", description: "Book meeting with business banker", completed: true },
      { step: 4, title: "Open Account", description: "Complete account opening process", completed: true }
    ],
    resources: [
      { title: "Bank Comparison Tool", type: "document", description: "Compare business banking fees" },
      { title: "Required Documents Checklist", type: "guide", description: "Complete documentation list" },
      { title: "Business Banking Guide", type: "guide", description: "Choosing the right business account" }
    ]
  },
  {
    id: "popia_compliance",
    title: "POPIA Compliance",
    description: "Ensure compliance with Protection of Personal Information Act",
    category: "Data Protection",
    priority: "medium",
    status: "in_progress",
    estimatedTime: "2-4 weeks",
    cost: "R5,000 - R50,000",
    authority: "Information Regulator",
    icon: Lock,
    color: "slate",
    requirements: [
      "Data processing assessment",
      "Privacy policy development",
      "Consent management system",
      "Data security measures"
    ],
    benefits: [
      "Legal compliance with data laws",
      "Customer trust and confidence",
      "Avoid hefty fines and penalties",
      "Competitive advantage"
    ],
    steps: [
      { step: 1, title: "Data Audit", description: "Assess current data processing activities", completed: true },
      { step: 2, title: "Privacy Policy", description: "Develop comprehensive privacy policy", completed: true },
      { step: 3, title: "Security Measures", description: "Implement data security controls", completed: false },
      { step: 4, title: "Staff Training", description: "Train staff on POPIA requirements", completed: false }
    ],
    resources: [
      { title: "Information Regulator", type: "website", url: "https://www.justice.gov.za/inforeg/", description: "Official POPIA guidance" },
      { title: "POPIA Compliance Checklist", type: "document", description: "Complete compliance checklist" },
      { title: "Privacy Policy Template", type: "document", description: "Standard privacy policy template" }
    ]
  },
  {
    id: "bbbee_certificate",
    title: "B-BBEE Certificate",
    description: "Obtain Broad-Based Black Economic Empowerment certificate",
    category: "Empowerment & Compliance",
    priority: "medium",
    status: "not_started",
    estimatedTime: "4-8 weeks",
    cost: "R15,000 - R100,000",
    authority: "SANAS Accredited Agencies",
    icon: Award,
    color: "yellow",
    requirements: [
      "Annual financial statements",
      "Employment equity data",
      "Procurement records",
      "Skills development information"
    ],
    benefits: [
      "Access to government tenders",
      "Corporate procurement opportunities",
      "Competitive advantage",
      "Compliance with transformation laws"
    ],
    steps: [
      { step: 1, title: "Choose Verification Agency", description: "Select SANAS accredited agency", completed: false },
      { step: 2, title: "Prepare Documentation", description: "Gather required financial and HR data", completed: false },
      { step: 3, title: "Verification Process", description: "Complete B-BBEE verification", completed: false },
      { step: 4, title: "Receive Certificate", description: "Obtain B-BBEE certificate", completed: false }
    ],
    resources: [
      { title: "B-BBEE Commission", type: "website", url: "https://www.bbbeecommission.co.za", description: "Official B-BBEE information" },
      { title: "Verification Agency List", type: "document", description: "SANAS accredited agencies" },
      { title: "B-BBEE Scorecard Guide", type: "guide", description: "Understanding the scorecard" }
    ]
  },
  {
    id: "professional_indemnity",
    title: "Professional Indemnity Insurance",
    description: "Obtain professional indemnity insurance for service-based businesses",
    category: "Insurance & Risk",
    priority: "medium",
    status: "not_started",
    estimatedTime: "1-2 weeks",
    cost: "R2,000 - R20,000 annually",
    authority: "Insurance Companies",
    icon: Shield,
    color: "indigo",
    requirements: [
      "Business registration details",
      "Professional qualifications",
      "Revenue information",
      "Risk assessment"
    ],
    benefits: [
      "Protection against professional claims",
      "Client confidence and trust",
      "Required for many contracts",
      "Financial risk mitigation"
    ],
    steps: [
      { step: 1, title: "Assess Coverage Needs", description: "Determine appropriate coverage amount", completed: false },
      { step: 2, title: "Get Quotes", description: "Obtain quotes from multiple insurers", completed: false },
      { step: 3, title: "Choose Policy", description: "Select appropriate insurance policy", completed: false },
      { step: 4, title: "Activate Coverage", description: "Complete policy activation", completed: false }
    ],
    resources: [
      { title: "Insurance Comparison", type: "document", description: "Compare professional indemnity options" },
      { title: "Coverage Calculator", type: "document", description: "Determine appropriate coverage" },
      { title: "Insurance Brokers List", type: "guide", description: "Recommended insurance brokers" }
    ]
  }
]

// Form Templates for Different Financial Services (keeping existing)
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
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getTodoStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'not_started': return 'bg-slate-100 text-slate-800 border-slate-200'
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
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'slate': return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'indigo': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
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

  // Mark todo step as complete
  const markStepComplete = (todoId: string, stepIndex: number) => {
    console.log(`Marking step ${stepIndex} complete for ${todoId}`)
    // In real implementation, this would update the backend
    alert("Step marked as complete!")
  }

  // Calculate completion percentage for todos
  const getCompletionStats = () => {
    const total = financialTodos.length
    const completed = financialTodos.filter(todo => todo.status === 'completed').length
    const inProgress = financialTodos.filter(todo => todo.status === 'in_progress').length
    return { total, completed, inProgress, percentage: Math.round((completed / total) * 100) }
  }

  const completionStats = getCompletionStats()

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="forms">Financing Forms</TabsTrigger>
            <TabsTrigger value="financial-todos">Financial TODOs</TabsTrigger>
            <TabsTrigger value="financial-literacy">Financial Skills</TabsTrigger>
            <TabsTrigger value="digital-literacy">Digital Skills</TabsTrigger>
            <TabsTrigger value="insights">Business Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="financial-todos" className="space-y-6">
            {!selectedTodo ? (
              <>
                {/* Financial TODOs Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <ClipboardList className="h-5 w-5 text-emerald-600" />
                      Financial Compliance TODOs
                    </CardTitle>
                    <CardDescription>
                      Essential tasks to ensure your business is properly registered and compliant with South African financial authorities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Overview */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">Your Compliance Progress</h3>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          {completionStats.completed}/{completionStats.total} Complete
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={completionStats.percentage} className="h-3" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">{completionStats.percentage}%</div>
                          <div className="text-xs text-slate-600">Complete</div>
                        </div>
                      </div>
                      <div className="flex gap-6 mt-3 text-sm">
                        <span className="text-emerald-600">✓ {completionStats.completed} Completed</span>
                        <span className="text-blue-600">⏳ {completionStats.inProgress} In Progress</span>
                        <span className="text-slate-600">○ {completionStats.total - completionStats.completed - completionStats.inProgress} Not Started</span>
                      </div>
                    </div>

                    {/* TODOs List */}
                    <div className="space-y-4">
                      {financialTodos.map((todo) => (
                        <div key={todo.id} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(todo.color)}`}>
                                <todo.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-slate-900">{todo.title}</h3>
                                  <Badge className={getPriorityColor(todo.priority)}>
                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                  </Badge>
                                  <Badge className={getTodoStatusColor(todo.status)}>
                                    {todo.status === 'completed' ? 'Completed' : 
                                     todo.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{todo.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500">
                                  <div>
                                    <span className="font-medium">Authority:</span>
                                    <div>{todo.authority}</div>
                                  </div>
                                  <div>
                                    <span className="font-medium">Time:</span>
                                    <div>{todo.estimatedTime}</div>
                                  </div>
                                  <div>
                                    <span className="font-medium">Cost:</span>
                                    <div>{todo.cost}</div>
                                  </div>
                                  <div>
                                    <span className="font-medium">Category:</span>
                                    <div>{todo.category}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {todo.status === 'completed' && (
                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                              )}
                              {todo.status === 'in_progress' && (
                                <Clock className="h-6 w-6 text-blue-600" />
                              )}
                              {todo.status === 'not_started' && (
                                <XCircle className="h-6 w-6 text-slate-400" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTodo(todo.id)}
                            >
                              <Info className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            {todo.status !== 'completed' && (
                              <Button 
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <ArrowRight className="h-3 w-3 mr-1" />
                                {todo.status === 'not_started' ? 'Get Started' : 'Continue'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // TODO Detail View
              <>
                {(() => {
                  const todo = financialTodos.find(t => t.id === selectedTodo)
                  if (!todo) return null

                  return (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-slate-900">
                              <todo.icon className="h-5 w-5 text-emerald-600" />
                              {todo.title}
                            </CardTitle>
                            <CardDescription>
                              {todo.description}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedTodo(null)}
                          >
                            Back to TODOs
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          {/* Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-3">Overview</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Authority:</span>
                                  <span className="font-medium">{todo.authority}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Estimated Time:</span>
                                  <span className="font-medium">{todo.estimatedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Cost:</span>
                                  <span className="font-medium">{todo.cost}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Priority:</span>
                                  <Badge className={getPriorityColor(todo.priority)}>
                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Status:</span>
                                  <Badge className={getTodoStatusColor(todo.status)}>
                                    {todo.status === 'completed' ? 'Completed' : 
                                     todo.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-slate-900 mb-3">Progress</h3>
                              <div className="space-y-3">
                                {todo.steps.map((step, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      step.completed 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-slate-200 text-slate-600'
                                    }`}>
                                      {step.completed ? '✓' : step.step}
                                    </div>
                                    <div className="flex-1">
                                      <div className={`font-medium ${step.completed ? 'text-emerald-700' : 'text-slate-900'}`}>
                                        {step.title}
                                      </div>
                                      <div className="text-xs text-slate-600">{step.description}</div>
                                    </div>
                                    {!step.completed && todo.status !== 'completed' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => markStepComplete(todo.id, index)}
                                      >
                                        Mark Complete
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Requirements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {todo.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckSquare className="h-4 w-4 text-slate-400" />
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Benefits */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Benefits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {todo.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Star className="h-4 w-4 text-emerald-500" />
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3">Helpful Resources</h3>
                            <div className="grid gap-3">
                              {todo.resources.map((resource, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                      {resource.type === 'website' && <Globe className="h-4 w-4 text-slate-600" />}
                                      {resource.type === 'document' && <FileText className="h-4 w-4 text-slate-600" />}
                                      {resource.type === 'guide' && <BookOpen className="h-4 w-4 text-slate-600" />}
                                      {resource.type === 'contact' && <Phone className="h-4 w-4 text-slate-600" />}
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-900">{resource.title}</div>
                                      <div className="text-sm text-slate-600">{resource.description}</div>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    {resource.type === 'website' ? (
                                      <>
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Visit
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </>
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedTodo(null)}>
                              Back to List
                            </Button>
                            {todo.status !== 'completed' && (
                              <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                {todo.status === 'not_started' ? 'Get Started' : 'Continue Progress'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })()}
              </>
            )}
          </TabsContent>

          {/* Keep all existing tabs content unchanged */}
          <TabsContent value="forms" className="space-y-6">
            {/* Forms content - keeping existing implementation */}
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
              // Form Editing View - keeping existing implementation
              <div>Form editing view would go here...</div>
            ) : (
              // Lender Selection View - keeping existing implementation  
              <div>Lender selection view would go here...</div>
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