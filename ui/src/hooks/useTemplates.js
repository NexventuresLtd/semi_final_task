import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { templateService } from "../services/templateService";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => templateService.getTemplates().then((r) => r.data),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: templateService.createTemplate,
    onSuccess: () => {
      toast.success("Template saved");
      qc.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not save template"),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: templateService.deleteTemplate,
    onSuccess: () => {
      toast.success("Template deleted");
      qc.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not delete template"),
  });
}