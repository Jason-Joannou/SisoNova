export interface StorylineResponse {
  stats: Record<string, any>;
  messaged: string;
}

export interface DashboardFilters {
  gender?: string;
  age_group?: string;
  province?: string;
}

