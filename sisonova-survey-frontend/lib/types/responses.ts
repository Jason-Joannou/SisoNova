export interface DashboardItem {
  name?: string;
  count?: number;
  avg?: number;
}

export interface DashboardDemographics {
  GENDER?: DashboardItem[];
  AGE_GROUP?: DashboardItem[];
  PROVINCE?: DashboardItem[];
  AREA_TYPE?: DashboardItem[];
  EMPLOYMENT_STATUS?: DashboardItem[];
  EDUCATION_LEVEL?: DashboardItem[];
}

export interface DashboardIncomeInfomration {
  MONTHLY_PERSONAL_INCOME?: DashboardItem[];
  INCOME_SOURCE?: DashboardItem[];
  HOUSEHOLD_SIZE?: DashboardItem;
  INCOME_EARNERS_COUNT?: DashboardItem;
  MONTHLY_HOUSEHOLD_INCOME?: DashboardItem[];
}

export interface DashboardIncomeManagement {
  SPENDING_PLAN_FREQUENCY?: DashboardItem[];
  SPENDING_PLAN_TIMING?: DashboardItem[];
  BUDGETING_STYLE?: DashboardItem[];
  EXPENSE_TRACKING?: DashboardItem[];
  SPENDING_MANAGEMENT_TOOLS?: DashboardItem[];
  FINANCIAL_CONTROL_FREQUENCY?: DashboardItem[];
  MONEY_EMOTION?: DashboardItem[];
  INCOME_ADEQUACY?: DashboardItem[];
  CASH_SHORTAGE_STRATEGIES?: DashboardItem[];
  PAYMENT_DELAY_FREQUENCY?: DashboardItem[];
  MONTHLY_SURPLUS?: DashboardItem[];
  SPENDING_PRIORITY_METHOD?: DashboardItem[];
  FINANCIAL_DECISION_FACTORS?: DashboardItem[];
  PURCHASE_REGRET_FREQUENCY?: DashboardItem[];
}

export interface DashboardFinancialAccess {
  ACCOUNT_TYPES?: DashboardItem[];
  ACTIVE_ACCOUNTS_COUNT?: DashboardItem[];
  MULTIPLE_ACCOUNTS_REASONS?: DashboardItem[];
  ACCOUNT_USAGE_PURPOSES?: DashboardItem[];
  TRUSTED_FINANCIAL_SERVICES?: DashboardItem[];
  PROVIDER_SWITCHING_HISTORY?: DashboardItem[];
  MOST_USED_FINANCIAL_SERVICES?: DashboardItem[];
  FINANCIAL_SERVICE_ISSUES?: DashboardItem[];
  DIGITAL_BANKING_FREQUENCY?: DashboardItem[];
  FINANCIAL_INCLUSION_PERCEPTION?: DashboardItem[];
}

export interface DashboardFinancialBarriers {
  PAPERWORK_AVOIDANCE?: DashboardItem[];
  FINANCIAL_LITERACY_LEVEL?: DashboardItem[];
  DOCUMENTATION_BARRIERS?: DashboardItem[];
  FINANCIAL_SERVICE_CONCERNS?: DashboardItem[];
  FINANCIAL_CONFIDENCE?: DashboardItem[];
  FINANCIAL_CONFUSION_RESPONSE?: DashboardItem[];
  FINANCIAL_INSTITUTION_TRUST?: DashboardItem[];
  NEGATIVE_FINANCIAL_EXPERIENCES?: DashboardItem[];
  FINANCIAL_EXCLUSION_FEELING?: DashboardItem[];
  CLARITY_IMPACT_ON_USAGE?: DashboardItem[];
}

export interface DashboardPsychologicalBarriers {
  FINANCIAL_RISK_TOLERANCE?: DashboardItem[];
  DEBT_ATTITUDE?: DashboardItem[];
  DEBT_PERCEPTION?: DashboardItem[];
  BORROWING_COMFORT?: DashboardItem[];
  SAVING_PERCEPTION?: DashboardItem[];
  SAVING_POSSIBILITY_BELIEF?: DashboardItem[];
  WINDFALL_USAGE?: DashboardItem[];
  SAVING_BENEFIT_BELIEF?: DashboardItem[];
  PURCHASE_DECISION_CRITERIA?: DashboardItem[];
}

export interface DashboardTechnologyUnderstanding {
  FINTECH_COMFORT_LEVEL?: DashboardItem[];
  FINANCIAL_MANAGEMENT_DEVICES?: DashboardItem[];
  INTERNET_USAGE_FREQUENCY?: DashboardItem[];
  DIGITAL_FINANCE_CHALLENGES?: DashboardItem[];
  APP_ABANDONMENT_EXPERIENCE?: DashboardItem[];
  FINTECH_LEARNING_PREFERENCE?: DashboardItem[];
  FINTECH_ADOPTION_MOTIVATORS?: DashboardItem[];
  DIGITAL_SECURITY_TRUST?: DashboardItem[];
  DIGITAL_ERROR_ANXIETY?: DashboardItem[];
  FINANCIAL_APPS_USED?: DashboardItem[];
}

export interface DashboardResponse {
  dashboard_response:
    | DashboardDemographics
    | DashboardIncomeInfomration
    | DashboardIncomeManagement
    | DashboardFinancialAccess
    | DashboardFinancialBarriers
    | DashboardPsychologicalBarriers
    | DashboardTechnologyUnderstanding;
  message: string;
}
