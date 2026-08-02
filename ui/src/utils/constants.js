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

export const QUALIFICATION_BADGES = [
  { value: "youth_local", label: "Youth / Local Badge", level: 1 },
  { value: "semi_pro", label: "Semi-Pro Badge", level: 2 },
  { value: "top_tier_national", label: "Top-Tier National Badge", level: 3 },
  { value: "caf", label: "CAF Badge", level: 4 },
  { value: "fifa", label: "FIFA Badge", level: 5 },
];

export const DEPARTMENT_LABEL = Object.fromEntries(DEPARTMENTS.map((d) => [d.value, d.label]));
export const REFEREE_ROLES = ["Center Referee", "Assistant Referee 1", "Assistant Referee 2", "Fourth Official", "VAR"];
export const QUALIFICATION_BADGE_LABEL = Object.fromEntries(QUALIFICATION_BADGES.map((b) => [b.value, b.label]));
export const DEPARTMENT_CHART_LABEL = Object.fromEntries(DEPARTMENTS.map((d) => [d.value, d.label]));