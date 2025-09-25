export interface CollectionItem {
  id: string
  invoice_number: string
  buyer_name: string
  buyer_email: string
  buyer_phone?: string
  amount: number
  due_date: string
  days_overdue: number
  status: 'active' | 'paid' | 'overdue' | 'disputed' | 'written_off'
  payment_reference: string
  last_reminder_sent?: string
  reminder_count: number
  created_at: string
}

export interface ReminderSettings {
  enabled: boolean
  reminder_schedule: number[]
  whatsapp_enabled: boolean
  email_enabled: boolean
  sms_enabled: boolean
  escalation_enabled: boolean
  escalation_days: number
  custom_message?: string
}

export interface CollectionStats {
  total_outstanding: number
  total_collected_this_month: number
  average_collection_days: number
  collection_success_rate: number
  overdue_amount: number
  active_collections: number
}