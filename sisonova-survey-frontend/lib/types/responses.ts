export interface DashboardItem {
  name: string;
  count: number;
}

export interface DashboardDemographics {
  GENDER?: DashboardItem[];
  AGE_GROUP?: DashboardItem[];
  PROVINCE?: DashboardItem[];
  AREA_TYPE?: DashboardItem[];
  EMPLOYMENT_STATUS?: DashboardItem[];
  EDUCATION_LEVEL?: DashboardItem[];
}

export interface DashboardResponse {
  dashboard_response: DashboardDemographics;
  message: string;
}
