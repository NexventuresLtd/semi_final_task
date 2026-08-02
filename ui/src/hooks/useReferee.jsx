import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { refereeService } from "../services/refereeService";

export function useRefereeContacts() {
  return useQuery({
    queryKey: ["referee", "contacts"],
    queryFn: () => refereeService.listContacts().then((r) => r.data),
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refereeService.createContact,
    onSuccess: () => {
      toast.success("Referee added to roster");
      qc.invalidateQueries({ queryKey: ["referee", "contacts"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not add referee"),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => refereeService.updateContact(id, payload),
    onSuccess: () => {
      toast.success("Referee details updated");
      qc.invalidateQueries({ queryKey: ["referee", "contacts"] });
      qc.invalidateQueries({ queryKey: ["referee", "assignments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not update referee"),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refereeService.deleteContact,
    onSuccess: () => {
      toast.success("Referee removed from roster");
      qc.invalidateQueries({ queryKey: ["referee", "contacts"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not remove referee"),
  });
}

export function useAssignments() {
  return useQuery({
    queryKey: ["referee", "assignments"],
    queryFn: () => refereeService.listAssignments().then((r) => r.data),
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refereeService.createAssignment,
    onSuccess: () => {
      toast.success("Assignment created");
      qc.invalidateQueries({ queryKey: ["referee", "assignments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not create assignment"),
  });
}

export function useUpdateAssignmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => refereeService.updateAssignmentStatus(id, payload),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["referee", "assignments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not update status"),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refereeService.deleteAssignment,
    onSuccess: () => {
      toast.success("Assignment removed");
      qc.invalidateQueries({ queryKey: ["referee", "assignments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not remove assignment"),
  });
}

export function useEvaluations(refereeContactId) {
  return useQuery({
    queryKey: ["referee", "evaluations", refereeContactId],
    queryFn: () => refereeService.listEvaluations(refereeContactId).then((r) => r.data),
  });
}

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refereeService.createEvaluation,
    onSuccess: () => {
      toast.success("Evaluation saved");
      qc.invalidateQueries({ queryKey: ["referee", "evaluations"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not save evaluation"),
  });
}