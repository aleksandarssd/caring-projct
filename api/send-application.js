// api/send-application.js
// Vercel Serverless Function — Job application form with file attachments
// Uses Nodemailer + your All-Inkl SMTP credentials (stored as env vars)
//
// Required environment variables in Vercel dashboard:
//   SMTP_HOST   — e.g. w0XXX.kasserver.com  (from All-Inkl KAS → E-Mail → SMTP)
//   SMTP_PORT   — 587  (STARTTLS, recommended) or 465 (SSL)
//   SMTP_USER   — service@raumimleben-service.de
//   SMTP_PASS   — your email account password
//   MAIL_TO     — service@raumimleben-service.de  (recipient; change anytime)

import Busboy from 'busboy';
import nodemailer from 'nodemailer';

// ─── SMTP transport (configured from env vars) ────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for SSL, false for STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Parse multipart/form-data ────────────────────────────────────────────────
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files  = [];

    const bb = Busboy({
      headers: req.headers,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
    });

    bb.on('field', (name, val) => { fields[name] = val; });

    bb.on('file', (name, stream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end',  () => {
        files.push({
          filename,
          content:     Buffer.concat(chunks),
          contentType: mimeType,
        });
      });
    });

    bb.on('finish', () => resolve({ fields, files }));
    bb.on('error',  reject);

    req.pipe(bb);
  });
}

// ─── HTML email body ─────────────────────────────────────────────────────────
function buildEmailHTML(fields, files) {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const attachmentList = files.length > 0
    ? files.map(f => `<p style="margin:0 0 6px;font-size:14px;color:#1a1a2e;">📄 <strong>${esc(f.filename)}</strong></p>`).join('')
    : '<p style="margin:0;font-size:14px;color:#6b7280;font-style:italic;">Keine Unterlagen hochgeladen.</p>';

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a3a5c 0%,#2d6a4f 60%,#40916c 100%);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">🌟 Neue Bewerbung eingegangen</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Eingegangen am ${esc(dateStr)} um ${esc(timeStr)} Uhr</p>
        </td></tr>

        <!-- Highlight -->
        <tr><td style="padding:24px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:16px 24px;border-radius:12px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:600;color:#065f46;">Jemand möchte Teil des Teams werden! 🎉</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:24px 40px 32px;">

          <!-- Name -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr><td style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #2d6a4f;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Vor- und Nachname</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1a1a2e;">${esc(fields.name)}</p>
            </td></tr>
          </table>

          <!-- Phone + Email -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">📞 Telefon</p>
                <p style="margin:0;font-size:15px;color:#1a1a2e;">${esc(fields.phone) || '—'}</p>
              </td>
              <td width="4%"></td>
              <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">✉️ E-Mail</p>
                <p style="margin:0;font-size:15px;color:#1a1a2e;"><a href="mailto:${esc(fields.email)}" style="color:#2d6a4f;text-decoration:none;">${esc(fields.email)}</a></p>
              </td>
            </tr>
          </table>

          ${fields.message ? `
          <!-- Message -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr><td style="padding:20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #2d6a4f;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">💬 Persönliche Nachricht</p>
              <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.6;white-space:pre-wrap;">${esc(fields.message)}</p>
            </td></tr>
          </table>` : ''}

          <!-- Attachments -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr><td style="padding:20px;background-color:#f0fdf4;border-radius:12px;border-left:4px solid #16a34a;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">📎 Bewerbungsunterlagen</p>
              ${attachmentList}
              ${files.length > 0 ? '<p style="margin:12px 0 0;font-size:12px;color:#16a34a;font-style:italic;">✅ Dateien sind dieser E-Mail direkt als Anhang beigefügt.</p>' : ''}
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#f8faf9;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2d6a4f;">Raum im Leben Service UG</p>
          <p style="margin:0;font-size:12px;color:#9ca3af;">Diese Bewerbung wurde über das Jobformular auf raumimleben-service.de gesendet.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseMultipart(req);

    // Basic server-side validation
    if (!fields.name || !fields.email) {
      return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' });
    }

    const transport = createTransport();

    await transport.sendMail({
      from:        `"Raum im Leben – Bewerbungsformular" <${process.env.SMTP_USER}>`,
      to:          process.env.MAIL_TO,
      replyTo:     fields.email,                    // reply goes straight to the applicant
      subject:     `🌟 Neue Bewerbung von ${fields.name}`,
      html:        buildEmailHTML(fields, files),
      attachments: files,                           // nodemailer attaches them natively
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[send-application]', err);
    return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
  }
}

// Tell Vercel NOT to parse the body — busboy handles it raw
export const config = { api: { bodyParser: false } };
