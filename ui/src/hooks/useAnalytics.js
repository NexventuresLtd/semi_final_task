import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => analyticsService.getOverview().then((r) => r.data),
  });
}

export function useDepartmentRequests(weekOffset = 0) {
  return useQuery({
    queryKey: ["analytics", "department-requests", weekOffset],
    queryFn: () => analyticsService.getDepartmentRequests(weekOffset).then((r) => r.data),
  });
}