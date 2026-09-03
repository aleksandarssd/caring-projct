// api/send-contact.js
// Vercel Serverless Function — Contact form (no file uploads, JSON body)
//
// Uses the same env vars as send-application.js:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO

import nodemailer from 'nodemailer';

// ─── SMTP transport ───────────────────────────────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── HTML email body ─────────────────────────────────────────────────────────
function buildEmailHTML(data) {
  const leistungLabels = {
    '': '—',
    'alltagsbegleitung': 'Alltagsbegleitung & Betreuung',
    'begleitdienste':    'Begleitdienste außer Haus',
    'hauswirtschaft':    'Hauswirtschaftliche Unterstützung',
    'entlastung':        'Entlastung Angehöriger',
    'beratung':          'Beratungseinsätze §37,3 SGB XI',
    'andere':            'Andere / Allgemeine Anfrage',
  };
  const pflegegradLabels = {
    '':          '—',
    'kein':      'Kein Pflegegrad',
    '1':         'Pflegegrad 1',
    '2':         'Pflegegrad 2',
    '3':         'Pflegegrad 3',
    '4':         'Pflegegrad 4',
    '5':         'Pflegegrad 5',
    'unbekannt': 'Weiß nicht / In Beantragung',
  };

  const now     = new Date();
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const esc     = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f4f3;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f3;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#2d6a4f 0%,#40916c 50%,#52b788 100%);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">✉️ Neue Kontaktanfrage</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Eingegangen am ${esc(dateStr)} um ${esc(timeStr)} Uhr</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">

          <!-- Name -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr><td style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Vor- und Nachname</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${esc(data.name)}</p>
            </td></tr>
          </table>

          <!-- Leistung + Pflegegrad -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Gewünschte Leistung</p>
                <p style="margin:0;font-size:15px;color:#1a1a2e;">${esc(leistungLabels[data.leistung] || '—')}</p>
              </td>
              <td width="4%"></td>
              <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Pflegegrad</p>
                <p style="margin:0;font-size:15px;color:#1a1a2e;">${esc(pflegegradLabels[data.pflegegrad] || '—')}</p>
              </td>
            </tr>
          </table>

          <!-- City -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr><td style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Stadt / Wohnort</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${esc(data.city)}</p>
            </td></tr>
          </table>

          <!-- Phone + Email -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">📞 Telefon</p>
                <p style="margin:0;font-size:15px;color:#1a1a2e;">${esc(data.phone) || '—'}</p>
              </td>
              <td width="4%"></td>
              <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">✉️ E-Mail</p>
                <p style="margin:0;font-size:15px;color:#1a1a2e;"><a href="mailto:${esc(data.email)}" style="color:#2d6a4f;text-decoration:none;">${esc(data.email)}</a></p>
              </td>
            </tr>
          </table>

          ${data.message ? `
          <!-- Message -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr><td style="padding:20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #2d6a4f;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">💬 Nachricht</p>
              <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.6;white-space:pre-wrap;">${esc(data.message)}</p>
            </td></tr>
          </table>` : ''}

        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#f8faf9;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2d6a4f;">Raum im Leben Service UG</p>
          <p style="margin:0;font-size:12px;color:#9ca3af;">Diese Nachricht wurde über das Kontaktformular auf raumimleben-service.de gesendet.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body; // Vercel auto-parses JSON bodies

    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' });
    }

    const transport = createTransport();

    await transport.sendMail({
      from:    `"Raum im Leben – Kontaktformular" <${process.env.SMTP_USER}>`,
      to:      process.env.MAIL_TO,
      replyTo: data.email,
      subject: `✉️ Neue Kontaktanfrage von ${data.name}`,
      html:    buildEmailHTML(data),
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[send-contact]', err);
    return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
  }
}
