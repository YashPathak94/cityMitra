export type ActivityEvent = {
  type: string;
  city?: string;
  category?: string;
  label?: string;
  value?: number;
};

function getSessionId() {
  if (typeof window === "undefined") return "server";

  const existingSession = window.localStorage.getItem("citymitra-session-id");
  if (existingSession) return existingSession;

  const nextSession = crypto.randomUUID();
  window.localStorage.setItem("citymitra-session-id", nextSession);
  return nextSession;
}

export function trackActivity(event: ActivityEvent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...event,
    path: window.location.pathname,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString()
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/activity", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}
