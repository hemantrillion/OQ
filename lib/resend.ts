export interface EmailPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendResendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || '';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY is not configured in .env.local' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Booking OQ <${fromEmail}>`,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html || `<p>${payload.text || payload.subject}</p>`,
        text: payload.text || payload.subject,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.warn('Resend API response error:', data);
      return { success: false, error: data.message || `HTTP ${res.status}` };
    }

    return { success: true, id: data.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown network failure';
    console.error('Failed to send Resend email:', msg);
    return { success: false, error: msg };
  }
}
