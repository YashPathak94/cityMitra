// Minimal transactional email via Resend. Returns false when not configured so
// callers can degrade gracefully (e.g. show the reset link directly in dev).

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.EMAIL_FROM || "CityMitra <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html })
    });
    if (!response.ok) {
      console.error("resend send failed", await response.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("resend send error", error);
    return false;
  }
}
