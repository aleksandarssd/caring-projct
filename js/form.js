/**
 * RAUM IM LEBEN — form.js
 * Client-side validation, EmailJS integration, and beautiful email templates.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a free account at https://www.emailjs.com
 * 2. Add an email service (e.g. Gmail, Outlook) and note the Service ID
 * 3. Create TWO email templates:
 *    - "contact_form" for the contact page
 *    - "job_application" for the jobs page
 *    Both templates should have a single variable: {message_html}
 *    Set the "To Email" to: service@raumimleben-service.de
 * 4. Replace the IDs below with your actual EmailJS credentials
 */

// ═══════════════════════════════════════════
// EmailJS Configuration — REPLACE THESE IDs
// ═══════════════════════════════════════════
const EMAILJS_CONFIG = {
  publicKey: 'Pt_CEkLyG2fILXeaX',       // From EmailJS dashboard → Account → API Keys
  serviceId: 'service_en7ea4b',       // From EmailJS dashboard → Email Services
  contactTemplateId: 'template_30mj3eo',  // "Contact Us" template
  jobTemplateId: 'template_s2ngxmq'       // "Welcome" (Job Application) template
};

// ═══════════════════════════════════════════
// Beautiful HTML Email Templates
// ═══════════════════════════════════════════

function buildContactEmailHTML(data) {
  const leistungLabels = {
    '': '—',
    'alltagsbegleitung': 'Alltagsbegleitung & Betreuung',
    'begleitdienste': 'Begleitdienste außer Haus',
    'hauswirtschaft': 'Hauswirtschaftliche Unterstützung',
    'entlastung': 'Entlastung Angehöriger',
    'beratung': 'Beratungseinsätze §37,3 SGB XI',
    'andere': 'Andere / Allgemeine Anfrage'
  };

  const pflegegradLabels = {
    '': '—',
    'kein': 'Kein Pflegegrad',
    '1': 'Pflegegrad 1',
    '2': 'Pflegegrad 2',
    '3': 'Pflegegrad 3',
    '4': 'Pflegegrad 4',
    '5': 'Pflegegrad 5',
    'unbekannt': 'Weiß nicht / In Beantragung'
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f4f3;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2d6a4f 0%,#40916c 50%,#52b788 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                ✉️ Neue Kontaktanfrage
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                Eingegangen am ${dateStr} um ${timeStr} Uhr
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              
              <!-- Name -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Vor- und Nachname</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${escapeHtml(data.name)}</p>
                  </td>
                </tr>
              </table>

              <!-- Two columns: Leistung + Pflegegrad -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Gewünschte Leistung</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;">${leistungLabels[data.leistung] || '—'}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Pflegegrad</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;">${pflegegradLabels[data.pflegegrad] || '—'}</p>
                  </td>
                </tr>
              </table>

              <!-- City -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Stadt / Wohnort</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${escapeHtml(data.city)}</p>
                  </td>
                </tr>
              </table>

              <!-- Two columns: Phone + Email -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">📞 Telefon</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;">${data.phone ? escapeHtml(data.phone) : '—'}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #52b788;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">✉️ E-Mail</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color:#2d6a4f;text-decoration:none;">${escapeHtml(data.email)}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              ${data.message ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #2d6a4f;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">💬 Nachricht</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8faf9;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2d6a4f;">Raum im Leben Service UG</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">Diese Nachricht wurde über das Kontaktformular auf raumimleben.de gesendet.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


function buildJobEmailHTML(data) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit'
  });

  const filesSection = data.files && data.files.length > 0 ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:20px;background-color:#fef9ef;border-radius:12px;border-left:4px solid #d4a843;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">📎 Hochgeladene Dateien</p>
          ${data.files.map(f => `
            <p style="margin:0 0 6px;font-size:14px;color:#1a1a2e;">
              📄 <strong>${escapeHtml(f.name)}</strong> 
              <span style="color:#9ca3af;font-size:12px;">(${(f.size / 1024).toFixed(0)} KB)</span>
            </p>
          `).join('')}
          <p style="margin:12px 0 0;font-size:12px;color:#d97706;font-style:italic;">
            ⚠️ Hinweis: Dateianhänge werden über dieses Formular nicht direkt zugestellt. 
            Bitte kontaktieren Sie den/die Bewerber:in, um die Unterlagen anzufordern.
          </p>
        </td>
      </tr>
    </table>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a3a5c 0%,#2d6a4f 60%,#40916c 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                🌟 Neue Bewerbung eingegangen
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                Eingegangen am ${dateStr} um ${timeStr} Uhr
              </p>
            </td>
          </tr>

          <!-- Highlight badge -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:16px 24px;border-radius:12px;text-align:center;">
                    <p style="margin:0;font-size:15px;font-weight:600;color:#065f46;">
                      Jemand möchte Teil des Teams werden! 🎉
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 32px;">
              
              <!-- Name -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #2d6a4f;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Vor- und Nachname</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#1a1a2e;">${escapeHtml(data.name)}</p>
                  </td>
                </tr>
              </table>

              <!-- Two columns: Phone + Email -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">📞 Telefon</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;">${escapeHtml(data.phone)}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="padding:16px 20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #40916c;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">✉️ E-Mail</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color:#2d6a4f;text-decoration:none;">${escapeHtml(data.email)}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              ${data.message ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;background-color:#f8faf9;border-radius:12px;border-left:4px solid #2d6a4f;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">💬 Persönliche Nachricht</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Files -->
              ${filesSection}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8faf9;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2d6a4f;">Raum im Leben Service UG</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">Diese Bewerbung wurde über das Jobformular auf raumimleben.de gesendet.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


// ═══════════════════════════════════════════
// Utility: HTML escape for safe template injection
// ═══════════════════════════════════════════
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// ═══════════════════════════════════════════
// Determine which page we're on
// ═══════════════════════════════════════════
function getPageType() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('jobs')) return 'job';
  if (path.includes('contact')) return 'contact';
  // Fallback: check if the form has a file upload field (job page has one)
  if (document.getElementById('file-upload')) return 'job';
  return 'contact';
}


// ═══════════════════════════════════════════
// Send email via EmailJS
// ═══════════════════════════════════════════
async function sendFormEmail(form, pageType) {
  let data = {};
  let emailHtml = '';
  let templateId = '';

  if (pageType === 'contact') {
    data = {
      name: form.querySelector('#name')?.value?.trim() || '',
      leistung: form.querySelector('#leistung')?.value || '',
      pflegegrad: form.querySelector('#pflegegrad')?.value || '',
      city: form.querySelector('#city')?.value?.trim() || '',
      phone: form.querySelector('#phone')?.value?.trim() || '',
      email: form.querySelector('#email')?.value?.trim() || '',
      message: form.querySelector('#message')?.value?.trim() || ''
    };
    emailHtml = buildContactEmailHTML(data);
    templateId = EMAILJS_CONFIG.contactTemplateId;
  } else {
    // Job application
    const uploadedFiles = window.getUploadedFiles ? window.getUploadedFiles() : [];
    data = {
      name: form.querySelector('#name')?.value?.trim() || '',
      phone: form.querySelector('#phone')?.value?.trim() || '',
      email: form.querySelector('#email')?.value?.trim() || '',
      message: form.querySelector('#message')?.value?.trim() || '',
      files: uploadedFiles.map(f => ({ name: f.name, size: f.size }))
    };
    emailHtml = buildJobEmailHTML(data);
    templateId = EMAILJS_CONFIG.jobTemplateId;
  }

  // Send via EmailJS
  if (typeof emailjs !== 'undefined') {
    return emailjs.send(EMAILJS_CONFIG.serviceId, templateId, {
      subject: pageType === 'job'
        ? `🌟 Neue Bewerbung von ${data.name}`
        : `✉️ Neue Kontaktanfrage von ${data.name}`,
      content: emailHtml,
      message_html: emailHtml,
      from_name: data.name,
      from_email: data.email
    });
  } else {
    // EmailJS not loaded — log the data and reject to show a fallback message
    console.warn('EmailJS SDK not loaded. Form data:', data);
    throw new Error('EmailJS not loaded');
  }
}


// ═══════════════════════════════════════════
// Main: Validation + Submission
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }

  const forms = document.querySelectorAll('.validate-form');
  const pageType = getPageType();

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      // Reset all errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
        const input = group.querySelector('.form-input, .form-select, .form-textarea');
        if (input) input.classList.remove('error');
      });

      // Simple validation check
      requiredFields.forEach(field => {
        const group = field.closest('.form-group');

        if (!field.value.trim()) {
          isValid = false;
          if (group) group.classList.add('has-error');
          field.classList.add('error');
        } else if (field.type === 'email') {
          // Simple email regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            if (group) {
              group.classList.add('has-error');
              const errorText = group.querySelector('.form-error');
              if (errorText) errorText.textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
            }
            field.classList.add('error');
          }
        }
      });

      if (isValid) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn?.textContent;

        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Wird gesendet...';
          submitBtn.style.opacity = '0.7';
        }

        try {
          await sendFormEmail(form, pageType);

          // Show success
          const wrapper = form.closest('.form-wrapper');
          const successMsg = wrapper.querySelector('.form-success');

          form.style.display = 'none';
          if (successMsg) successMsg.classList.add('visible');

          // Scroll to success message
          wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
          console.error('Email send failed:', error);

          // Restore button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
          }

          // Show user-friendly error or fallback to mailto
          const data = {};
          const inputs = form.querySelectorAll('input, select, textarea');
          inputs.forEach(input => {
            if (input.name && input.type !== 'file') {
              data[input.name] = input.value;
            }
          });

          // Build a fallback mailto link
          const subject = pageType === 'job'
            ? `Bewerbung von ${data.name || 'Unbekannt'}`
            : `Kontaktanfrage von ${data.name || 'Unbekannt'}`;
          const body = Object.entries(data)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n');
          const mailto = `mailto:service@raumimleben-service.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

          // Show fallback success with mailto option
          const wrapper = form.closest('.form-wrapper');
          const successMsg = wrapper.querySelector('.form-success');

          if (successMsg) {
            successMsg.innerHTML = `
              <div class="form-success-icon">📧</div>
              <h3>Fast geschafft!</h3>
              <p>Unser Formularversand ist momentan nicht verfügbar. Bitte senden Sie Ihre Anfrage direkt per E-Mail:</p>
              <a href="${mailto}" class="btn btn-primary" style="margin-top: 16px; display: inline-block;">
                Per E-Mail senden
              </a>
            `;
            form.style.display = 'none';
            successMsg.classList.add('visible');
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    });

    // Clear error on input
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  });

  // ── File Upload Handling ──
  const uploadInput = document.getElementById('file-upload');
  const dropArea = document.getElementById('upload-drop-area');
  const fileList = document.getElementById('upload-filelist');

  if (uploadInput && dropArea && fileList) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
    let selectedFiles = [];

    function isAllowedFile(file) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    }

    function renderFileList() {
      fileList.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'form-upload-file';
        item.innerHTML = `
          <span class="form-upload-filename" title="${file.name}">\u{1F4C4} ${file.name}</span>
          <button type="button" class="form-upload-remove" data-index="${index}" aria-label="Datei entfernen">&times;</button>
        `;
        fileList.appendChild(item);
      });
    }

    function addFiles(files) {
      for (const file of files) {
        if (!isAllowedFile(file)) continue;
        if (file.size > MAX_FILE_SIZE) continue;
        // Avoid duplicates by name
        if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) continue;
        selectedFiles.push(file);
      }
      renderFileList();
    }

    uploadInput.addEventListener('change', () => {
      addFiles(uploadInput.files);
      uploadInput.value = ''; // reset so same file can be re-added if removed
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(event => {
      dropArea.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      dropArea.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-over');
      });
    });

    dropArea.addEventListener('drop', (e) => {
      addFiles(e.dataTransfer.files);
    });

    // Remove file
    fileList.addEventListener('click', (e) => {
      const btn = e.target.closest('.form-upload-remove');
      if (btn) {
        const index = parseInt(btn.dataset.index, 10);
        selectedFiles.splice(index, 1);
        renderFileList();
      }
    });

    // Expose selected files for form submission
    window.getUploadedFiles = () => selectedFiles;
  }
});
