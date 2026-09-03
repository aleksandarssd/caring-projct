/**
 * RAUM IM LEBEN — form.js
 * Client-side validation + submission via Vercel Serverless Functions.
 * No third-party email SDK required — files are sent as real multipart attachments.
 *
 * Endpoints:
 *   POST /api/send-application  — job application (multipart/form-data, supports files)
 *   POST /api/send-contact      — contact form (application/json)
 */

// ═══════════════════════════════════════════
// Determine which page we're on
// ═══════════════════════════════════════════
function getPageType() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('jobs')) return 'job';
  if (path.includes('contact')) return 'contact';
  // Fallback: check for file upload field (job page has one)
  if (document.getElementById('file-upload')) return 'job';
  return 'contact';
}


// ═══════════════════════════════════════════
// Send — job application (multipart, with files)
// ═══════════════════════════════════════════
async function sendApplication(form) {
  const uploadedFiles = window.getUploadedFiles ? window.getUploadedFiles() : [];

  const fd = new FormData();
  fd.append('name',    form.querySelector('#name')?.value?.trim()    || '');
  fd.append('phone',   form.querySelector('#phone')?.value?.trim()   || '');
  fd.append('email',   form.querySelector('#email')?.value?.trim()   || '');
  fd.append('message', form.querySelector('#message')?.value?.trim() || '');

  // Append each file — the server receives them as real binary attachments
  uploadedFiles.forEach((file) => fd.append('files', file, file.name));

  const res = await fetch('/api/send-application', {
    method: 'POST',
    body:   fd,                   // no Content-Type header — browser sets multipart boundary
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Serverfehler');
  }
}


// ═══════════════════════════════════════════
// Send — contact form (JSON)
// ═══════════════════════════════════════════
async function sendContact(form) {
  const data = {
    name:      form.querySelector('#name')?.value?.trim()      || '',
    leistung:  form.querySelector('#leistung')?.value          || '',
    pflegegrad:form.querySelector('#pflegegrad')?.value        || '',
    city:      form.querySelector('#city')?.value?.trim()      || '',
    phone:     form.querySelector('#phone')?.value?.trim()     || '',
    email:     form.querySelector('#email')?.value?.trim()     || '',
    message:   form.querySelector('#message')?.value?.trim()   || '',
  };

  const res = await fetch('/api/send-contact', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Serverfehler');
  }
}


// ═══════════════════════════════════════════
// Main: Validation + Submission
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  const forms    = document.querySelectorAll('.validate-form');
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

      // Validate required fields
      requiredFields.forEach(field => {
        const group = field.closest('.form-group');

        if (!field.value.trim()) {
          isValid = false;
          if (group) group.classList.add('has-error');
          field.classList.add('error');
        } else if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            if (group) {
              group.classList.add('has-error');
              const errorText = group.querySelector('.form-error');
              if (errorText) errorText.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            }
            field.classList.add('error');
          }
        }
      });

      if (!isValid) return;

      const submitBtn  = form.querySelector('[type="submit"]');
      const origText   = submitBtn?.textContent;
      const wrapper    = form.closest('.form-wrapper');
      const successMsg = wrapper?.querySelector('.form-success');

      // Loading state
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Wird gesendet…';
        submitBtn.style.opacity = '0.7';
      }

      try {
        if (pageType === 'job') {
          await sendApplication(form);
        } else {
          await sendContact(form);
        }

        // Show success
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
        wrapper?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      } catch (error) {
        console.error('Submission failed:', error);

        // Restore button
        if (submitBtn) {
          submitBtn.disabled    = false;
          submitBtn.textContent = origText;
          submitBtn.style.opacity = '1';
        }

        // Fallback: mailto link
        const name  = form.querySelector('#name')?.value  || '';
        const email = form.querySelector('#email')?.value || '';
        const subject = pageType === 'job'
          ? `Bewerbung von ${name}`
          : `Kontaktanfrage von ${name}`;
        const mailto = `mailto:service@raumimleben-service.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nE-Mail: ${email}`)}`;

        if (successMsg) {
          successMsg.innerHTML = `
            <div class="form-success-icon">📧</div>
            <h3>Fast geschafft!</h3>
            <p>Unser Formularversand ist momentan nicht verfügbar. Bitte senden Sie Ihre Anfrage direkt per E-Mail:</p>
            <a href="${mailto}" class="btn btn-primary" style="margin-top:16px;display:inline-block;">Per E-Mail senden</a>
          `;
          form.style.display = 'none';
          successMsg.classList.add('visible');
          wrapper?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Clear error on input
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        input.closest('.form-group')?.classList.remove('has-error');
      });
    });
  });


  // ── File Upload Handling ──────────────────────────────────────────────────
  const uploadInput = document.getElementById('file-upload');
  const dropArea    = document.getElementById('upload-drop-area');
  const fileList    = document.getElementById('upload-filelist');

  if (uploadInput && dropArea && fileList) {
    const MAX_FILE_SIZE       = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_TYPES       = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const ALLOWED_EXTENSIONS  = ['.pdf', '.doc', '.docx'];
    let selectedFiles         = [];

    function isAllowedFile(file) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    }

    function renderFileList() {
      fileList.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const item       = document.createElement('div');
        item.className   = 'form-upload-file';
        item.innerHTML   = `
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
        // Avoid duplicates
        if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) continue;
        selectedFiles.push(file);
      }
      renderFileList();
    }

    uploadInput.addEventListener('change', () => {
      addFiles(uploadInput.files);
      uploadInput.value = ''; // reset so the same file can be re-selected after removal
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

    dropArea.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));

    fileList.addEventListener('click', (e) => {
      const btn = e.target.closest('.form-upload-remove');
      if (btn) {
        selectedFiles.splice(parseInt(btn.dataset.index, 10), 1);
        renderFileList();
      }
    });

    // Expose selected files for the send function
    window.getUploadedFiles = () => selectedFiles;
  }
});
