/**
 * RAUM IM LEBEN — form.js
 * Client-side validation and simple UI feedback for forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.validate-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
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
        // Here you would normally send the data to a backend via fetch/XHR.
        // For this frontend template, we just show the success message.
        
        const wrapper = form.closest('.form-wrapper');
        const successMsg = wrapper.querySelector('.form-success');
        
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
        
        // Optionally scroll to top of form wrapper
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
