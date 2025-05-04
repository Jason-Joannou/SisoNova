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

export interface DashboardResponse {
  dashboard_response: DashboardDemographics | DashboardIncomeInfomration;
  message: string;
}
