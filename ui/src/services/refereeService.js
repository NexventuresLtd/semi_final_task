import axiosInstance from "./axiosInstance";

export const refereeService = {
  listContacts: () => axiosInstance.get("/referee/contacts"),
  createContact: (payload) => axiosInstance.post("/referee/contacts", payload),
  updateContact: (id, payload) => axiosInstance.patch(`/referee/contacts/${id}`, payload),
  deleteContact: (id) => axiosInstance.delete(`/referee/contacts/${id}`),

  listAssignments: () => axiosInstance.get("/referee/assignments"),
  createAssignment: (payload) => axiosInstance.post("/referee/assignments", payload),
  updateAssignmentStatus: (id, payload) => axiosInstance.patch(`/referee/assignments/${id}/status`, payload),
  deleteAssignment: (id) => axiosInstance.delete(`/referee/assignments/${id}`),

  listEvaluations: (refereeContactId) =>
    axiosInstance.get("/referee/evaluations", { params: refereeContactId ? { referee_contact_id: refereeContactId } : {} }),
  createEvaluation: (payload) => axiosInstance.post("/referee/evaluations", payload),
};