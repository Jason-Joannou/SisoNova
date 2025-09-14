export interface DocumentRequirement {
  id: string
  name: string
  description: string
  required: boolean
  status: 'missing' | 'uploaded' | 'verified' | 'rejected'
  fileType: string[]
  maxSize: string
  example?: string
  helpText?: string
}

export interface ComplianceService {
  id: string
  title: string
  description: string
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'completed' | 'in_progress' | 'ready_to_submit' | 'collecting_docs' | 'not_started'
  estimatedTime: string
  cost: string
  SisoNovaFee: string
  authority: string
  icon: any
  color: string
  canAutoSubmit: boolean
  documents: DocumentRequirement[]
  formFields: ComplianceFormField[]
  benefits: string[]
  nextSteps: string[]
}

export interface ComplianceFormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox'
  required: boolean
  options?: string[]
  value?: string
  helpText?: string
  validation?: string
}

export interface FormTemplate {
  id: string
  title: string
  description: string
  category: string
  icon: any
  color: string
  lastUpdated: string
  completionStatus: 'complete' | 'incomplete' | 'needs_update'
  applicableLenders: string[]
  fields: TemplateFormField[]
}

export interface TemplateFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'radio' | 'date'
  required: boolean
  options?: string[]
  value?: string
  category: 'business_info' | 'financial_info' | 'specific_requirements'
}

// The below 2 share common properties and can transform into one later
export interface FinancialLiteracyModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: any;
  color: string;
  topics: string[];
  hasVideo: boolean;
  hasCalculator: boolean;
  completed: boolean;
}

export interface DigitalLiteracyModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: any;
  color: string;
  topics: string[];
  hasVideo: boolean;
  hasTools: boolean;
  completed: boolean;
}