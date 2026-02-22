const STORAGE_KEY_EDIT_MODE_ALLOWED = "dashboard.editModeAllowed";
const STORAGE_KEY_EDIT_MODE_PASSCODE = "dashboard.editModePasscode";

/** Of de editmodus op dashboards mag worden gebruikt. Standaard true. */
export function getEditModeAllowed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_KEY_EDIT_MODE_ALLOWED);
    if (v === null) return true;
    return v === "1" || v === "true";
  } catch {
    return true;
  }
}

export function setEditModeAllowed(allowed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_EDIT_MODE_ALLOWED, allowed ? "1" : "0");
  } catch {
    // ignore
  }
}

/** Passcode voor editmodus. Leeg = geen passcode vereist. */
export function getEditModePasscode(): string {
  if (typeof window === "undefined") return "";
  try {
    const v = localStorage.getItem(STORAGE_KEY_EDIT_MODE_PASSCODE);
    return typeof v === "string" ? v : "";
  } catch {
    return "";
  }
}

export function setEditModePasscode(passcode: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_EDIT_MODE_PASSCODE, typeof passcode === "string" ? passcode : "");
  } catch {
    // ignore
  }
}

/** Controleer of de opgegeven code overeenkomt met de ingestelde passcode. Geen passcode = altijd waar. */
export function checkEditModePasscode(entered: string): boolean {
  const stored = getEditModePasscode();
  if (!stored.trim()) return true;
  return entered.trim() === stored.trim();
}
