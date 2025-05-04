import { useState, useEffect } from "react";
import { fetchDashboardData } from "@/services/dashboard-services";
import { DashboardFilters } from "../types/api";
import { DashboardResponse } from "../types/responses";

export function useDashboard(dashboardFilters: DashboardFilters) {
  const [data, setData] = useState<DashboardResponse>({
    dashboard_response: {},
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchDashboardData(dashboardFilters);
        setData(response);
      } catch (error) {
        setError("Error fetching storyline");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    dashboardFilters.gender,
    dashboardFilters.ageGroup,
    dashboardFilters.province,
  ]);

  return { data, loading, error };
}
