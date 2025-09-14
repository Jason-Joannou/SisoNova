interface FinancingRequest {
  id: string
  invoice_number: string
  buyer_name: string
  buyer_company_registration?: string
  invoice_amount: number
  requested_amount: number
  invoice_date: string
  due_date: string
  days_to_maturity: number
  status: 'draft' | 'submitted' | 'under_review' | 'offer_ready' | 'accepted' | 'funded' | 'declined' | 'completed'
  // Single offer details (best match from our partner network)
  recommended_offer?: {
    funding_partner: string // Internal - not shown to SME
    advance_rate: number
    fee_rate: number
    reserve_percentage: number
    net_advance: number
    total_fee: number
    processing_time: string
    terms_conditions: string[]
  }
  proof_of_work_uploaded: boolean
  created_at: string
  funded_at?: string
  expected_collection_date?: string
}

interface FinancingStats {
  total_financed: number
  total_advanced: number
  active_requests: number
  average_advance_rate: number
  average_processing_time: number // hours
  total_fees_paid: number
  success_rate: number
}