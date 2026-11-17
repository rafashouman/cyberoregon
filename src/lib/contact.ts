export const CONTACT_SERVICES = {
  pentest: "Pentest (Web / APIs / MCP / Mobile / IA / CAPT)",
  infrastructure: "Pentest Interno, Externo, Kiosk & Desktop (Thick Client)",
  code: "Source Code Review & Code Assisted Pen Test (CAPT)",
  "red-team": "Red Team (Exercise, Engenharia Social, Purple Team, Assumed Breach)",
  "security-review": "Security Review (Entra ID, AD, M365, Cloud, Pipeline & Gestão de Vulnerabilidades)",
  combined: "Escopo combinado (conforme detalhes)",
} as const;

export type ContactServiceKey = keyof typeof CONTACT_SERVICES;

export function contactHref(service: ContactServiceKey, details?: string) {
  const params = new URLSearchParams({ service });
  if (details) params.set("details", details);
  return `/contato#solicitacao?${params}`;
}
