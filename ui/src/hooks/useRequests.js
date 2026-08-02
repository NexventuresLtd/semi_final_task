import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestService } from "../services/requestService";

export function useMyRequests(options = {}) {
  return useQuery({
    queryKey: ["requests", "mine"],
    queryFn: () => requestService.getMyRequests().then((r) => r.data),
    enabled: options.enabled ?? true,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["requests", "stats"],
    queryFn: () => requestService.getStats().then((r) => r.data),
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => requestService.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err) => {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Could not submit request";
      // toast is shown by the caller (TemplateFillForm) so we just re-throw
      // the enriched message — but keep this here as a safety net for any
      // future callers that don't have their own error handling.
      throw new Error(msg);
    },
  });
}