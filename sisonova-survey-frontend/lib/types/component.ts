import { DashboardFilters } from "./api";

export interface StorylineContentProps {
  gender?: string;
}

export interface DemographicsChartsProps {
  filters: DashboardFilters;
  apiUrlSuffix: string;
}

