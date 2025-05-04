import api from "./api";
import { DashboardFilters } from "@/lib/types/api";
import { DashboardResponse } from "@/lib/types/responses";

export const fetchDashboardData = async (
  dashboardProps: DashboardFilters,
): Promise<DashboardResponse> => {
  try {
    let url = "/api/dashboard/demographics";
    if (dashboardProps.gender) url += `?gender=${dashboardProps.gender}`;
    if (dashboardProps.province) url += `?province=${dashboardProps.province}`;
    if (dashboardProps.ageGroup) url += `?age_group=${dashboardProps.ageGroup}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.log("Error fetching storyline", error);
    throw error;
  }
};
