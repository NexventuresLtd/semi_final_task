export const REQUEST_TYPES = [
  { value: "memo", label: "Memo" },
  { value: "purchase_order", label: "Purchase Order" },
  { value: "reimbursement", label: "Reimbursement" },
  { value: "travel_advance", label: "Travel Advance" },
];

export const CURRENCIES = ["RWF", "USD"];

export const DEPARTMENTS = [
  { value: "finance", label: "Finance & Accounts" },
  { value: "club_licensing", label: "Club Licensing" },
  { value: "referee", label: "Referee" },
  { value: "development", label: "Development" },
  { value: "competition", label: "Competition" },
  { value: "legal", label: "Legal" },
  { value: "marketing_comms", label: "Marketing & Communication" },
  { value: "hr_contracts", label: "HR & Contracts" },
];

export const TEMPLATE_FIELD_TYPES = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Paragraph" },
  { value: "number", label: "Amount / Number" },
  { value: "date", label: "Date" },
];

export const DEPARTMENT_LABEL = Object.fromEntries(DEPARTMENTS.map((d) => [d.value, d.label]));