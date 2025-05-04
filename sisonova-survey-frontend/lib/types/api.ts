export interface StorylineResponse {
  stats: Record<string, any>;
  raw_data: Record<string, any>;
  messaged: string;
}

export interface DashboardFilters {
  gender?: string;
  ageGroup?: string;
  province?: string;
}
