import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { approvalService } from "../services/approvalService";

export function useApprovalQueue(options = {}) {
  return useQuery({
    queryKey: ["approvals", "queue"],
    queryFn: () => approvalService.getQueue().then((r) => r.data),
    enabled: options.enabled ?? true,
  });
}

export function useApprovalActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["approvals"] });
    queryClient.invalidateQueries({ queryKey: ["requests"] });
  };

  const approve = useMutation({
    mutationFn: approvalService.approve,
    onSuccess: () => {
      toast.success("Request approved — moved to the next stage");
      invalidate();
    },
    onError: (err) => toast.error(err.response?.data?.detail || err.response?.data?.message || "Could not approve request"),
  });

  const reject = useMutation({
    mutationFn: approvalService.reject,
    onSuccess: () => {
      toast.success("Request rejected — the accountant has been notified");
      invalidate();
    },
    onError: (err) => toast.error(err.response?.data?.detail || err.response?.data?.message || "Could not reject request"),
  });

  return { approve, reject };
}