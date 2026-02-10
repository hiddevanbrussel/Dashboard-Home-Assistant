const KEY = "onboarding_completed";

export function setOnboardingCompleted(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "true");
}

export function getOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "true";
}
